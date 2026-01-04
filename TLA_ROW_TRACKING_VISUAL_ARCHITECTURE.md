# TLA Row-Level Tracking: Visual Architecture

## System Overview Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SYLLABUS UNDO/REDO SYSTEM                        │
│                         (7 Partials)                                 │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────┐  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐
│    IGA      │  │     SO      │  │    CDIO      │  │     SDG     │
│  (Text)     │  │  (Text)     │  │  (Text)      │  │  (Rows)     │
└─────────────┘  └─────────────┘  └──────────────┘  └─────────────┘

┌──────────────────────┐  ┌───────────────────────┐
│  Course Policies     │  │  Assessment Mapping   │
│     (Text)           │  │  (Individual Marks) ✅│
└──────────────────────┘  └───────────────────────┘

                    ┌─────────────────────────┐
                    │    TLA ⭐ (NEW)         │
                    │   Row Add/Delete        │
                    │   + Content Changes     │
                    │   + Mark Bundling       │
                    └─────────────────────────┘
```

## TLA Row Tracking Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER ACTION                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
   ┌─────────────┐              ┌──────────────────────┐
   │ Add Button  │              │ Delete Button Click  │
   │   Click     │              │   (on row)           │
   └──────┬──────┘              └──────────┬───────────┘
          │                                │
          │ MutationObserver triggered     │ Click handler triggered
          │ (row added to DOM)             │
          │                                │
          └────────────┬───────────────────┘
                       │
                       ▼ (10ms delay)
      ┌────────────────────────────────────────────┐
      │      trackRowChange(tbody, action)         │
      │  (LOCAL FUNCTION - per partial)            │
      │                                            │
      │  1. Get current row count                  │
      │  2. Get last tracked count from Map        │
      │  3. Compare: changed?                      │
      │     - YES: Update Map, log, call take()    │
      │     - NO: Return (content change)          │
      └────────────────┬─────────────────────────┘
                       │
                       ▼
      ┌────────────────────────────────────────────┐
      │         Console Log Output                 │
      │                                            │
      │  [TLA ROW ADD] 2 → 3 (MUTATION)            │
      │  OR                                        │
      │  [TLA ROW DELETE] 3 → 2 (DELETE_CLICK)    │
      └────────────────┬─────────────────────────┘
                       │
                       ▼
      ┌────────────────────────────────────────────┐
      │           take() Function                  │
      │  (Create snapshot with current state)      │
      │                                            │
      │  1. Check globalApplying flag              │
      │  2. Get state machine flags                │
      │  3. Capture snapshotTla()                  │
      │  4. Capture snapshotAssessmentMapping()    │
      │  5. Bundle marks into snapshot             │
      │  6. Check hash (deduplication)             │
      │  7. Log snapshot details                   │
      │  8. Push to history stack                  │
      └────────────────┬─────────────────────────┘
                       │
                       ▼
      ┌────────────────────────────────────────────┐
      │  [TLA SNAPSHOT] hash rows marks            │
      │                                            │
      │  Example:                                  │
      │  [TLA SNAPSHOT] a1b2c3d4 rows: 3           │
      │     CH1:1-3, CH2:4-6, CH3:7-10            │
      │     marks: 5                               │
      └────────────────┬─────────────────────────┘
                       │
                       ▼
      ┌────────────────────────────────────────────┐
      │  safePush('tla', snapshot)                 │
      │                                            │
      │  - Push to globalHistory[]                 │
      │  - Clear globalRedo[] (new branch)         │
      │  - Each row op = 1 undo step               │
      └────────────────────────────────────────────┘
```

## Undo/Redo Process

```
┌────────────────────────────────────────────────────────┐
│              HISTORY STACK MANAGEMENT                  │
└────────────────────────────────────────────────────────┘

Initial State (0 rows):
globalHistory = [ ]
globalRedo = [ ]

After: Add Row 1
globalHistory = [ {partial: 'tla', snap: {rows: 1, marks: 0}} ]
globalRedo = [ ]

After: Add Row 2
globalHistory = [ {...}, {partial: 'tla', snap: {rows: 2, marks: 0}} ]
globalRedo = [ ]

After: Mark Cell (Week 1, Row 0)
globalHistory = [ {...}, {...}, {partial: 'am', snap: {marks: 1}} ]
globalRedo = [ ]

After: Delete Row 1
globalHistory = [ {...}, {...}, {...}, {partial: 'tla', snap: {rows: 1, marks: 1}} ]
globalRedo = [ ]

USER PRESSES CTRL+Z (Undo):
┌─────────────────────────────┐
│ Pop from globalHistory[]    │
│ Call applyTla(snap)         │
│ Push to globalRedo[]        │
└─────────────────────────────┘
globalHistory = [ {...}, {...}, {...} ]
globalRedo = [ {partial: 'tla', snap: {rows: 1, marks: 1}} ]
UI: Row 2 restored with 1 mark

PRESS CTRL+Z AGAIN (Undo):
globalHistory = [ {...}, {...} ]
globalRedo = [ {partial: 'tla', snap: {rows: 1, marks: 1}}, 
               {partial: 'am', snap: {marks: 1}} ]
UI: Mark removed (now 0 marks)

PRESS CTRL+Z AGAIN (Undo):
globalHistory = [ {...} ]
globalRedo = [ ..., {partial: 'tla', snap: {rows: 2}} ]
UI: Row 2 deleted

PRESS CTRL+Y (Redo):
┌─────────────────────────────┐
│ Pop from globalRedo[]       │
│ Call applyTla(snap)         │
│ Push to globalHistory[]     │
└─────────────────────────────┘
globalHistory = [ {...}, {partial: 'tla', snap: {rows: 2}} ]
globalRedo = [ ..., {partial: 'tla', snap: {rows: 1, marks: 1}} ]
UI: Row 2 restored
```

