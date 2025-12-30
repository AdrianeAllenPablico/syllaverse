/**
 * Mission & Vision Undo (stack + capture)
 * Exports initMissionVisionUndo to initialize handlers and state.
 */
export function initMissionVisionUndo(){
  if (window.mvUndoRedo && window.mvUndoRedo.__initialized) return window.mvUndoRedo;

  const MAX_STACK = 25;
  const past = [];
  const future = [];
  let applying = false;
  // Debounce/coalescing: commit edits after user pauses typing
  const EDIT_DEBOUNCE_MS = (typeof window !== 'undefined' && typeof window.SV_UNDO_DEBOUNCE_MS === 'number')
    ? Math.max(30, window.SV_UNDO_DEBOUNCE_MS)
    : 60; // very-fast default; runtime override via window.SV_UNDO_DEBOUNCE_MS
  const WORD_LIKE_WINDOW_MS = 1500; // window to merge same-action sequences
  let commitTimer = null;
  let lastCommittedSnap = null;
  let pendingSnap = null;
  let currentUnit = null; // { field: 'mission'|'vision', action: 'type'|'delete'|'paste'|'linebreak', lastTime: number, baselinePushed: boolean }

  // Debug logging toggle (set to true to always log)
  if (typeof window.SV_DEBUG_UNDO === 'undefined') window.SV_DEBUG_UNDO = true;

  function shortText(s){
    const t = (s ?? '').toString().replace(/\n/g, '⏎');
    return t.length > 50 ? t.slice(0, 47) + '…' : t;
  }

  function logHistory(reason){
    if (!window.SV_DEBUG_UNDO) return;
    const pastView = past.map((snap, i) => ({
      idx: i,
      mission: shortText(snap.mission),
      vision: shortText(snap.vision)
    }));
    const cur = lastCommittedSnap || snapshot();
    const futureView = future.map((snap, i) => ({
      idx: i,
      mission: shortText(snap.mission),
      vision: shortText(snap.vision)
    }));
    const unit = currentUnit ? `${currentUnit.field}/${currentUnit.action}` : 'none';
    try {
      console.groupCollapsed(`[MV Undo] ${reason}`);
      console.log('Unit:', unit);
      console.table({
        PastSize: past.length,
        FutureSize: future.length
      });
      console.log('Past →', pastView);
      console.log('Current →', { mission: shortText(cur.mission), vision: shortText(cur.vision) });
      console.log('Future →', futureView);
    } finally {
      console.groupEnd();
    }
  }

  function getFields(){
    const missionEl = document.getElementById('mission-text') || document.querySelector('[name="mission"]');
    const visionEl = document.getElementById('vision-text') || document.querySelector('[name="vision"]');
    return { missionEl, visionEl };
  }

  function snapshot(){
    const { missionEl, visionEl } = getFields();
    return {
      mission: missionEl ? (missionEl.value ?? '') : '',
      vision: visionEl ? (visionEl.value ?? '') : ''
    };
  }

  function applySnapshot(snap){
    const { missionEl, visionEl } = getFields();
    applying = true;
    try {
      if (missionEl) {
        missionEl.value = snap.mission ?? '';
        missionEl.dispatchEvent(new Event('input', { bubbles: true }));
        missionEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (visionEl) {
        visionEl.value = snap.vision ?? '';
        visionEl.dispatchEvent(new Event('input', { bubbles: true }));
        visionEl.dispatchEvent(new Event('change', { bubbles: true }));
      }
    } finally {
      applying = false;
    }
  }

  function isSame(a, b){
    return a && b && a.mission === b.mission && a.vision === b.vision;
  }

  function isBoundaryChar(ch){
    if (!ch || typeof ch !== 'string') return false;
    const c = ch.charAt(0);
    return c === ' ';
  }

  function scheduleCommit(){
    if (applying) return;
    // Take a fresh snapshot for pending state
    pendingSnap = snapshot();
    // No change since last committed -> ignore
    if (!lastCommittedSnap || isSame(pendingSnap, lastCommittedSnap)) return;
    // Debounce: coalesce rapid keystrokes into one commit
    clearTimeout(commitTimer);
    commitTimer = setTimeout(() => {
      // New change committed: update current baseline to latest content
      // Note: baseline should have been pushed at unit start; avoid duplicate pushes here.
      future.length = 0; // safety: clear redo on commit
      lastCommittedSnap = pendingSnap;
      pendingSnap = null;
      logHistory('commit (debounced)');
    }, EDIT_DEBOUNCE_MS);
  }

  function forceCommit(reason){
    if (applying) return;
    const cur = snapshot();
    if (!lastCommittedSnap || isSame(cur, lastCommittedSnap)) return;
    clearTimeout(commitTimer);
    future.length = 0;
    // Push baseline into past only if not already pushed for current unit
    const shouldPushBaseline = !(currentUnit && currentUnit.baselinePushed);
    if (shouldPushBaseline) {
      past.push(lastCommittedSnap);
      if (past.length > MAX_STACK) past.shift();
    }
    if (past.length > MAX_STACK) past.shift();
    lastCommittedSnap = cur;
    pendingSnap = null;
    logHistory(reason ? `commit (${reason})` : 'commit (force)');
  }

  function undo(){
    clearTimeout(commitTimer);
    // Ensure any pending edits are committed before undoing
    forceCommit('pre-undo');
    if (!past.length) return;
    const cur = lastCommittedSnap || snapshot();
    const prev = past.pop();
    future.push(cur);
    if (future.length > MAX_STACK) future.shift();
    applySnapshot(prev);
    lastCommittedSnap = prev;
    currentUnit = null;
    logHistory('undo');
  }

  function redo(){
    clearTimeout(commitTimer);
    // Ensure any pending edits are committed before redoing
    forceCommit('pre-redo');
    if (!future.length) return;
    const cur = lastCommittedSnap || snapshot();
    const next = future.pop();
    past.push(cur);
    if (past.length > MAX_STACK) past.shift();
    applySnapshot(next);
    lastCommittedSnap = next;
    currentUnit = null;
    logHistory('redo');
  }

  // Reset stacks to the current content (called after successful Save)
  function resetHistory(reason = 'reset'){
    clearTimeout(commitTimer);
    past.length = 0;
    future.length = 0;
    lastCommittedSnap = snapshot();
    pendingSnap = null;
    currentUnit = null;
    logHistory(reason);
  }

  // Expose globals for toolbar or console testing
  window.mvUndoRedo = { __initialized: true, past, future, undo, redo, snapshot, apply: applySnapshot, reset: resetHistory };
  window.mvUndo = undo;
  window.mvResetUndoRedo = resetHistory;
  // Maintain compatibility with legacy toolbar expecting _svUndoRedo
  try {
    window._svUndoRedo = { past, future, undo, redo, snapshot, apply: applySnapshot, reset: resetHistory };
    window._svUndo = undo;
    window._svRedo = redo;
    window._svUndoReset = resetHistory;
  } catch(e) {}

  // Capture initial committed state when DOM is ready
  document.addEventListener('DOMContentLoaded', function(){
    lastCommittedSnap = snapshot();
    logHistory('init');
    // After a successful global Save, reset stacks to the new baseline
    document.addEventListener('sv:save-state', function(e){
      try {
        const st = e && e.detail ? e.detail.state : '';
        if (st === 'saved') {
          resetHistory('reset after save');
        }
      } catch (_) {}
    });
  });

  // Capture on input/change (debounced by same-state check)
  // Input -> schedule debounced commit; Change/Blur -> immediate commit
  document.addEventListener('input', function(e){
    const t = e && e.target ? e.target : null;
    if (!t) return;
    // Ignore programmatic changes coming from applySnapshot
    if (applying || (e && e.isTrusted === false)) return;
    const nameAttr = t.getAttribute && t.getAttribute('name');
    const isMission = t.id === 'mission-text' || nameAttr === 'mission';
    const isVision = t.id === 'vision-text' || nameAttr === 'vision';
    const isMV = isMission || isVision;
    if (!isMV) return;

    // Determine field and action type (Word-like grouping)
    const field = isMission ? 'mission' : 'vision';
    const it = (e && e.inputType) ? e.inputType : '';
    let action = 'other';
    if (it.startsWith('insert')) {
      if (it === 'insertLineBreak') action = 'linebreak';
      else if (it === 'insertFromPaste' || it === 'insertFromDrop' || it === 'insertFromYank') action = 'paste';
      else action = 'type';
    } else if (it.startsWith('delete')) {
      action = 'delete';
    }

    // Only handle type/delete/linebreak/paste; skip unknown programmatic inputs
    if (action === 'other') return;

    const now = Date.now();
    const canExtend = currentUnit && currentUnit.field === field && currentUnit.action === action && (now - currentUnit.lastTime) <= WORD_LIKE_WINDOW_MS;

    // Boundaries: linebreak & paste commit immediately as their own units
    if (action === 'linebreak' || action === 'paste') {
      forceCommit(action);
      currentUnit = null;
      return;
    }

    // Switching action (type<->delete) or MV field -> commit previous unit
    if (currentUnit && (!canExtend)) {
      forceCommit();
    }

    // Start or extend the current unit
    const startingNewUnit = !currentUnit || (!canExtend);
    currentUnit = { field, action, lastTime: now, baselinePushed: currentUnit && currentUnit.baselinePushed ? currentUnit.baselinePushed : false };
    // If starting a new unit, push baseline immediately so Undo is enabled without waiting
    if (startingNewUnit && !currentUnit.baselinePushed) {
      past.push(lastCommittedSnap);
      if (past.length > MAX_STACK) past.shift();
      future.length = 0; // clear redo on new change
      currentUnit.baselinePushed = true;
      logHistory('unit start (baseline pushed)');
    }
    // Word-by-word boundaries
    if (action === 'type') {
      const inserted = (typeof e.data === 'string') ? e.data : '';
      if (isBoundaryChar(inserted)) {
        forceCommit('word-boundary');
        currentUnit = null;
        return;
      }
    } else if (action === 'delete') {
      try {
        const pos = (typeof t.selectionStart === 'number') ? t.selectionStart : null;
        if (pos !== null) {
          const before = t.value.charAt(Math.max(0, pos - 1));
          if (isBoundaryChar(before)) {
            forceCommit('word-boundary-del');
            currentUnit = null;
            return;
          }
        }
      } catch(_) {}
    }
    // No boundary reached yet: we keep accumulating within the current unit
  }, true);

  ['change','blur'].forEach(evt => {
    document.addEventListener(evt, function(e){
      const t = e && e.target ? e.target : null;
      if (!t) return;
      // Ignore programmatic changes coming from applySnapshot
      if (applying || (e && e.isTrusted === false)) return;
      const nameAttr = t.getAttribute && t.getAttribute('name');
      const isMV = t.id === 'mission-text' || t.id === 'vision-text' || nameAttr === 'mission' || nameAttr === 'vision';
      if (!isMV) return;
      forceCommit('blur');
      currentUnit = null;
    }, true);
  });

  // Keyboard shortcuts when mission/vision has focus (undo)
  document.addEventListener('keydown', function(e){
    const active = document.activeElement;
    const focusedMV = active && (active.id === 'mission-text' || active.id === 'vision-text'
      || (active.getAttribute && (active.getAttribute('name') === 'mission' || active.getAttribute('name') === 'vision')));
    if (!focusedMV) return;
    const isCtrl = e.ctrlKey || e.metaKey;
    if (!isCtrl) return;
    if (e.key === 'z' || e.key === 'Z') {
      if (!e.shiftKey) { undo(); e.preventDefault(); }
    }
  }, true);

  // Listen for global toolbar undo
  document.addEventListener('sv:undo', function(){
    const mod = (window.SVActiveModuleName || window.SVLastActiveModule || '').toLowerCase();
    if (mod === 'missionvision') undo();
  });

  return window.mvUndoRedo;
}
