// resources/js/faculty/utilities/history-core.js
// Lightweight undo/redo core using snapshot functions per partial

import { snapshotMissionVision, snapshotCourseInfo, snapshotCriteria } from './snapshot.js';

(function(){
  const HISTORY_LIMIT = 200;
  const stacks = {}; // key -> { isApplying: boolean }
  // Global action timeline (chronological across all partials)
  const globalHistory = []; // Array<{ key, prev, next, ts }>
  const globalRedo = [];    // Array<{ key, prev, next, ts }>
  const currentSnap = {};   // key -> latest applied snapshot
  const lastHashes = {};    // key -> last applied hash
  let globalApplying = false; // prevent cross-module watcher reactions during programmatic apply
  let restricted = false;     // when true, disable undo/redo regardless of stacks

  function getActiveKey(){
    const k = (window.SVActiveModuleName || '').trim();
    if (k) return k;
    // Fallback: if mission/vision fields focused, prefer that
    const ae = document.activeElement;
    if (ae && (ae.id === 'vision-text' || ae.id === 'mission-text')) return 'missionVision';
    return 'missionVision';
  }

  function ensure(key){
    const k = key || getActiveKey();
    if (!stacks[k]) stacks[k] = { isApplying: false };
    return stacks[k];
  }

  function updateButtons(){
    try {
      const canUndo = !restricted && (globalHistory.length > 0);
      const canRedo = !restricted && (globalRedo.length > 0);
      const undoBtn = document.getElementById('syllabusUndoBtn');
      const redoBtn = document.getElementById('syllabusRedoBtn');
      if (undoBtn){
        undoBtn.disabled = !canUndo;
        undoBtn.setAttribute('aria-disabled', String(!canUndo));
        undoBtn.title = canUndo ? 'Undo (Ctrl+Z)' : 'Nothing to undo';
      }
      if (redoBtn){
        redoBtn.disabled = !canRedo;
        redoBtn.setAttribute('aria-disabled', String(!canRedo));
        redoBtn.title = canRedo ? 'Redo (Ctrl+Y / Ctrl+Shift+Z)' : 'Nothing to redo';
      }
    } catch(e) {}
  }

  function safeInitialize(key, snap){
    // Set baseline snapshot for a module without adding to global history
    currentSnap[key] = snap;
    lastHashes[key] = String(snap && snap.hash ? snap.hash : '');
  }

  function safePush(key, snap){
    if (globalApplying) return; // skip recording while applying programmatically
    const h = String(snap && snap.hash ? snap.hash : '');
    if (h && lastHashes[key] && h === lastHashes[key]) return; // skip duplicate
    const prev = currentSnap[key] || null;
    const entry = { key, prev, next: snap, ts: snap && snap.ts ? snap.ts : Date.now() };
    globalHistory.push(entry);
    if (globalHistory.length > HISTORY_LIMIT) globalHistory.shift();
    globalRedo.length = 0; // clear redo on new action
    currentSnap[key] = snap;
    lastHashes[key] = h;
    updateButtons();
  }

  function applyMissionVision(snap){
    const st = ensure('missionVision');
    st.isApplying = true;
    try {
      const vEl = document.getElementById('vision-text') || document.querySelector('[name="vision"]');
      const mEl = document.getElementById('mission-text') || document.querySelector('[name="mission"]');
      const findRow = (label) => (snap && snap.rows ? snap.rows.find(r => (r.label||'').toLowerCase() === label) : null);
      const vRow = findRow('vision');
      const mRow = findRow('mission');
      if (vEl && vRow) vEl.value = vRow.text || '';
      if (mEl && mRow) mEl.value = mRow.text || '';
      try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}
    } finally {
      st.isApplying = false;
    }
  }

  function applyCourseInfo(snap){
    const st = ensure('courseInfo');
    st.isApplying = true;
    try {
      const rows = Array.isArray(snap?.rows) ? snap.rows : [];
      rows.forEach(r => {
        const name = r && r.name ? r.name : null;
        if (!name) return;
        const el = document.querySelector('[name="'+name+'"]');
        if (el) el.value = r.value || '';
      });
      try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}
    } finally {
      st.isApplying = false;
    }
  }

  function undo(){
    if (!globalHistory.length) return false;
    globalApplying = true;
    const entry = globalHistory.pop();
    globalRedo.push(entry);
    const { key, prev } = entry;
    if (prev){
      switch(key){
        case 'missionVision':
          applyMissionVision(prev);
          break;
        case 'courseInfo':
          applyCourseInfo(prev);
          break;
        case 'criteria':
          if (window.performCriteriaUndo) window.performCriteriaUndo();
          break;
        default:
          break;
      }
      currentSnap[key] = prev;
      lastHashes[key] = String(prev && prev.hash ? prev.hash : '');
    }
    globalApplying = false;
    updateButtons();
    return true;
  }

  function redo(){
    if (!globalRedo.length) return false;
    globalApplying = true;
    const entry = globalRedo.pop();
    const { key, next } = entry;
    globalHistory.push(entry);
    if (next){
      switch(key){
        case 'missionVision':
          applyMissionVision(next);
          break;
        case 'courseInfo':
          applyCourseInfo(next);
          break;
        case 'criteria':
          if (window.performCriteriaRedo) window.performCriteriaRedo();
          break;
        default:
          break;
      }
      currentSnap[key] = next;
      lastHashes[key] = String(next && next.hash ? next.hash : '');
    }
    globalApplying = false;
    updateButtons();
    return true;
  }

  function setRestricted(flag){
    restricted = !!flag;
    updateButtons();
  }

  function resetAfterSave(){
    // Clear global stacks and set new baselines to current DOM values
    try {
      globalApplying = true;
      globalHistory.length = 0;
      globalRedo.length = 0;
      // Recompute baselines for known modules
      try { const mv = snapshotMissionVision(); safeInitialize('missionVision', mv); } catch(e) {}
      try { const ci = snapshotCourseInfo(); safeInitialize('courseInfo', ci); } catch(e) {}
      try { const cr = snapshotCriteria(); safeInitialize('criteria', cr); } catch(e) {}
    } finally {
      globalApplying = false;
      updateButtons();
    }
  }

  function debounce(fn, ms){
    let t; return function(){ clearTimeout(t); const ctx=this, args=arguments; t=setTimeout(()=>fn.apply(ctx,args), ms); };
  }

  function registerMissionVisionWatchers(){
    const st = ensure('missionVision');
    const take = () => { if (st.isApplying) return; safePush('missionVision', snapshotMissionVision()); };
    const takeDebounced = debounce(take, 250);
    const vEl = document.getElementById('vision-text') || document.querySelector('[name="vision"]');
    const mEl = document.getElementById('mission-text') || document.querySelector('[name="mission"]');
    if (vEl) { vEl.addEventListener('input', takeDebounced, { capture: true }); vEl.addEventListener('change', take, { capture: true }); }
    if (mEl) { mEl.addEventListener('input', takeDebounced, { capture: true }); mEl.addEventListener('change', take, { capture: true }); }
    // baseline snapshot (do not add to global history)
    try { safeInitialize('missionVision', snapshotMissionVision()); } catch(e) {}
    updateButtons();
  }

  function registerCourseInfoWatchers(){
    const st = ensure('courseInfo');
    const take = () => { if (st.isApplying) return; safePush('courseInfo', snapshotCourseInfo()); };
    const debounce = (fn, ms) => { let t; return function(){ clearTimeout(t); const ctx=this, args=arguments; t=setTimeout(()=>fn.apply(ctx,args), ms); }; };
    const takeDebounced = debounce(take, 250);
    const names = [
      'course_title','course_code','course_category','course_prerequisites',
      'semester','year_level','credit_hours_text','instructor_name','employee_code',
      'reference_cmo','instructor_designation','date_prepared','instructor_email',
      'revision_no','academic_year','revision_date','course_description','contact_hours'
    ];
    names.forEach(n => {
      const el = document.querySelector('[name="'+n+'"]');
      if (el){ el.addEventListener('input', takeDebounced, { capture: true }); el.addEventListener('change', take, { capture: true }); }
    });
    // baseline snapshot (do not add to global history)
    try { safeInitialize('courseInfo', snapshotCourseInfo()); } catch(e) {}
    updateButtons();
  }

  function registerCriteriaWatchers(){
    const st = ensure('criteria');
    const take = () => { if (st.isApplying) return; safePush('criteria', snapshotCriteria()); };
    const debounce = (fn, ms) => { let t; return function(){ clearTimeout(t); const ctx=this, args=arguments; t=setTimeout(()=>fn.apply(ctx,args), ms); }; };
    const takeDebounced = debounce(take, 250);
    const container = document.getElementById('criteria-sections-container');
    if (container){
      // Watch for input changes on all criteria inputs
      container.addEventListener('input', takeDebounced, { capture: true });
      container.addEventListener('change', take, { capture: true });
      // Watch for DOM changes (section/row additions/removals) via custom events
      document.addEventListener('criteriaChanged', takeDebounced);
      // Track module focus
      container.addEventListener('focusin', () => { window.SVActiveModuleName = 'criteria'; }, true);
      container.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'criteria'; }, true);
    }
    // baseline snapshot (do not add to global history)
    try { safeInitialize('criteria', snapshotCriteria()); } catch(e) {}
    updateButtons();
  }

  document.addEventListener('DOMContentLoaded', function(){
    // wire toolbar buttons
    const undoBtn = document.getElementById('syllabusUndoBtn');
    const redoBtn = document.getElementById('syllabusRedoBtn');
    if (undoBtn) undoBtn.addEventListener('click', () => undo());
    if (redoBtn) redoBtn.addEventListener('click', () => redo());

    // keyboard shortcuts
    document.addEventListener('keydown', function(e){
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && (e.key === 'z' || e.key === 'Z')))) { e.preventDefault(); redo(); }
    });

    // Update buttons on focus changes across the document to reflect active module
    document.addEventListener('focusin', updateButtons, true);
    document.addEventListener('pointerenter', function(e){
      // if hovering over inputs, refresh state (module may set SVActiveModuleName elsewhere)
      if (e && e.target && (e.target.closest && (e.target.closest('input,textarea,select,.sv-partial')))) updateButtons();
    }, true);

    // register mission/vision and course info
    registerMissionVisionWatchers();
    registerCourseInfoWatchers();
    registerCriteriaWatchers();
  });

  // expose API
  try {
    window.SVHistory = {
      pushSnapshot: safePush,
      refreshButtons: updateButtons,
      undo, redo,
      setRestricted,
      resetAfterSave,
      getActiveKey,
      applyMissionVision,
      applyCourseInfo,
    };
  } catch(e){}

})();