## Data Structure: TLA Snapshot

```
TLA Snapshot = {
  id: "tla-12345",
  
  rows: [
    {
      id: "row-1",                    ← Unique row ID
      ch: "CH1",                      ← Culminating Habit 1
      topic: "...",                   ← Topic text
      wks: "1-3",                     ← Week range
      outcomes: "...",                ← Learning outcomes
      ilo: "ILO1",                    ← Intended Learning Outcome
      so: "SO1",                      ← Student Outcome
      delivery: "Lecture",            ← Delivery method
      position: 1                     ← Order position
    },
    { ... row 2 ... },
    { ... row 3 ... }
  ],
  
  assessmentMarks: [
    {
      rowIdx: 0,                      ← Row index (0-based)
      cellIdx: 2,                     ← Column index (0-based)
      weekLabel: "Week 1",            ← Week name (resilient)
      marked: true                    ← Mark state
    },
    {
      rowIdx: 0,
      cellIdx: 3,
      weekLabel: "Week 2",
      marked: true
    },
    { ... more marks ... }
  ],
  
  hash: "a1b2c3d4e5f6g7h8"          ← For deduplication
}
```

## Resilient Mark Restoration Algorithm

```
┌──────────────────────────────────────────────────────┐
│  Apply Bundled Assessment Marks After TLA Undo/Redo │
└──────────────────────────────────────────────────────┘

Input: snap.assessmentMarks = [
  {rowIdx: 0, cellIdx: 0, weekLabel: "Week 1", marked: true},
  {rowIdx: 0, cellIdx: 1, weekLabel: "Week 2", marked: true},
  {rowIdx: 1, cellIdx: 0, weekLabel: "Week 1", marked: true}
]

Current State: 
  - Row 0 has 3 weeks (Week 1, Week 2, Week 3)
  - Row 1 has 3 weeks (Week 1, Week 2, Week 3)

Step 1: Group marks by week label
  marksByWeek = {
    "Week 1": [{rowIdx: 0, ...}, {rowIdx: 1, ...}],
    "Week 2": [{rowIdx: 0, ...}]
  }

Step 2: For each week group
  "Week 1" group:
    - Find current column for "Week 1" → colIdx = 0
    - Apply mark at row 0, col 0 ✓
    - Apply mark at row 1, col 0 ✓
  
  "Week 2" group:
    - Find current column for "Week 2" → colIdx = 1
    - Apply mark at row 0, col 1 ✓
    - Row 1 not in group (no Week 2 mark for row 1)

Result: Marks restored correctly even if:
  ✅ Columns were reordered
  ✅ Some rows deleted (apply to first available)
  ✅ Some weeks removed (skip that group)
  ✅ New weeks added (no marks, expected)
```

## Timeline: Detailed Operation Sequence

