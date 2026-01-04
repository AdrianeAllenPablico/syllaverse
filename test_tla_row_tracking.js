// Test Script for TLA Row-Level Undo/Redo
// Run this in browser console on the syllabus edit page

console.clear();
console.log('%c=== TLA ROW TRACKING TEST ===', 'font-size:16px;font-weight:bold;color:blue');

// Test 1: Monitor history stack
function testHistoryStack() {
  console.log('\n%c--- Test 1: History Stack ---', 'font-weight:bold');
  console.log('globalHistory length:', window.globalHistory?.length || 0);
  console.log('globalRedo length:', window.globalRedo?.length || 0);
  if (window.globalHistory) {
    window.globalHistory.slice(-3).forEach((snap, i) => {
      console.log(`  [${window.globalHistory.length - 3 + i}]`, snap.partial, 'hash:', snap.snap?.hash?.substring(0, 8));
    });
  }
}

// Test 2: Add row and verify snapshot
function testAddRow() {
  console.log('\n%c--- Test 2: Add Row ---', 'font-weight:bold');
  const btn = document.querySelector('#addTlaRowBtn');
  if (!btn) {
    console.warn('Add button not found');
    return;
  }
  const beforeCount = window.globalHistory?.length || 0;
  console.log('Before:', beforeCount, 'history items');
  btn.click();
  setTimeout(() => {
    const afterCount = window.globalHistory?.length || 0;
    console.log('After:', afterCount, 'history items');
    console.log('Added:', afterCount - beforeCount, 'new snapshot(s)');
    const latestTla = window.globalHistory?.find(h => h.partial === 'tla');
    if (latestTla) {
      console.log('Latest TLA snapshot:', latestTla.snap.rows.length, 'rows');
      console.log('  Marks:', latestTla.snap.assessmentMarks?.length || 0);
    }
  }, 100);
}

// Test 3: Delete row and verify snapshot
function testDeleteRow() {
  console.log('\n%c--- Test 3: Delete Row ---', 'font-weight:bold');
  const deleteBtn = document.querySelector('#tlaTable .remove-tla-row');
  if (!deleteBtn) {
    console.warn('Delete button not found');
    return;
  }
  const beforeCount = window.globalHistory?.length || 0;
  console.log('Before:', beforeCount, 'history items');
  deleteBtn.click();
  setTimeout(() => {
    const afterCount = window.globalHistory?.length || 0;
    console.log('After:', afterCount, 'history items');
    console.log('Added:', afterCount - beforeCount, 'new snapshot(s)');
  }, 100);
}

// Test 4: Undo and verify marks restored
function testUndoWithMarks() {
  console.log('\n%c--- Test 4: Undo with Marks ---', 'font-weight:bold');
  const beforeUndo = window.globalHistory?.length || 0;
  const beforeRedo = window.globalRedo?.length || 0;
  console.log('Before undo:', beforeUndo, 'history,', beforeRedo, 'redo');
  
  // Simulate undo via Ctrl+Z
  const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'z' });
  document.dispatchEvent(event);
  
  setTimeout(() => {
    const afterUndo = window.globalHistory?.length || 0;
    const afterRedo = window.globalRedo?.length || 0;
    console.log('After undo:', afterUndo, 'history,', afterRedo, 'redo');
    console.log('Changed:', beforeUndo - afterUndo, 'history items');
  }, 150);
}

// Test 5: Mark cell and verify individual snapshot
function testMarkCell() {
  console.log('\n%c--- Test 5: Mark Cell ---', 'font-weight:bold');
  const tbody = document.querySelector('#assessmentMappingTable tbody');
  if (!tbody) {
    console.warn('Assessment mapping table not found');
    return;
  }
  const cell = tbody.querySelector('td:not([style*="background"])');
  if (!cell) {
    console.warn('Unmarked cell not found');
    return;
  }
  const beforeCount = window.globalHistory?.length || 0;
  console.log('Before:', beforeCount, 'history items');
  cell.click();
  setTimeout(() => {
    const afterCount = window.globalHistory?.length || 0;
    console.log('After:', afterCount, 'history items');
    console.log('Added:', afterCount - beforeCount, 'mark snapshot(s)');
  }, 100);
}

// Test 6: Detailed logging snapshot
function testLoggingSnapshot() {
  console.log('\n%c--- Test 6: Logging Snapshot ---', 'font-weight:bold');
  const tlaSnaps = window.globalHistory?.filter(h => h.partial === 'tla') || [];
  console.log('Total TLA snapshots:', tlaSnaps.length);
  const latest = tlaSnaps[tlaSnaps.length - 1];
  if (latest) {
    console.log('Latest snapshot:');
    console.log('  Rows:', latest.snap.rows.length);
    console.log('  Marks bundled:', latest.snap.assessmentMarks?.length || 0);
    console.log('  Hash:', latest.snap.hash?.substring(0, 16) + '...');
    if (latest.snap.rows.length > 0) {
      console.log('  First row:', {
        ch: latest.snap.rows[0].ch,
        topic: latest.snap.rows[0].topic?.substring(0, 20),
        wks: latest.snap.rows[0].wks
      });
    }
  }
}

// Test 7: Global applying flag
function testGlobalApplying() {
  console.log('\n%c--- Test 7: Global Applying Flag ---', 'font-weight:bold');
  console.log('window.globalApplying:', window.globalApplying);
  console.log('setGlobalApplying function:', typeof window.setGlobalApplying);
  if (typeof window.setGlobalApplying === 'function') {
    window.setGlobalApplying(true);
    console.log('After setGlobalApplying(true):', window.globalApplying);
    window.setGlobalApplying(false);
    console.log('After setGlobalApplying(false):', window.globalApplying);
  }
}

// Quick Start Commands
console.log('\n%c=== QUICK START ===', 'font-size:14px;font-weight:bold;color:green');
console.log('Copy and paste these commands:');
console.log('1. testHistoryStack()  - Check history');
console.log('2. testAddRow()        - Add a row (then check console)');
console.log('3. testDeleteRow()     - Delete a row');
console.log('4. testUndoWithMarks() - Test undo');
console.log('5. testMarkCell()      - Mark a cell');
console.log('6. testLoggingSnapshot() - View latest snapshot');
console.log('7. testGlobalApplying() - Check flags');

// Initial state
testHistoryStack();
