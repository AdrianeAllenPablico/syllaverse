# TLA Row-Level Undo/Redo - Quick Reference Card

## What Changed?

### In `history-core.js`:

1. **applyTla()** - Enhanced logging for row restoration
2. **registerTlaWatchers()** - Added `trackRowChange()` function
3. **Global scope** - Added `lastRowStates` Map for tracking

## Key Functions

### `trackRowChange(tbody, action)`
```javascript
// Detects when row count changes
// Returns: true if change detected, false if not
// Logs: [TLA ROW ADD] or [TLA ROW DELETE]
// Calls: take() to snapshot

Example:
  2 rows → 3 rows: [TLA ROW ADD] 2 → 3 (MUTATION)
  3 rows → 2 rows: [TLA ROW DELETE] 3 → 2 (DELETE_CLICK)
```

### `take()`
```javascript
// Creates snapshot with:
// - All rows (current structure)
// - All assessment marks (bundled)
// - Hash for deduplication

// Skips if:
// - st.isApplying = true (undo/redo in progress)
// - window.globalApplying = true (global undo/redo)
// - Hash matches last snapshot (duplicate)
```

### `applyTla(snap)`
```javascript
// Restores TLA state:
// 1. Set st.isApplying = true
// 2. Clear tbody
// 3. Rebuild rows from snap.rows
// 4. Restore assessment marks
// 5. Set st.isApplying = false (after delay)

// Logs every step for debugging
```

## Important Variables

| Variable | Type | Purpose | Scope |
|----------|------|---------|-------|
| `lastRowStates` | Map | Tracks row count per partial | registerTlaWatchers |
| `lastTlaHash` | String | Deduplication hash | registerTlaWatchers |
| `st.isApplying` | Boolean | Flag during undo/redo | per partial |
| `window.globalApplying` | Boolean | Global undo/redo flag | window object |
| `suppressAssessmentMappingUntil` | Number | Timestamp for AM suppression | global |
| `lastValidAssessmentMarks` | Array | Cached marks from valid state | global |

## Console Log Patterns

### Adding Rows
```
[TLA INIT] Tracking 0 rows
[TLA ROW ADD] 0 → 1 (MUTATION)
[TLA SNAPSHOT] a1b2c3d4 rows: 1 marks: 0
```

### Deleting Rows
```
[TLA DELETE CLICKED] row-123
[TLA ROW DELETE] 3 → 2 (DELETE_CLICK)
[TLA SNAPSHOT] b2c3d4e5 rows: 2 marks: 5
```

### Undoing
```
[APPLY TLA] Restoring 3 rows, hash: b2c3d4e5
[APPLY TLA] ✅ Restored 3 rows
[APPLY TLA] Re-applying marks: 5 (bundled: 5, cached: 0)
```

### Duplicates (Skipped)
```
[TLA SNAPSHOT SKIP] Duplicate hash: a1b2c3d4
```

## Testing Checklist

### Basic Operations
- [ ] Add 1 row → Check log, undo works
- [ ] Add 3 rows → Each creates separate undo step
- [ ] Delete row → Check log, undo restores
- [ ] Edit content → Separate snapshot from row ops

### Mark Preservation
- [ ] Add row, mark cell, delete row → Mark saved in snapshot
- [ ] Undo delete → Row returns with mark
- [ ] Multiple undo levels → Marks progressively restored
- [ ] "No weeks" state → Cache prevents mark loss

### Edge Cases
- [ ] Add then immediately delete → Both undoable
- [ ] Mark cell, add row, delete → Order preserved
- [ ] Rapid add/delete → Each tracked
- [ ] 50+ undo/redo cycles → No performance issues

## API Reference

### External Functions (Safe to Call)

```javascript
// Trigger undo
document.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'z' }));

// Trigger redo
document.dispatchEvent(new KeyboardEvent('keydown', { ctrlKey: true, key: 'y' }));

// Set global applying flag
window.setGlobalApplying(true);  // Suppress watchers
window.setGlobalApplying(false); // Resume watchers

// Check current state
console.log('History items:', window.globalHistory?.length);
console.log('Redo items:', window.globalRedo?.length);
```

### Internal Functions (Don't Call Directly)

```javascript
// These are defined in registerTlaWatchers closure:
// - trackRowChange(tbody, action)
// - take()

// These are in registerAssessmentMappingWatchers closure:
// - trackMarkChange()
// - applyInlineAssessmentMarks()
```

## State Diagram

```
                     ┌─ User Interaction ─┐
                     │                     │
                  [Add]               [Delete]
                     │                     │
                     ▼                     ▼
           ┌──────────────────┐  ┌──────────────────┐
           │ trackRowChange() │  │ trackRowChange() │
           │   0→1 ADD        │  │   3→2 DELETE     │
           └────────┬─────────┘  └────────┬─────────┘
                    │                     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   take() snapshot   │
                    │ + mark bundling     │
                    │ + hash dedup        │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  safePush() to      │
                    │  globalHistory[]    │
                    └──────────┬──────────┘
                               │
               ┌───────────────┼───────────────┐
               │               │               │
             [Undo]          [Redo]        [Forward]
               │               │               │
               ▼               ▼               ▼
    ┌─────────────────┐ ┌────────────────┐ [Normal Use]
    │ Pop History[]   │ │ Pop Redo[]     │ [Another Op]
    │ Push Redo[]     │ │ Push History[] │
    │ applyTla()      │ │ applyTla()     │
    └─────────────────┘ └────────────────┘
            │                   │
            └─────────┬─────────┘
                      │
           ┌──────────▼──────────┐
           │   Restore TLA       │
           │   Restore Marks     │
           │   Update UI         │
           └─────────────────────┘
```