```
T=0ms   User clicks "Add Row" button
        │
T=1ms   MutationObserver detects tbody childList change
        │
T=10ms  setTimeout triggers trackRowChange()
        │ trackRowChange() compares row count
        │ lastRowStates.get('count') = 2
        │ current rows = 3 (new row added)
        │ MATCH: 2 < 3 → ROW ADD detected
        │
T=11ms  Console: [TLA ROW ADD] 2 → 3 (MUTATION)
        │
T=12ms  take() called
        │ Captures snapshotTla() → 3 rows
        │ Captures snapshotAssessmentMapping() → 0 marks
        │ Bundles into snapshot
        │ Checks hash deduplication
        │
T=13ms  Console: [TLA SNAPSHOT] a1b2c3d4 rows: 3 marks: 0
        │
T=14ms  safePush('tla', snapshot)
        │ Push to globalHistory[]
        │ globalHistory.length = 4
        │
T=100ms User marks a cell in Assessment Mapping
        │
T=101ms AM watcher detects state change
        │ lastMarksState Map tracks cell change
        │ (AM watcher NOT suppressed yet)
        │
T=102ms take() for Assessment Mapping
        │ Console: [AM MARK CHANGE] ...
        │ Push to globalHistory[]
        │ globalHistory.length = 5
        │
T=200ms User presses Ctrl+Z (Undo)
        │
T=201ms undo() function
        │ Pop from globalHistory[] (AM mark snapshot)
        │ globalHistory.length = 4
        │ Push to globalRedo[]
        │ Call applyAssessmentMapping()
        │ Console: [APPLY AM MARKS] ...
        │
T=202ms Mark disappears from UI
        │
T=251ms User presses Ctrl+Z again
        │
T=252ms undo() function
        │ Pop from globalHistory[] (TLA rows snapshot)
        │ globalHistory.length = 3
        │ Push to globalRedo[]
        │ Call applyTla(snap)
        │ st.isApplying = true
        │ suppressAssessmentMappingUntil = now + 1200ms
        │
T=253ms Console: [APPLY TLA] Restoring 2 rows, hash: ...
        │
T=254ms Tbody cleared, 2 rows rebuilt
        │
T=255ms Console: [APPLY TLA] ✅ Restored 2 rows
        │
T=256ms applyInlineAssessmentMarks() called
        │ No marks to restore (previous mark was undone)
        │
T=257ms Console: [APPLY TLA] Re-applying marks: 0 (bundled: 0, cached: 0)
        │
T=400ms (st.isApplying = false scheduled at T=251 + 150ms = T=401ms)
        │ Clear st.isApplying flag
        │
T=401ms Row count back to 2, no marks
        └─ UI reflects pre-operation state
```

## State Machine per Partial

```
TLA State Machine:
┌───────────┐
│ NOT_INIT  │ ← Initial state
└─────┬─────┘
      │ registerTlaWatchers()
      ▼
┌───────────────────────────────────────────┐
│            WATCHING                       │
│ (MutationObserver, click handlers, etc)   │
└─────────┬───────────────────────────┬─────┘
          │                           │
    User Action                  User Presses Undo/Redo
          │                           │
          ▼                           ▼
┌──────────────────────┐    ┌─────────────────────┐
│   IS_APPLYING=false  │    │  IS_APPLYING=true   │
│                      │    │                     │
│ trackRowChange()     │    │ Watchers skipped    │
│ runs normally        │    │ (150ms window)      │
│                      │    │                     │
│ take() creates snap  │    │ applyTla() runs     │
│ push to history      │    │ (no watcher fires)  │
└──────────┬───────────┘    └─────────┬───────────┘
           │                          │
           │ (150ms later)            │ (150ms later)
           │                          │
           └──────────┬───────────────┘
                      │
                      ▼
          ┌───────────────────────────┐
          │  IS_APPLYING=false        │
          │ Resume watching           │
          │ Ready for next action     │
          └───────────────────────────┘
```

## Deduplication Logic

```
Hash-Based Deduplication:

Take #1: snapshotTla() for 3 rows
  → hash = SHA256("3 rows...") = "a1b2c3d4"
  → lastTlaHash = null → PUSH to history ✓
  → Update lastTlaHash = "a1b2c3d4"

Take #2: snapshotTla() for 3 rows (no actual change)
  → hash = SHA256("3 rows...") = "a1b2c3d4"
  → lastTlaHash = "a1b2c3d4" → MATCH!
  → Console: [TLA SNAPSHOT SKIP] Duplicate hash: a1b2c3d4
  → DO NOT push to history ✗

Take #3: snapshotTla() for 3 rows (user added content)
  → hash = SHA256("3 rows with content") = "b2c3d4e5"
  → lastTlaHash = "a1b2c3d4" → DIFFERENT!
  → Console: [TLA SNAPSHOT] b2c3d4e5 rows: 3
  → PUSH to history ✓
  → Update lastTlaHash = "b2c3d4e5"

Result: Only unique states stored in history
  - Prevents "phantom" undo steps
  - Reduces memory usage
  - Improves undo/redo performance
```

## Legend

```
Symbol      Meaning
──────      ───────────────────────────────────
[...]       Console log output
✓           Success / Completed
✗           Skipped / Not done
⭐          New feature
✅          Implemented
⚠️          Warning/Attention
→           Direction/transformation
═           Important flow
├           Branch point
└           End point
T=Xms       Time in milliseconds
```

## Summary

- **Row Tracking**: Individual add/delete operations detected via row count comparison
- **Mark Bundling**: Each row operation captures current assessment marks in snapshot
- **Resilience**: Marks restored using week labels (not cell indices) for robustness
- **Deduplication**: Hash-based checks prevent duplicate snapshots in history
- **Timing**: 10ms delays ensure DOM is updated before snapshot
- **Flags**: Global flags prevent watcher recursion during undo/redo
- **Per-Partial**: Each partial (TLA, AM, etc) maintains own state machine
- **One-Action-One-Step**: Each user action (add/delete/mark) = one undo step
