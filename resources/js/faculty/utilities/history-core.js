// resources/js/faculty/utilities/history-core.js
// Lightweight undo/redo core using snapshot functions per partial

import { snapshotMissionVision, snapshotCourseInfo, snapshotCriteria, snapshotIlo, snapshotAssessmentTasks } from './snapshot.js';

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

  function applyIlo(snap){
    const st = ensure('ilo');
    st.isApplying = true;
    try {
      const list = document.getElementById('syllabus-ilo-sortable');
      if (!list) return;
      
      // Clear existing rows
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      
      const ilos = Array.isArray(snap?.ilos) ? snap.ilos : [];
      
      if (ilos.length === 0) {
        // Show placeholder if no ILOs and one doesn't already exist
        if (!document.getElementById('ilo-placeholder')) {
          const placeholder = document.createElement('tr');
          placeholder.id = 'ilo-placeholder';
          placeholder.innerHTML = `
            <td colspan="2" class="text-center text-muted py-4">
              <p class="mb-2">No ILOs added yet.</p>
              <p class="mb-0"><small>Click the <strong>+</strong> button above to add an ILO or <strong>Load Predefined</strong> to import ILOs.</small></p>
            </td>
          `;
          list.appendChild(placeholder);
        }
      } else {
        // Recreate ALL ILO rows from snapshot, including empty ones
        ilos.forEach((ilo) => {
          const tr = document.createElement('tr');
          const dataId = ilo.id ? String(ilo.id) : `new-${Date.now()}-${ilo.position}`;
          tr.setAttribute('data-id', dataId);
          tr.innerHTML = `
            <td class="text-center align-middle">
              <div class="ilo-badge fw-semibold">${ilo.code || ''}</div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <textarea name="ilos[]" class="cis-textarea cis-field autosize flex-grow-1" placeholder="Description" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;">${ilo.description || ''}</textarea>
                <input type="hidden" name="code[]" value="${ilo.code || ''}">
                <button type="button" class="btn btn-sm btn-outline-danger btn-delete-ilo ms-2" title="Delete ILO">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>`;
          list.appendChild(tr);
        });
      }
      
      // Reinitialize autosize for textareas
      try {
        if (window.initAutosize) window.initAutosize();
        list.querySelectorAll('textarea.autosize').forEach(ta => {
          ta.style.height = 'auto';
          ta.style.height = (ta.scrollHeight || 0) + 'px';
        });
      } catch(e) {}
      
      try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}
      
      // After ILO structure changes, sync Assessment Tasks table to match new ILO count
      try {
        setTimeout(() => {
          if (window.syncATWithILO) {
            window.syncATWithILO();
          }
          // If this ILO snapshot includes AT data, restore it after sync
          // This is safe during undo/redo because it's part of the coordinated state restoration
          if (snap && snap.atSnapshot) {
            setTimeout(() => {
              const atSt = ensure('assessmentTasks');
              atSt.isApplying = true;
              try {
                applyAssessmentTasks(snap.atSnapshot);
              } finally {
                atSt.isApplying = false;
              }
            }, 150);
          }
        }, 50);
      } catch(e) {}
    } finally {
      st.isApplying = false;
    }
  }

  function applyAssessmentTasks(snap){
    const st = ensure('assessmentTasks');
    st.isApplying = true;
    try {
      const tbody = document.getElementById('at-tbody');
      const iloList = document.getElementById('syllabus-ilo-sortable');
      if (!tbody) return;
      
      // Get current ILO codes to map stored values to current columns
      const currentIloCodeMap = {}; // Map: column_index -> current_ilo_code
      if (iloList) {
        const iloRows = Array.from(iloList.querySelectorAll('tr')).filter(r => 
          r.querySelector('textarea[name="ilos[]"]') || r.querySelector('.ilo-badge')
        );
        iloRows.forEach((row, idx) => {
          const code = row.querySelector('input[name="code[]"]')?.value || `ILO${idx + 1}`;
          currentIloCodeMap[idx] = code;
        });
      }
      
      // Reverse map: ilo_code -> column_index for quick lookup
      const codeToColIndexMap = {};
      Object.entries(currentIloCodeMap).forEach(([colIdx, code]) => {
        codeToColIndexMap[code] = parseInt(colIdx);
      });
      
      const sections = Array.isArray(snap?.sections) ? snap.sections : [];
      
      sections.forEach((section) => {
        const sectionNum = section.section_num;
        
        // Restore main row code
        const mainRow = tbody.querySelector(`.at-main-row[data-section="${sectionNum}"]`);
        if (mainRow) {
          const mainCells = Array.from(mainRow.children);
          const mainCodeTa = mainCells[0]?.querySelector('textarea');
          if (mainCodeTa) mainCodeTa.value = section.main_code || '';
        }
        
        const subRows = tbody.querySelectorAll(`.at-sub-row[data-section="${sectionNum}"]`);
        
        section.sub_rows.forEach((subRowData, subIndex) => {
          const subRow = subRows[subIndex];
          if (!subRow) return;
          
          const cells = Array.from(subRow.children);
          const totalCols = cells.length;
          const iloStartIdx = 4;
          const iloEndIdx = totalCols - 3;
          
          // Restore code column (1st column, index 0)
          const codeTa = cells[0]?.querySelector('textarea');
          if (codeTa) codeTa.value = subRowData.code || '';
          
          // Skip task name column (index 1) - it's auto-synced from Criteria
          
          // Restore I/R/D value (3rd column, index 2)
          const irdTa = cells[2]?.querySelector('textarea');
          if (irdTa) irdTa.value = subRowData.ird || '';
          
          // Skip percent column (index 3) - it's auto-synced from Criteria
          
          // Restore ILO columns using smart code-based mapping
          // First clear all ILO columns
          for (let i = iloStartIdx; i < iloEndIdx; i++) {
            const ta = cells[i]?.querySelector('textarea');
            if (ta) ta.value = '';
          }
          
          // Then restore values by matching ILO codes to current columns
          const iloColumnsByCode = subRowData.ilo_columns_by_code || {};
          Object.entries(iloColumnsByCode).forEach(([iloCode, value]) => {
            const colIndex = codeToColIndexMap[iloCode];
            if (typeof colIndex !== 'undefined') {
              const cellIndex = iloStartIdx + colIndex;
              if (cellIndex < iloEndIdx) {
                const ta = cells[cellIndex]?.querySelector('textarea');
                if (ta) ta.value = value;
              }
            }
          });
          
          // Restore C/P/A columns
          const cpaColumns = subRowData.cpa_columns || [];
          const cTa = cells[totalCols - 3]?.querySelector('textarea');
          const pTa = cells[totalCols - 2]?.querySelector('textarea');
          const aTa = cells[totalCols - 1]?.querySelector('textarea');
          
          if (cTa) cTa.value = cpaColumns[0] || '';
          if (pTa) pTa.value = cpaColumns[1] || '';
          if (aTa) aTa.value = cpaColumns[2] || '';
        });
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
        case 'ilo':
          applyIlo(prev);
          break;
        case 'assessmentTasks':
          applyAssessmentTasks(prev);
          break;
        default:
          break;
      }
      currentSnap[key] = prev;
      lastHashes[key] = String(prev && prev.hash ? prev.hash : '');
    }
    // Defer clearing globalApplying until after setTimeout callbacks have fired
    setTimeout(() => {
      globalApplying = false;
      updateButtons();
    }, 150);
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
        case 'ilo':
          applyIlo(next);
          break;
        case 'assessmentTasks':
          applyAssessmentTasks(next);
          break;
        default:
          break;
      }
      currentSnap[key] = next;
      lastHashes[key] = String(next && next.hash ? next.hash : '');
    }
    // Defer clearing globalApplying until after setTimeout callbacks have fired
    setTimeout(() => {
      globalApplying = false;
      updateButtons();
    }, 150);
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
      try { const ilo = snapshotIlo(); safeInitialize('ilo', ilo); } catch(e) {}
      try { const at = snapshotAssessmentTasks(); safeInitialize('assessmentTasks', at); } catch(e) {}
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
      'revision_no','academic_year','revision_date','course_description','tla_strategies','contact_hours'
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

  function registerIloWatchers(){
    const st = ensure('ilo');
    const take = () => { if (st.isApplying || window.globalApplying) return; safePush('ilo', snapshotIlo()); };
    const list = document.getElementById('syllabus-ilo-sortable');
    if (list){
      // Action-based tracking: capture snapshot on row add/delete actions
      // Only track ILO changes; AT will sync automatically during undo/redo
      document.addEventListener('iloChanged', take);
      
      // Word-by-word text input tracking: capture on space, punctuation, or backspace
      let lastSavedText = {}; // Track last saved text per textarea
      list.addEventListener('input', (e) => {
        if (e.target && e.target.tagName === 'TEXTAREA' && e.target.name === 'ilos[]') {
          const ta = e.target;
          const row = ta.closest('tr');
          const rowId = row ? row.getAttribute('data-id') : 'unknown';
          const currentText = ta.value;
          const lastText = lastSavedText[rowId] || '';
          
          // Check for word-completing actions: space, punctuation, Enter, or backspace
          const lastChar = currentText[currentText.length - 1];
          const isWordDelimiter = /[\s.!?,;:"\-]/.test(lastChar); // space, period, punctuation
          const isBackspaceCompletion = currentText.length < lastText.length && /[\w]/.test(currentText[currentText.length - 1]); // backspace after word
          const hasRelevantChange = isWordDelimiter || isBackspaceCompletion;
          
          if (hasRelevantChange && currentText !== lastText) {
            lastSavedText[rowId] = currentText;
            take();
          }
        }
      }, { capture: true });
      
      // Track module focus
      list.addEventListener('focusin', () => { window.SVActiveModuleName = 'ilo'; }, true);
      list.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'ilo'; }, true);
    }
    // baseline snapshot (do not add to global history)
    try { safeInitialize('ilo', snapshotIlo()); } catch(e) {}
    updateButtons();
  }

  function registerAssessmentTasksWatchers(){
    const st = ensure('assessmentTasks');
    const take = () => { if (st.isApplying || window.globalApplying) return; safePush('assessmentTasks', snapshotAssessmentTasks()); };
    const debounce = (fn, ms) => { let t; return function(){ clearTimeout(t); const ctx=this, args=arguments; t=setTimeout(()=>fn.apply(ctx,args), ms); }; };
    const takeDebounced = debounce(take, 250);
    const tbody = document.getElementById('at-tbody');
    if (tbody){
      // Watch for input changes in editable fields
      tbody.addEventListener('input', takeDebounced, { capture: true });
      tbody.addEventListener('change', take, { capture: true });
      // Track module focus
      tbody.addEventListener('focusin', () => { window.SVActiveModuleName = 'assessmentTasks'; }, true);
      tbody.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'assessmentTasks'; }, true);
    }
    // baseline snapshot (do not add to global history)
    try { safeInitialize('assessmentTasks', snapshotAssessmentTasks()); } catch(e) {}
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
    registerIloWatchers();
    registerAssessmentTasksWatchers();
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