## Timing Diagram

```
User clicks add button
    │
    ├─ 0ms: Click event fires
    │
    ├─ 1ms: MutationObserver detects DOM change
    │
    ├─ 10ms: setTimeout triggers
    │       └─ trackRowChange() runs
    │       └─ Row count compared
    │       └─ take() called
    │
    ├─ 11ms: Snapshot created
    │       └─ Hash checked
    │       └─ Marks bundled
    │       └─ Push to history
    │
    ├─ 12ms: Console logs appear
    │
    └─ 100ms: UI fully updated

User presses Ctrl+Z (Undo)
    │
    ├─ 0ms: Keyboard event detected
    │
    ├─ 1ms: undo() called
    │       └─ Pop from history[]
    │       └─ Push to redo[]
    │       └─ applyTla() called
    │
    ├─ 2ms: st.isApplying = true
    │       └─ Suppress all watchers
    │
    ├─ 3ms: Restore rows from snapshot
    │       └─ Rebuild tbody
    │
    ├─ 50ms: Restore marks
    │        └─ applyInlineAssessmentMarks()
    │        └─ Map marks by week
    │        └─ Apply to current rows
    │
    ├─ 100ms: st.isApplying = false
    │         └─ Resume watchers
    │
    ├─ 101ms: UI shows previous state
    │
    └─ 150ms+: Ready for next operation
```

## Data Flow Example: Row Delete

```
User clicks delete button
         │
         ▼
    Delete click handler
    onclick → trackRowChange(tbody, 'DELETE_CLICK')
         │
         ▼
    [TLA DELETE CLICKED] row-123
         │
         ▼
    trackRowChange() runs
    - Current rows: 2
    - Last tracked: 3
    - Change: 3 → 2
         │
         ▼
    [TLA ROW DELETE] 3 → 2 (DELETE_CLICK)
         │
         ▼
    take() creates snapshot
    - snapshotTla() → {rows: 2, ...}
    - snapshotAssessmentMapping() → {marks: 3, ...}
    - Bundle marks into snapshot
         │
         ▼
    [TLA SNAPSHOT] a1b2c3d4 rows: 2 marks: 3
         │
         ▼
    safePush('tla', snapshot)
    - globalHistory[] += snapshot
    - globalRedo[] = []
         │
         ▼
    Later: User presses Ctrl+Z
         │
         ▼
    applyTla(snapshot)
    - Restore 3 rows
    - Restore marks
         │
         ▼
    [APPLY TLA] Restoring 3 rows, hash: a1b2c3d4
    [APPLY TLA] ✅ Restored 3 rows
    [APPLY TLA] Re-applying marks: 3 (bundled: 3, cached: 0)
         │
         ▼
    [APPLY AM MARKS] Week Week 1: col 0, row 0 ✓
    [APPLY AM MARKS] Week Week 1: col 0, row 1 ✓
    [APPLY AM MARKS] Week Week 2: col 1, row 0 ✓
         │
         ▼
    Row 3 visible again with 3 marks
```

## Browser Console Commands

```javascript
// View history
console.log(window.globalHistory.length, 'items');
window.globalHistory.slice(-5).forEach((h, i) => {
  console.log(i, h.partial, h.snap);
});

// View redo stack
console.log(window.globalRedo.length, 'items to redo');

// Check flags
console.log('globalApplying:', window.globalApplying);
console.log('suppressAssessmentMappingUntil:', window.suppressAssessmentMappingUntil);

// View last snapshot
const last = window.globalHistory[window.globalHistory.length - 1];
console.log('Last snapshot:', last.snap);

// Trigger undo (alternative to Ctrl+Z)
window.undo?.();

// Trigger redo (alternative to Ctrl+Y)
window.redo?.();
```

## Performance Tips

1. **Don't mark/delete rapidly** - Allow 100ms between actions for UI update
2. **Use word boundaries** - They naturally batch similar edits
3. **Large tables** - Consider pagination for 500+ rows
4. **Mobile devices** - May need longer delays (150-200ms)
5. **Monitor history length** - Warn users with 1000+ undo items

## Debugging Tips

1. **Check console logs** - Every operation logged
2. **Look for SKIP logs** - Indicates hash deduplication working
3. **Check mark count** - Should decrease when rows deleted
4. **Verify hash changes** - Different on each row change
5. **Monitor applying flag** - Should be true during undo/redo
6. **Check timestamps** - Gaps show where delays occur

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| No logs | Logging disabled or partial not initialized | Check console, refresh page |
| Duplicate undo steps | Hash dedup not working | Check lastTlaHash logic |
| Marks lost | Not bundled in snapshot | Verify applyTla bundling |
| UI doesn't update | st.isApplying not cleared | Check setTimeout timing |
| Watchers fire during undo | globalApplying not set | Call setGlobalApplying() |
| Row count wrong | trackRowChange not detecting | Check row selector query |

## Version History

- **2024-12-20**: Initial implementation
  - Row change detection via trackRowChange()
  - Mark bundling in snapshots
  - Enhanced logging throughout
  - Test suite and documentation

## Related Files

- [history-core.js](resources/js/faculty/utilities/history-core.js) - Main implementation
- [snapshot.js](resources/js/faculty/utilities/snapshot.js) - Snapshot capture
- [syllabus-tla.js](resources/js/faculty/pages/syllabus-tla.js) - TLA UI
- [syllabus-assessment-mapping.js](resources/js/faculty/pages/syllabus-assessment-mapping.js) - AM UI

---

**Last Updated**: 2024-12-20
**Status**: Ready for Testing
**Questions?** Check documentation files or console logs for details
