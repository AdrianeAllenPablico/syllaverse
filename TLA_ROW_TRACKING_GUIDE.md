# TLA Row-Level Undo/Redo Implementation Guide

## Overview
TLA (Teaching & Learning Activities) table now supports individual row add/delete operation tracking. Each row addition or deletion is captured as a separate undo/redo step, not batched together.

## Key Components

### 1. Row Count Tracking (`trackRowChange` function)
Located in: `registerTlaWatchers()` in [history-core.js](resources/js/faculty/utilities/history-core.js#L1450-L1466)

```javascript
const trackRowChange = (tbody, action = 'MUTATION') => {
  if (st.isApplying || window.globalApplying) return;
  const rows = Array.from(tbody.querySelectorAll('tr:not(#tla-placeholder)'));
  const currentRowCount = rows.length;
  const lastRowCount = lastRowStates.get('count') || 0;
  if (currentRowCount !== lastRowCount) {
    lastRowStates.set('count', currentRowCount);
    if (currentRowCount > lastRowCount) {
      console.log(`[TLA ROW ADD] ${lastRowCount} → ${currentRowCount} (${action})`);
      take();
    } else {
      console.log(`[TLA ROW DELETE] ${lastRowCount} → ${currentRowCount} (${action})`);
      take();
    }
    return true;
  }
  return false;
};
```

### 2. Change Detection Triggers

#### Delete Button Click
Attached via click event listener on `.remove-tla-row` buttons:
- Logs `[TLA DELETE CLICKED]` with row ID
- Calls `trackRowChange()` after UI update (10ms delay)
- Detects row count decrease
- Creates snapshot if count changed

#### Row Mutations
MutationObserver watches tbody childList changes:
- Triggered when rows are added programmatically (via JS)
- Captures programmatic row additions from add button clicks
- Calls `trackRowChange()` after mutation (10ms delay)

### 3. Integration with Undo/Redo System

#### Snapshot Bundling
When row changes are detected, `take()` function:
1. Captures TLA table state via `snapshotTla()`
2. Includes all current rows (after change)
3. **Bundles assessment marks** from current Assessment Mapping state
4. Deduplicates via hash check (`lastTlaHash`)
5. Pushes to history stack via `safePush()`

#### Restoration
When undoing/redoing TLA:
1. `applyTla()` reconstructs rows in tbody
2. Runs `applyInlineAssessmentMarks()` to restore bundled marks
3. Marks use week label grouping for resilience
4. Out-of-bounds marks applied to last available row

### 4. State Preservation

#### Data Captured in Snapshots
```javascript
{
  id: "tla-123",
  rows: [
    {
      id: "row-1",
      ch: "CH1",
      topic: "...",
      wks: "1-3",
      outcomes: "...",
      ilo: "ILO1",
      so: "SO1",
      delivery: "Lecture",
      position: 1
    }
  ],
  assessmentMarks: [
    { rowIdx: 0, cellIdx: 2, weekLabel: "Week 1", marked: true },
    { rowIdx: 0, cellIdx: 3, weekLabel: "Week 2", marked: true }
  ],
  hash: "a1b2c3d4..."
}
```

#### Assessment Marks Preservation
- Bundled into TLA snapshots
- Cached via `lastValidAssessmentMarks` (preserves marks from valid week states)
- Applied on restore using week label grouping
- Handles out-of-bounds rows (applies to last available row)

### 5. Console Logging

#### Initialization
```
[TLA INIT] Tracking 3 rows
```

#### Row Operations
```
[TLA DELETE CLICKED] row-123
[TLA ROW DELETE] 3 → 2 (DELETE_CLICK)
[TLA SNAPSHOT] a1b2c3d4... rows: 2 (ch:wks...) marks: 0
```

```
[TLA ROW ADD] 2 → 3 (MUTATION)
[TLA SNAPSHOT] b2c3d4e5... rows: 3 (ch:wks...) marks: 2
```

#### Restoration
```
[APPLY TLA] Restoring 2 rows, hash: a1b2c3d4
[APPLY TLA] ✅ Restored 2 rows
[APPLY TLA] Re-applying marks: 2 (bundled: 2, cached: 3)
[APPLY AM MARKS] Week Week 1: col 2, row 0
[APPLY AM MARKS] ✓ Mark applied
```

#### Deduplication
```
[TLA SNAPSHOT SKIP] Duplicate hash: a1b2c3d4
```

## Testing Checklist

### Add Row Operations
- [ ] Add row 1 → Console shows `[TLA ROW ADD] 0 → 1`
- [ ] Add row 2 → Console shows `[TLA ROW ADD] 1 → 2`
- [ ] Each add creates separate undo step (undo twice should remove both)
- [ ] Marks persist with each add operation

### Delete Row Operations
- [ ] Add 3 rows with marks
- [ ] Delete row 1 → Console shows `[TLA ROW DELETE]`
- [ ] Delete row 2 → Shows separate `[TLA ROW DELETE]`
- [ ] Each delete is separate undo step

### Mark Preservation
- [ ] Add row with marks (e.g., Week 1, Week 2)
- [ ] Delete row → marks stored in snapshot
- [ ] Undo delete → row returns with **all marks intact**
- [ ] Multiple undo/redo cycles preserve marks correctly

### Row Content Changes
- [ ] Edit CH value at word boundary → snapshot created
- [ ] Edit Topic textarea at word boundary → snapshot created
- [ ] Delete characters (backspace) → snapshot created
- [ ] Content changes are **separate** from row add/delete snapshots

### Mixed Operations
- [ ] Add row → undo → row gone
- [ ] Edit content in row → undo → content reverted
- [ ] Delete row with marks → undo → row + marks restored
- [ ] Multiple operations undo/redo in correct order

## Architecture Decisions

### Why Individual Row Tracking?
- **User expectation**: Each click (add/delete) should be one undo step
- **Data integrity**: Marks bundled per row, not per action
- **Resilience**: Can undo/redo row count changes independent of content
- **Consistency**: Matches mark-level tracking (each mark = separate snapshot)

### Why Bundle Assessment Marks?
- **Preservation**: Marks lost if only TLA rows stored
- **Resilience**: Week labels survive column reordering
- **Recovery**: Multiple undo levels = progressive mark restoration

### Why Word-Boundary Snapshots for Content?
- **User-friendly**: Not on every keystroke
- **Performance**: Reduces snapshot count
- **Clarity**: Clear undo steps at logical breakpoints (words, sentences)

## Suppression & Timing

### Assessment Mapping Suppression
When TLA changes:
- Sets `suppressAssessmentMappingUntil = Date.now() + 1200`
- Assessment Mapping watcher skips if suppressed
- Prevents double-snapshot when TLA sync triggers AM mutations

### Timing Delays
- **TLA delete click** → 10ms before trackRowChange()
- **MutationObserver callback** → 50-100ms before trackRowChange()
- Ensures DOM is fully updated before snapshot

## Future Improvements

- [ ] Performance: Consider debouncing rapid row adds
- [ ] UX: Show row count in undo preview tooltip
- [ ] Analytics: Track which operations are undone most often
- [ ] Compression: Store row diffs instead of full table state
- [ ] Accessibility: Announce undo/redo actions to screen readers
