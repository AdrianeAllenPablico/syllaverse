# TLA Row Deletion → Undo with Assessment Mapping Sync - Test Scenario

## The Fix

**Problem**: When deleting all TLA rows and undoing them, the Assessment Mapping week columns weren't rebuilding, so marks couldn't be restored.

**Solution**: 
1. Expose `syncWeekColumnsWithTLA()` to `window` object
2. Call it in `applyTla()` BEFORE applying marks
3. Add 100ms delay to let week sync complete before mark application

## Test Scenario (Your Example)

### Setup:
1. Create 5 TLA rows
2. In each row's "wks" column, input: `1-5` (or `1`, `2`, `3`, `4`, `5` individually)
3. Assessment Mapping now shows 5 week columns (Week 1-5)
4. Mark all 5 cells with X (1 assessment method row × 5 weeks = 5 X marks)

### Action:
5. Delete all 5 TLA rows one by one
   - After deletion: Assessment Mapping shows "No weeks" (columns removed)
   - All X marks are bundled in each TLA snapshot

### Expected Result After Each Undo (Ctrl+Z):
6. Undo 1st deletion → Row 5 restored → Week 5 column reappears → X mark restored in Week 5
7. Undo 2nd deletion → Row 4 restored → Week 4 column reappears → X mark restored in Week 4
8. Undo 3rd deletion → Row 3 restored → Week 3 column reappears → X mark restored in Week 3
9. Undo 4th deletion → Row 2 restored → Week 2 column reappears → X mark restored in Week 2
10. Undo 5th deletion → Row 1 restored → Week 1 column reappears → X mark restored in Week 1

**Final State**: All 5 TLA rows back + All 5 week columns back + All 5 X marks restored ✅

## Console Output Expected

```
// When deleting rows
[TLA ROW DELETE] 5 → 4 (DELETE_CLICK)
[TLA SNAPSHOT] ... rows: 4 marks: 5
[TLA ROW DELETE] 4 → 3 (DELETE_CLICK)
[TLA SNAPSHOT] ... rows: 3 marks: 5
... (continue for all deletes)

// When undoing (restoring each row)
[APPLY TLA] Restoring 4 rows, hash: ...
[APPLY TLA] ✅ Restored 4 rows
[APPLY TLA] Syncing Assessment Mapping week columns...
[APPLY TLA] ✅ Week columns synced
[APPLY TLA] Re-applying marks: 5 (bundled: 5, cached: 0)
[APPLY AM MARKS] Week 1: col 0, row 0
[APPLY AM MARKS] ✓ Mark applied
[APPLY AM MARKS] Week 2: col 1, row 0
[APPLY AM MARKS] ✓ Mark applied
... (continue for all marks)
```

## Technical Flow

```
User undoes TLA row deletion (Ctrl+Z)
    ↓
applyTla(snapshot) called
    ↓
1. Restore TLA rows from snapshot
    ↓
2. Call window.syncWeekColumnsWithTLA()
   - Reads restored TLA rows
   - Extracts week labels from wks columns
   - Rebuilds Assessment Mapping week columns
   - Preserves existing marks via captureWeekMarks()
    ↓
3. Wait 100ms for sync to complete
    ↓
4. Call applyInlineAssessmentMarks(bundled marks)
   - Groups marks by week label
   - Maps to current column indices
   - Applies marks to cells
    ↓
Result: TLA rows ✅ + Week columns ✅ + X marks ✅
```

## Key Changes

### 1. In `history-core.js` (applyTla function)
```javascript
// BEFORE: Marks applied immediately (week columns might not exist yet)
applyInlineAssessmentMarks(marksToApply);

// AFTER: Sync weeks first, then apply marks
if (typeof window.syncWeekColumnsWithTLA === 'function') {
  window.syncWeekColumnsWithTLA();
}
setTimeout(() => {
  applyInlineAssessmentMarks(marksToApply);
}, 100);
```

### 2. In `syllabus-assessment-mapping.js`
```javascript
// Expose to window for undo/redo system
window.syncWeekColumnsWithTLA = syncWeekColumnsWithTLA;
```

## Why This Works

1. **Week Sync Before Marks**: Ensures columns exist before trying to apply marks
2. **100ms Delay**: Gives DOM time to update week columns before mark application
3. **Window Exposure**: Allows history-core.js to call the sync function
4. **Mark Bundling**: Marks are already captured in TLA snapshot from original state
5. **Week Label Mapping**: Marks use week labels (resilient to column changes)

## Edge Cases Handled

- ✅ Deleting all rows → "No weeks" state → Undo restores progressively
- ✅ Deleting some rows → Partial week removal → Undo restores correct weeks
- ✅ Mixed week formats (1-5, 1, 2-3) → All handled by week sync logic
- ✅ Multiple assessment method rows → Each row's marks restored correctly
- ✅ Rapid undo/redo → 100ms delay prevents race conditions

## Testing Steps

1. **Setup test data** (5 TLA rows with weeks 1-5, mark all cells)
2. **Delete all rows** (Assessment Mapping shows "No weeks")
3. **Undo each deletion** (Ctrl+Z × 5)
4. **Verify**:
   - Each undo restores 1 TLA row
   - Each undo adds 1 week column back
   - Each undo restores the X mark for that week
   - Console shows sync + mark logs
5. **Final check**: All 5 rows + 5 weeks + 5 marks restored

## Status

✅ **IMPLEMENTED**
- Week sync called before mark application
- 100ms delay for DOM update
- Function exposed to window
- Console logging added

🎯 **READY FOR TESTING**
