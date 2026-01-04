// resources/js/faculty/utilities/history-core.js
// Lightweight undo/redo core using snapshot functions per partial

import { snapshotMissionVision, snapshotCourseInfo, snapshotCriteria, snapshotIlo, snapshotAssessmentTasks, snapshotIga, snapshotSo, snapshotCdio, snapshotSdg, snapshotCoursePolicies, snapshotTla, snapshotAssessmentMapping } from './snapshot.js';

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
  let suppressAtWatcherUntil = 0; // temporarily pause AT watcher after ILO structural events
  let suppressAssessmentMappingUntil = 0; // temporarily pause AM watcher when changes originate from TLA
  let lastValidAssessmentMarks = []; // Cache marks from before "No weeks" placeholder

  // Expose globalApplying on window so watchers can check it
  function setGlobalApplying(value) {
    globalApplying = value;
    window.globalApplying = value;
  }

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
    console.log('[APPLY ILO] Starting, ILO count:', snap?.ilos?.length || 0, 'has atSnapshot:', !!snap?.atSnapshot);
    if (snap?.atSnapshot) {
      console.log('[APPLY ILO] ✅ ASSOCIATED AT SNAPSHOT EXISTS - Will restore data:');
      console.log(JSON.stringify(snap.atSnapshot, null, 2));
    }
    try {
      const list = document.getElementById('syllabus-ilo-sortable');
      if (!list) {
        console.log('[APPLY ILO] ILO list not found');
        return;
      }
      
      // Clear existing rows
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      console.log('[APPLY ILO] Cleared existing rows');
      
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
      // Only sync the column structure, don't restore AT data
      // AT data is tracked independently and will be preserved across ILO undo/redo
      console.log('[APPLY ILO] After structure update, has atSnapshot:', !!snap?.atSnapshot);
      try {
        if (snap && snap.atSnapshot) {
          // If we have AT snapshot data, restore it (coordinated undo/redo)
          console.log('[APPLY ILO] Restoring AT data from snapshot, sections:', snap.atSnapshot?.sections?.length || 0);
          const atSt = ensure('assessmentTasks');
          atSt.isApplying = true;
          try {
            // First sync columns to match ILO count
            console.log('[APPLY ILO] Calling syncATWithILO()');
            if (window.syncATWithILO) {
              window.syncATWithILO();
            }
            // Then restore the AT data from snapshot
            console.log('[APPLY ILO] Calling applyAssessmentTasks()');
            applyAssessmentTasks(snap.atSnapshot);
            console.log('[APPLY ILO] AT data restored successfully');
          } finally {
            atSt.isApplying = false;
          }
        } else {
          // No AT snapshot, just sync the column structure
          console.log('[APPLY ILO] No AT snapshot, just syncing columns');
          if (window.syncATWithILO) {
            window.syncATWithILO();
          }
        }
      } catch(e) {
        console.error('[APPLY ILO] Error during AT sync:', e);
      }
    } finally {
      st.isApplying = false;
      console.log('[APPLY ILO] Completed');
    }
  }

  function applyAssessmentTasks(snap){
    const st = ensure('assessmentTasks');
    st.isApplying = true;
    console.log('[APPLY AT] Restoring sections:', snap?.sections?.length || 0, 'hash:', snap?.hash?.substring(0, 8));
    try {
      const tbody = document.getElementById('at-tbody');
      const iloList = document.getElementById('syllabus-ilo-sortable');
      if (!tbody) {
        console.log('[APPLY AT] tbody not found');
        return;
      }
      
      // First, sync AT structure to match current ILO count
      // This recreates the ILO columns if needed
      console.log('[APPLY AT] First sync, calling syncATWithILO()');
      try { if (window.syncATWithILO) window.syncATWithILO(); } catch(e){}
      
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
      console.log('[APPLY AT] ✅ Completed, sections:', sections.length);
    } finally {
      st.isApplying = false;
    }
  }

  function applyIga(snap){
    const st = ensure('iga');
    st.isApplying = true;
    try {
      const list = document.getElementById('syllabus-iga-sortable');
      if (!list) {
        console.warn('[APPLY IGA] IGA list not found');
        return;
      }

      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }

      const rows = Array.isArray(snap?.rows) ? snap.rows : [];

      const autosize = (ta) => {
        if (!ta) return;
        try { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight || 0) + 'px'; } catch (e) { /* noop */ }
      };

      if (rows.length === 0) {
        const placeholder = document.createElement('tr');
        placeholder.id = 'iga-placeholder';
        placeholder.innerHTML = `
          <td colspan="2" class="text-center text-muted py-4">
            <p class="mb-2">No IGAs added yet.</p>
            <p class="mb-0"><small>Click the <strong>+</strong> button above to add an IGA or <strong>Load Predefined</strong> to import IGAs.</small></p>
          </td>
        `;
        list.appendChild(placeholder);
      } else {
        rows.forEach((row, idx) => {
          const code = row.code || `IGA${idx + 1}`;
          const tr = document.createElement('tr');
          tr.className = 'iga-row';
          const dataId = row.id ? String(row.id) : `new-${Date.now()}-${idx}`;
          tr.setAttribute('data-id', dataId);
          tr.innerHTML = `
            <td class="text-center align-middle">
              <div class="iga-badge fw-semibold">${code}</div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="flex-grow-1 w-100">
                  <textarea name="iga_titles[]" class="cis-textarea cis-field autosize" placeholder="Title" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font-weight:700;" required></textarea>
                  <textarea name="igas[]" class="cis-textarea cis-field autosize" placeholder="Description" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;" required></textarea>
                </div>
                <input type="hidden" name="code[]" value="${code}">
                <button type="button" class="btn btn-sm btn-outline-danger btn-delete-iga ms-2" title="Delete IGA"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          `;

          list.appendChild(tr);

          const titleTa = tr.querySelector('textarea[name="iga_titles[]"]');
          const descTa = tr.querySelector('textarea[name="igas[]"]');
          if (titleTa) { titleTa.value = row.title || ''; autosize(titleTa); }
          if (descTa) { descTa.value = row.description || ''; autosize(descTa); }
        });
      }

      try { if (window.updateIgaVisibleCodes) window.updateIgaVisibleCodes(); } catch (e) { /* noop */ }
    } finally {
      st.isApplying = false;
    }
  }

  function applyCdio(snap){
    const st = ensure('cdio');
    st.isApplying = true;
    try {
      const list = document.getElementById('syllabus-cdio-sortable');
      if (!list) {
        console.warn('[APPLY CDIO] CDIO list not found');
        return;
      }

      while (list.firstChild) list.removeChild(list.firstChild);

      const rows = Array.isArray(snap?.rows) ? snap.rows : [];
      const autosize = (ta) => {
        if (!ta) return;
        try { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight || 0) + 'px'; } catch (e) { /* noop */ }
      };

      if (rows.length === 0) {
        const placeholder = document.createElement('tr');
        placeholder.id = 'cdio-placeholder';
        placeholder.innerHTML = `
          <td colspan="2" class="text-center text-muted py-4">
            <p class="mb-2">No CDIOs added yet.</p>
            <p class="mb-0"><small>Click the <strong>+</strong> button above to add a CDIO or <strong>Load Predefined</strong> to import CDIOs.</small></p>
          </td>
        `;
        list.appendChild(placeholder);
      } else {
        rows.forEach((row, idx) => {
          const code = row.code || `CDIO${idx + 1}`;
          const tr = document.createElement('tr');
          tr.className = 'cdio-row';
          const dataId = row.id ? String(row.id) : `new-${Date.now()}-${idx}`;
          tr.setAttribute('data-id', dataId);
          tr.innerHTML = `
            <td class="text-center align-middle">
              <div class="cdio-badge fw-semibold">${code}</div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="flex-grow-1 w-100">
                  <textarea name="cdio_titles[]" class="cis-textarea cis-field autosize" placeholder="Title" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font-weight:700;" required></textarea>
                  <textarea name="cdios[]" class="cis-textarea cis-field autosize" placeholder="Description" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;" required></textarea>
                  <input type="hidden" name="code[]" value="${code}">
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger btn-delete-cdio ms-2" title="Delete CDIO"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          `;
          list.appendChild(tr);

          const titleTa = tr.querySelector('textarea[name="cdio_titles[]"]');
          const descTa = tr.querySelector('textarea[name="cdios[]"]');
          if (titleTa) { titleTa.value = row.title || ''; autosize(titleTa); }
          if (descTa) { descTa.value = row.description || ''; autosize(descTa); }
        });
      }

      try { if (window.updateProgressBar) window.updateProgressBar(); } catch (e) { /* noop */ }
    } finally {
      st.isApplying = false;
    }
  }

  function applySdg(snap){
    const st = ensure('sdg');
    st.isApplying = true;
    try {
      const list = document.getElementById('syllabus-sdg-sortable');
      if (!list) {
        console.warn('[APPLY SDG] SDG list not found');
        return;
      }

      while (list.firstChild) list.removeChild(list.firstChild);

      const rows = Array.isArray(snap?.rows) ? snap.rows : [];
      const autosize = (ta) => {
        if (!ta) return;
        try { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight || 0) + 'px'; } catch (e) { /* noop */ }
      };

      if (rows.length === 0) {
        const placeholder = document.createElement('tr');
        placeholder.id = 'sdg-placeholder';
        placeholder.innerHTML = `
          <td colspan="2" class="text-center text-muted py-4">
            <p class="mb-2">No SDGs added yet.</p>
            <p class="mb-0"><small>Click the <strong>+</strong> button above to add an SDG or <strong>Load Predefined</strong> to import SDGs.</small></p>
          </td>
        `;
        list.appendChild(placeholder);
      } else {
        rows.forEach((row, idx) => {
          const code = row.code || `SDG${idx + 1}`;
          const tr = document.createElement('tr');
          tr.className = 'sdg-row';
          // Always set data-id - use original id or create temp id
          const dataId = row.id ? String(row.id) : `new-${Date.now()}-${idx}`;
          tr.setAttribute('data-id', dataId);
          tr.innerHTML = `
            <td class="text-center align-middle">
              <div class="sdg-badge fw-semibold">${code}</div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="flex-grow-1 w-100">
                  <textarea name="sdg_titles[]" class="cis-textarea cis-field autosize" placeholder="Title" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font-weight:700;" required></textarea>
                  <textarea name="sdgs[]" class="cis-textarea cis-field autosize" placeholder="Description" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;" required></textarea>
                  <input type="hidden" name="code[]" value="${code}">
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger btn-delete-sdg ms-2" title="Delete SDG"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          `;
          list.appendChild(tr);

          const titleTa = tr.querySelector('textarea[name="sdg_titles[]"]');
          const descTa = tr.querySelector('textarea[name="sdgs[]"]');
          if (titleTa) { titleTa.value = row.title || ''; autosize(titleTa); }
          if (descTa) { descTa.value = row.description || ''; autosize(descTa); }
        });
      }

      try { if (window.updateProgressBar) window.updateProgressBar(); } catch (e) { /* noop */ }
    } finally {
      st.isApplying = false;
    }
  }

  function applyCoursePolicies(snap){
    const st = ensure('coursePolicies');
    st.isApplying = true;
    try {
      const sections = ['policy', 'exams', 'dishonesty', 'dropping', 'other'];
      const textareas = document.querySelectorAll('.course-policies textarea[name="course_policies[]"]');
      const policies = snap?.policies || {};

      sections.forEach((section, idx) => {
        const ta = textareas[idx];
        if (ta) {
          ta.value = policies[section] || '';
          try {
            ta.style.height = 'auto';
            ta.style.height = (ta.scrollHeight || 0) + 'px';
          } catch (e) { /* noop */ }
        }
      });

      try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}
    } finally {
      st.isApplying = false;
    }
  }

  function applyTla(snap){
    const st = ensure('tla');
    st.isApplying = true;
    try {
      // Programmatic apply can trigger Assessment Mapping mutations; suppress AM watcher briefly
      suppressAssessmentMappingUntil = Date.now() + 1200;
      const tbody = document.querySelector('#tlaTable tbody');
      if (!tbody) {
        console.warn('[APPLY TLA] TLA tbody not found');
        return;
      }

      const rows = Array.isArray(snap?.rows) ? snap.rows : [];
      console.log('[APPLY TLA] Restoring', rows.length, 'rows, hash:', snap?.hash?.substring(0, 8));

      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);

      const autosize = (ta) => {
        if (!ta) return;
        try { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight || 0) + 'px'; } catch (e) { /* noop */ }
      };

      if (rows.length === 0) {
        const placeholder = document.createElement('tr');
        placeholder.id = 'tla-placeholder';
        placeholder.innerHTML = `
          <td colspan="8" class="text-center text-muted py-4">
            <p class="mb-2">No TLA activities added yet.</p>
            <p class="mb-0"><small>Click the <strong>+</strong> button above to add a TLA row.</small></p>
          </td>
        `;
        tbody.appendChild(placeholder);
      } else {
        rows.forEach((row, idx) => {
          const tr = document.createElement('tr');
          tr.className = 'text-center align-middle';
          const dataId = row.id ? String(row.id) : `new-${Date.now()}-${idx}`;
          tr.setAttribute('data-tla-id', dataId);
          tr.innerHTML = `
            <td class="tla-ch">
              <input name="tla[${idx}][ch]" form="syllabusForm" class="form-control cis-input text-center" value="${(row.ch || '').replace(/"/g, '&quot;')}" placeholder="-">
            </td>
            <td class="tla-topic text-start">
              <textarea name="tla[${idx}][topic]" form="syllabusForm" class="form-control cis-textarea autosize cis-field" rows="2" placeholder="-">${(row.topic || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            </td>
            <td class="tla-wks">
              <input name="tla[${idx}][wks]" form="syllabusForm" class="form-control cis-input text-center" value="${(row.wks || '').replace(/"/g, '&quot;')}" placeholder="-">
            </td>
            <td class="tla-outcomes text-start">
              <textarea name="tla[${idx}][outcomes]" form="syllabusForm" class="form-control cis-textarea autosize cis-field" rows="2" placeholder="-">${(row.outcomes || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            </td>
            <td class="tla-ilo">
              <input name="tla[${idx}][ilo]" form="syllabusForm" class="form-control cis-input text-center" value="${(row.ilo || '').replace(/"/g, '&quot;')}" placeholder="-">
            </td>
            <td class="tla-so">
              <input name="tla[${idx}][so]" form="syllabusForm" class="form-control cis-input text-center" value="${(row.so || '').replace(/"/g, '&quot;')}" placeholder="-">
            </td>
            <td class="tla-delivery">
              <textarea name="tla[${idx}][delivery]" form="syllabusForm" class="form-control cis-textarea autosize cis-field" rows="1" placeholder="-">${(row.delivery || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            </td>
            <td class="tla-actions text-center">
              <button type="button" class="btn btn-sm btn-outline-danger remove-tla-row" data-id="${dataId}" title="Delete Row"><i class="bi bi-trash"></i></button>
            </td>
            <input type="hidden" class="tla-id-field" name="tla[${idx}][id]" value="${row.id || ''}">
            <input type="hidden" class="tla-position-field" name="tla[${idx}][position]" value="${row.position || idx + 1}">
          `;
          tbody.appendChild(tr);

          const textareas = tr.querySelectorAll('textarea');
          textareas.forEach(ta => autosize(ta));
        });
        console.log('[APPLY TLA] ✅ Restored', rows.length, 'rows');
      }

      try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}

      // CRITICAL: Sync Assessment Mapping week columns with restored TLA rows BEFORE applying marks
      // This ensures week columns are rebuilt when TLA rows are restored via undo
      // Pass skipMarkHandling=true to prevent sync from interfering with our bundled marks
      if (typeof window.syncWeekColumnsWithTLA === 'function') {
        console.log('[APPLY TLA] Syncing Assessment Mapping week columns...');
        try {
          window.syncWeekColumnsWithTLA(true); // Skip mark handling during undo
          console.log('[APPLY TLA] ✅ Week columns synced (marks will be applied separately)');
        } catch(e) {
          console.warn('[APPLY TLA] Week sync failed:', e);
        }
      }

      // Re-apply bundled assessment marks AFTER week columns are synced
      // Increased delay to 200ms to ensure DOM is fully updated
      setTimeout(() => {
        if (snap && Array.isArray(snap.assessmentMarks)) {
          // Use bundled marks ONLY if they contain at least one actual "x" mark
          // Otherwise (e.g. snapshot taken after rows deleted / "No weeks"), fall back to last cached valid marks
          const hasValidMarks = snap.assessmentMarks.some(m => m.weekLabel && m.weekLabel !== 'No weeks' && m.marked);
          const marksToApply = hasValidMarks ? snap.assessmentMarks : lastValidAssessmentMarks;
          if (marksToApply.length > 0) {
            console.log('[APPLY TLA] Re-applying marks:', marksToApply.length, '(bundled:', snap.assessmentMarks.length, ', cached:', lastValidAssessmentMarks.length, ')');
            applyInlineAssessmentMarks(marksToApply);
          } else {
            console.log('[APPLY TLA] No marks to apply (bundled:', snap.assessmentMarks.length, ', cached:', lastValidAssessmentMarks.length, ')');
          }
        } else {
          console.log('[APPLY TLA] No bundled marks in snapshot');
        }
      }, 200); // Increased from 100ms to 200ms
    } finally {
      st.isApplying = false;
    }
  }

  function applyAssessmentMapping(snap){
    const st = ensure('assessment_mapping');
    st.isApplying = true;
    try {
      const weekTable = document.querySelector('.assessment-mapping table.week');
      if (!weekTable) {
        console.warn('[APPLY ASSESSMENT MAPPING] Week table not found');
        return;
      }

      // Only restore the x marks, don't touch structure (columns/rows are auto-synced from TLA/AT)
      const marks = snap?.marks || [];
      const headerLabels = Array.from(weekTable.querySelectorAll('tr:first-child th.week-number')).map(th => th.textContent.trim());
      const weekRows = Array.from(weekTable.querySelectorAll('tr:not(:first-child)'));

      // Clear all existing marks first
      weekRows.forEach(row => {
        const cells = row.querySelectorAll('td.week-mapping');
        cells.forEach(cell => {
          cell.textContent = '';
          cell.classList.remove('marked');
          cell.style.color = '';
        });
      });

      // Restore marks from snapshot
      marks.forEach(mark => {
        const row = weekRows[mark.rowIdx];
        if (row) {
          const cells = row.querySelectorAll('td.week-mapping');
          const label = mark.weekLabel;
          let targetIdx = -1;
          if (label) targetIdx = headerLabels.indexOf(label);
          if (targetIdx === -1) targetIdx = mark.cellIdx; // fallback if labels changed
          const cell = cells[targetIdx];
          if (cell && mark.marked) {
            cell.textContent = 'x';
            cell.classList.add('marked');
            cell.style.color = '#000';
          }
        }
      });

      try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}
    } finally {
      st.isApplying = false;
    }
  }

  // Apply assessment marks inline (used when applying TLA snapshots that carry marks)
  function applyInlineAssessmentMarks(marks){
    const weekTable = document.querySelector('.assessment-mapping table.week');
    if (!weekTable) {
      console.warn('[APPLY AM MARKS] Week table not found');
      return;
    }
    const allHeaders = Array.from(weekTable.querySelectorAll('tr:first-child th.week-number')).map(th => th.textContent.trim());
    const headerLabels = allHeaders.filter(label => label !== 'No weeks'); // Exclude placeholder
    const weekRows = Array.from(weekTable.querySelectorAll('tr:not(:first-child)'));
    console.log('[APPLY AM MARKS] Restoring', marks?.length || 0, 'marks to', weekRows.length, 'rows with', headerLabels.length, 'weeks: [' + headerLabels.join(', ') + ']');

    // Debug: Log actual marks structure
    if (marks && marks.length > 0) {
      console.log('[APPLY AM MARKS] First mark sample:', JSON.stringify(marks[0]));
      console.log('[APPLY AM MARKS] All marks:', marks.map(m => `row${m.rowIdx}:week"${m.weekLabel}":cell${m.cellIdx}=${m.marked}`).join(', '));
    }

    // Clear existing marks
    weekRows.forEach((row, idx) => {
      const cells = row.querySelectorAll('td.week-mapping');
      cells.forEach((cell, cIdx) => {
        cell.textContent = '';
        cell.classList.remove('marked');
        cell.style.color = '';
      });
      console.log('[APPLY AM MARKS] Cleared row', idx, '(' + cells.length + ' cells)');
    });

    let marksApplied = 0;
    // Build week->column index map for this state
    const weekToColIdx = {};
    headerLabels.forEach((label, idx) => {
      weekToColIdx[label] = idx;
    });

    console.log('[APPLY AM MARKS] Week→Column index map:', JSON.stringify(weekToColIdx));

    // Group marks by week for resilient application
    const marksByWeek = {};
    (marks || []).forEach(mark => {
      if (!mark || mark.weekLabel === 'No weeks') return;
      if (!marksByWeek[mark.weekLabel]) marksByWeek[mark.weekLabel] = [];
      marksByWeek[mark.weekLabel].push(mark);
    });

    console.log('[APPLY AM MARKS] Grouped marks by week: ' + Object.keys(marksByWeek).length + ' weeks with marks');

    // For each week that has marks, apply to all rows that exist for that week
    Object.entries(marksByWeek).forEach(([weekLabel, weekMarks]) => {
      const colIdx = weekToColIdx[weekLabel];
      console.log('[APPLY AM MARKS] ✓ Processing week "' + weekLabel + '" → column ' + colIdx + ' (' + weekMarks.length + ' marks)');
      if (typeof colIdx === 'undefined') {
        console.log('[APPLY AM MARKS] ✗ Week "' + weekLabel + '" NOT FOUND in headers [' + headerLabels.join(', ') + ']');
        return;
      }
      
      // Apply marks to rows (if rowIdx is out of bounds, apply to last available row)
      weekMarks.forEach((mark, markIdx) => {
        let row = weekRows[mark.rowIdx];
        const rowExists = !!row;
        console.log('[APPLY AM MARKS]   Mark ' + markIdx + ': rowIdx=' + mark.rowIdx + ' cellIdx=' + mark.cellIdx + ' marked=' + mark.marked + ' (row exists: ' + rowExists + ')');
        
        // If row doesn't exist (out of bounds during partial undo), use last available row
        if (!row && weekRows.length > 0) {
          row = weekRows[weekRows.length - 1];
          console.log('[APPLY AM MARKS]   Row ' + mark.rowIdx + ' out of bounds, using last row instead');
        }
        
        if (row && mark.marked) {
          const cells = row.querySelectorAll('td.week-mapping');
          console.log('[APPLY AM MARKS]     Accessing cell: row[' + mark.rowIdx + '] has ' + cells.length + ' cells, need colIdx=' + colIdx);
          const cell = cells[colIdx];
          if (cell) {
            cell.textContent = 'x';
            cell.classList.add('marked');
            cell.style.color = '#000';
            marksApplied++;
            console.log('[APPLY AM MARKS]     ✅ Applied mark to cell');
          } else {
            console.log('[APPLY AM MARKS]     ❌ Cell not found: cells[' + colIdx + '] is undefined (only ' + cells.length + ' cells exist)');
          }
        } else if (!mark.marked) {
          console.log('[APPLY AM MARKS]     Skip: mark.marked = false');
        }
      });
    });
    console.log('[APPLY AM MARKS] ✅ FINAL RESULT: Applied ' + marksApplied + ' out of ' + (marks?.length || 0) + ' marks');
  }

  function applySo(snap){
    const st = ensure('so');
    st.isApplying = true;
    try {
      const list = document.getElementById('syllabus-so-sortable');
      if (!list) {
        console.warn('[APPLY SO] SO list not found');
        return;
      }

      while (list.firstChild) list.removeChild(list.firstChild);

      const rows = Array.isArray(snap?.rows) ? snap.rows : [];
      const autosize = (ta) => {
        if (!ta) return;
        try { ta.style.height = 'auto'; ta.style.height = (ta.scrollHeight || 0) + 'px'; } catch (e) { /* noop */ }
      };

      if (rows.length === 0) {
        const placeholder = document.createElement('tr');
        placeholder.id = 'so-placeholder';
        placeholder.innerHTML = `
          <td colspan="2" class="text-center text-muted py-4">
            <p class="mb-2">No SOs added yet.</p>
            <p class="mb-0"><small>Click the <strong>+</strong> button above to add an SO or <strong>Load Predefined</strong> to import SOs.</small></p>
          </td>
        `;
        list.appendChild(placeholder);
      } else {
        rows.forEach((row, idx) => {
          const code = row.code || `SO${idx + 1}`;
          const tr = document.createElement('tr');
          tr.className = 'so-row';
          const dataId = row.id ? String(row.id) : `new-${Date.now()}-${idx}`;
          tr.setAttribute('data-id', dataId);
          tr.innerHTML = `
            <td class="text-center align-middle">
              <div class="so-badge fw-semibold">${code}</div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="flex-grow-1 w-100">
                  <textarea name="so_titles[]" class="cis-textarea cis-field autosize" placeholder="Title" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font-weight:700;" required></textarea>
                  <textarea name="sos[]" class="cis-textarea cis-field autosize" placeholder="Description" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;" required></textarea>
                  <input type="hidden" name="code[]" value="${code}">
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger btn-delete-so ms-2" title="Delete SO"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          `;
          list.appendChild(tr);

          const titleTa = tr.querySelector('textarea[name="so_titles[]"]');
          const descTa = tr.querySelector('textarea[name="sos[]"]');
          if (titleTa) { titleTa.value = row.title || ''; autosize(titleTa); }
          if (descTa) { descTa.value = row.description || ''; autosize(descTa); }
        });
      }

      try { if (window.updateProgressBar) window.updateProgressBar(); } catch (e) { /* noop */ }
    } finally {
      st.isApplying = false;
    }
  }

  function undo(){
    if (!globalHistory.length) return false;
    setGlobalApplying(true);
    const entry = globalHistory.pop();
    globalRedo.push(entry);
    const { key, prev } = entry;
    console.log('[UNDO #' + (200 - globalHistory.length) + '] key:', key, 'hash:', prev?.hash?.substring(0, 8), 'history remaining:', globalHistory.length, 'redo stack:', globalRedo.length);
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
        case 'cdio':
          applyCdio(prev);
          break;
        case 'sdg':
          applySdg(prev);
          break;
        case 'coursePolicies':
          applyCoursePolicies(prev);
          break;
        case 'tla':
          applyTla(prev);
          break;
        case 'assessment_mapping':
          applyAssessmentMapping(prev);
          break;
        case 'assessmentTasks':
          applyAssessmentTasks(prev);
          break;
        case 'iga':
          applyIga(prev);
          break;
        case 'so':
          applySo(prev);
          break;
        default:
          break;
      }
      currentSnap[key] = prev;
      lastHashes[key] = String(prev && prev.hash ? prev.hash : '');
    }
    // Defer clearing globalApplying until after setTimeout callbacks have fired
    setTimeout(() => {
      setGlobalApplying(false);
      updateButtons();
    }, 150);
    return true;
  }

  function redo(){
    if (!globalRedo.length) return false;
    setGlobalApplying(true);
    const entry = globalRedo.pop();
    const { key, next } = entry;
    globalHistory.push(entry);
    console.log('[REDO #' + (200 - globalRedo.length) + '] key:', key, 'hash:', next?.hash?.substring(0, 8), 'history:', globalHistory.length, 'redo remaining:', globalRedo.length);
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
        case 'cdio':
          applyCdio(next);
          break;
        case 'sdg':
          applySdg(next);
          break;
        case 'coursePolicies':
          applyCoursePolicies(next);
          break;
        case 'tla':
          applyTla(next);
          break;
        case 'assessment_mapping':
          applyAssessmentMapping(next);
          break;
        case 'assessmentTasks':
          applyAssessmentTasks(next);
          break;
        case 'iga':
          applyIga(next);
          break;
        case 'so':
          applySo(next);
          break;
        default:
          break;
      }
      currentSnap[key] = next;
      lastHashes[key] = String(next && next.hash ? next.hash : '');
    }
    // Defer clearing globalApplying until after setTimeout callbacks have fired
    setTimeout(() => {
      setGlobalApplying(false);
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
      try { const iga = snapshotIga(); safeInitialize('iga', iga); } catch(e) {}
      try { const so = snapshotSo(); safeInitialize('so', so); } catch(e) {}
      try { const cdio = snapshotCdio(); safeInitialize('cdio', cdio); } catch(e) {}
      try { const sdg = snapshotSdg(); safeInitialize('sdg', sdg); } catch(e) {}
      try { const cp = snapshotCoursePolicies(); safeInitialize('coursePolicies', cp); } catch(e) {}
      try { const tla = snapshotTla(); safeInitialize('tla', tla); } catch(e) {}
      try { const am = snapshotAssessmentMapping(); safeInitialize('assessment_mapping', am); } catch(e) {}
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
    const take = (eventDetail) => { 
      if (st.isApplying || window.globalApplying) {
        console.log('[ILO WATCHER] take() skipped, isApplying:', st.isApplying, 'globalApplying:', window.globalApplying);
        return; 
      }
      console.log('[ILO WATCHER] take() called');
      console.log('[ILO WATCHER] eventDetail passed:', eventDetail);
      console.log('[ILO WATCHER] eventDetail.atSnapshot:', eventDetail?.atSnapshot);
      // Capture ILO state and include AT snapshot if provided via event detail
      let snap = snapshotIlo();
      console.log('[ILO WATCHER] ILO snapshot created, ilos:', snap?.ilos?.length || 0);
      if (eventDetail && eventDetail.atSnapshot) {
        console.log('[ILO WATCHER] Merging AT snapshot into ILO snapshot, sections:', eventDetail.atSnapshot?.sections?.length || 0);
        console.log('[ILO WATCHER] ✅ MERGED AT SNAPSHOT - Full Data:');
        console.log(JSON.stringify(eventDetail.atSnapshot, null, 2));
        snap.atSnapshot = eventDetail.atSnapshot;
      } else {
        console.log('[ILO WATCHER] No AT snapshot to merge');
      }
      console.log('[ILO WATCHER] Final snap.atSnapshot:', snap?.atSnapshot ? 'exists' : 'null');
      safePush('ilo', snap); 
      // Suppress AT watcher for a short window so structural ILO changes don't double-push
      suppressAtWatcherUntil = Date.now() + 200;
    };
    const list = document.getElementById('syllabus-ilo-sortable');
    if (list){
      // Action-based tracking: capture snapshot on row add/delete actions
      document.addEventListener('iloChanged', (evt) => { 
        console.log('[ILO WATCHER] iloChanged event received, has detail:', !!evt?.detail);
        take(evt && evt.detail ? evt.detail : null);
      });
      
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
    let lastAtHash = null;
    const take = () => { 
      if (st.isApplying || window.globalApplying) return;
      if (Date.now() < suppressAtWatcherUntil) {
        console.log('[AT WATCHER] Suppressed due to recent ILO structural change');
        return;
      }
      const atSnapshot = snapshotAssessmentTasks();
      // Deduplicate: skip if same hash as last snapshot
      if (atSnapshot.hash === lastAtHash) {
        console.log('[AT SNAPSHOT SKIP] Duplicate hash:', atSnapshot.hash.substring(0, 8));
        return;
      }
      lastAtHash = atSnapshot.hash;
      console.log('[AT SNAPSHOT]', atSnapshot.hash.substring(0, 8), 'sections:', atSnapshot.sections.length);
      
      // Don't push standalone AT snapshots - only push merged ILO+AT snapshots
      // This prevents creating duplicate undo steps for AT-only changes
      
      // Merge with latest ILO snapshot (if exists) to maintain AT data with ILO changes
      const latestIloSnap = currentSnap['ilo'];
      if (latestIloSnap && Array.isArray(latestIloSnap.ilos)) {
        // Extract base ILO hash (remove any existing |at:... suffix to prevent chaining)
        const baseIloHash = (latestIloSnap.hash || '').split('|at:')[0];
        const combinedHash = `${baseIloHash}|at:${atSnapshot.hash || ''}`;
        
        // Skip if this exact combined hash already exists (avoid duplicate entries)
        if (latestIloSnap.hash === combinedHash) {
          console.log('[AT WATCHER] Skipping duplicate - hash unchanged:', combinedHash);
          return;
        }
        
        const merged = {
          ...latestIloSnap,
          atSnapshot,
          hash: combinedHash,
          ts: Date.now()
        };
        console.log('[AT WATCHER] AT data changed, pushing merged ILO+AT');
        console.log('[AT WATCHER] ✅ MERGED:', 'ilos:', merged.ilos?.length, 'sections:', merged.atSnapshot?.sections?.length, 'hash:', combinedHash.substring(0, 8));
        // Instead of creating a new undo step, fold AT edits into the latest ILO entry
        const lastEntry = globalHistory.length ? globalHistory[globalHistory.length - 1] : null;
        if (lastEntry && lastEntry.key === 'ilo') {
          lastEntry.next = merged;
          lastEntry.ts = merged.ts || Date.now();
          currentSnap['ilo'] = merged;
          lastHashes['ilo'] = combinedHash;
          updateButtons();
          return;
        }
        // Fallback: if no prior ILO entry, push a new one
        safePush('ilo', merged);
      }
    };
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
    // Listen for Assessment Tasks changes (AT columns sync with ILO changes)
    document.addEventListener('assessmentTasksChanged', take, { capture: true });
    // baseline snapshot (do not add to global history)
    try { safeInitialize('assessmentTasks', snapshotAssessmentTasks()); } catch(e) {}
    updateButtons();
  }

  function registerCdioWatchers(){
    const st = ensure('cdio');
    const take = () => {
      if (st.isApplying || window.globalApplying) return;
      try { safePush('cdio', snapshotCdio()); } catch (e) { /* noop */ }
    };
    const lastSavedText = new WeakMap();
    const list = document.getElementById('syllabus-cdio-sortable');
    if (list){
      // Action-based triggers
      list.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-cdio')) setTimeout(take, 0);
      }, { capture: true });

      // Word-boundary snapshots for CDIO text
      list.addEventListener('input', (e) => {
        const ta = e.target;
        if (!(ta && ta.tagName === 'TEXTAREA' && (ta.name === 'cdio_titles[]' || ta.name === 'cdios[]'))) return;
        const current = ta.value || '';
        const prev = lastSavedText.get(ta) || '';
        if (current === prev) return;
        const lastChar = current.slice(-1);
        const isDelimiter = /[\s.!?,;:"'\-]/.test(lastChar);
        const isDeletion = current.length < prev.length;
        if (isDelimiter || isDeletion) {
          lastSavedText.set(ta, current);
          take();
        }
      }, { capture: true });

      // Change fallback to capture blur
      list.addEventListener('change', (e) => {
        const ta = e.target;
        if (ta && ta.tagName === 'TEXTAREA' && (ta.name === 'cdio_titles[]' || ta.name === 'cdios[]')) {
          lastSavedText.set(ta, ta.value || '');
        }
        take();
      }, { capture: true });

      if (window.MutationObserver){
        const mo = new MutationObserver(() => take());
        mo.observe(list, { childList: true, subtree: true });
      }

      // Add / load predefined actions
      const addBtn = document.getElementById('cdio-add-header');
      if (addBtn) addBtn.addEventListener('click', () => setTimeout(take, 0));
      const confirmLoad = document.getElementById('confirmLoadPredefinedCdios');
      if (confirmLoad) confirmLoad.addEventListener('click', () => setTimeout(take, 300));

      list.addEventListener('focusin', () => { window.SVActiveModuleName = 'cdio'; }, true);
      list.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'cdio'; }, true);
    }
    try { safeInitialize('cdio', snapshotCdio()); } catch(e) {}
    updateButtons();
  }

  function registerSoWatchers(){
    const st = ensure('so');
    const take = () => {
      if (st.isApplying || window.globalApplying) return;
      try { safePush('so', snapshotSo()); } catch (e) { /* noop */ }
    };
    const lastSavedText = new WeakMap();
    const list = document.getElementById('syllabus-so-sortable');
    if (list){
      // Action-based triggers
      list.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-so')) setTimeout(take, 0);
      }, { capture: true });

      // Word-boundary snapshots for SO text
      list.addEventListener('input', (e) => {
        const ta = e.target;
        if (!(ta && ta.tagName === 'TEXTAREA' && (ta.name === 'so_titles[]' || ta.name === 'sos[]'))) return;
        const current = ta.value || '';
        const prev = lastSavedText.get(ta) || '';
        if (current === prev) return;
        const lastChar = current.slice(-1);
        const isDelimiter = /[\s.!?,;:"'\-]/.test(lastChar);
        const isDeletion = current.length < prev.length;
        if (isDelimiter || isDeletion) {
          lastSavedText.set(ta, current);
          take();
        }
      }, { capture: true });

      // Change fallback to capture blur
      list.addEventListener('change', (e) => {
        const ta = e.target;
        if (ta && ta.tagName === 'TEXTAREA' && (ta.name === 'so_titles[]' || ta.name === 'sos[]')) {
          lastSavedText.set(ta, ta.value || '');
        }
        take();
      }, { capture: true });

      if (window.MutationObserver){
        const mo = new MutationObserver(() => take());
        mo.observe(list, { childList: true, subtree: true });
      }

      // Add / load predefined actions
      const addBtn = document.getElementById('so-add-header');
      if (addBtn) addBtn.addEventListener('click', () => setTimeout(take, 0));
      const confirmLoad = document.getElementById('confirmLoadPredefinedSos');
      if (confirmLoad) confirmLoad.addEventListener('click', () => setTimeout(take, 300));

      list.addEventListener('focusin', () => { window.SVActiveModuleName = 'so'; }, true);
      list.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'so'; }, true);
    }
    try { safeInitialize('so', snapshotSo()); } catch(e) {}
    updateButtons();
  }

  function registerSdgWatchers(){
    const st = ensure('sdg');
    const take = () => {
      if (st.isApplying || window.globalApplying) return;
      try { safePush('sdg', snapshotSdg()); } catch (e) { /* noop */ }
    };
    const lastSavedText = new WeakMap();
    const list = document.getElementById('syllabus-sdg-sortable');
    if (list){
      // Action-based triggers
      list.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-sdg')) setTimeout(take, 0);
      }, { capture: true });

      // Word-boundary snapshots for SDG text
      list.addEventListener('input', (e) => {
        const ta = e.target;
        if (!(ta && ta.tagName === 'TEXTAREA' && (ta.name === 'sdg_titles[]' || ta.name === 'sdgs[]'))) return;
        const current = ta.value || '';
        const prev = lastSavedText.get(ta) || '';
        if (current === prev) return;
        const lastChar = current.slice(-1);
        const isDelimiter = /[\s.!?,;:"'\-]/.test(lastChar);
        const isDeletion = current.length < prev.length;
        if (isDelimiter || isDeletion) {
          lastSavedText.set(ta, current);
          take();
        }
      }, { capture: true });

      // Change fallback to capture blur
      list.addEventListener('change', (e) => {
        const ta = e.target;
        if (ta && ta.tagName === 'TEXTAREA' && (ta.name === 'sdg_titles[]' || ta.name === 'sdgs[]')) {
          lastSavedText.set(ta, ta.value || '');
        }
        take();
      }, { capture: true });

      if (window.MutationObserver){
        const mo = new MutationObserver(() => take());
        mo.observe(list, { childList: true, subtree: true });
      }

      // Add / load predefined actions
      const addBtn = document.getElementById('sdg-add-header');
      if (addBtn) addBtn.addEventListener('click', () => setTimeout(take, 0));
      const confirmLoad = document.getElementById('confirmLoadPredefinedSdgs');
      if (confirmLoad) confirmLoad.addEventListener('click', () => setTimeout(take, 300));

      list.addEventListener('focusin', () => { window.SVActiveModuleName = 'sdg'; }, true);
      list.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'sdg'; }, true);
    }
    try { safeInitialize('sdg', snapshotSdg()); } catch(e) {}
    updateButtons();
  }

  function registerCoursePoliciesWatchers(){
    const st = ensure('coursePolicies');
    const take = () => {
      if (st.isApplying || window.globalApplying) return;
      try { safePush('coursePolicies', snapshotCoursePolicies()); } catch (e) { /* noop */ }
    };
    const lastSavedText = new WeakMap();
    const textareas = document.querySelectorAll('.course-policies textarea[name="course_policies[]"]');
    
    textareas.forEach(ta => {
      // Word-boundary snapshots
      ta.addEventListener('input', (e) => {
        const current = ta.value || '';
        const prev = lastSavedText.get(ta) || '';
        if (current === prev) return;
        const lastChar = current.slice(-1);
        const isDelimiter = /[\s.!?,;:"'\-]/.test(lastChar);
        const isDeletion = current.length < prev.length;
        if (isDelimiter || isDeletion) {
          lastSavedText.set(ta, current);
          take();
        }
      }, { capture: true });

      // Change fallback
      ta.addEventListener('change', (e) => {
        lastSavedText.set(ta, ta.value || '');
        take();
      }, { capture: true });

      // Focus tracking
      ta.addEventListener('focusin', () => { window.SVActiveModuleName = 'coursePolicies'; }, true);
    });

    // Load predefined action
    const confirmLoad = document.getElementById('confirmLoadPredefinedPolicy');
    if (confirmLoad) confirmLoad.addEventListener('click', () => setTimeout(take, 300));

    try { safeInitialize('coursePolicies', snapshotCoursePolicies()); } catch(e) {}
    updateButtons();
  }

  function registerTlaWatchers(){
    const st = ensure('tla');
    let lastTlaHash = null;
    const lastRowStates = new Map(); // Track each row's state to detect row add/delete
    
    const take = () => {
      if (st.isApplying || window.globalApplying) return;
      try { 
        // When TLA changes, ignore the AM watcher for a short window so one user action = one undo step
        suppressAssessmentMappingUntil = Date.now() + 600;
        const snap = snapshotTla();
        // Deduplicate: skip if same hash as last snapshot
        if (snap.hash === lastTlaHash) {
          console.log('[TLA SNAPSHOT SKIP] Duplicate hash:', snap.hash.substring(0, 8));
          return;
        }
        lastTlaHash = snap.hash;
        try {
          const amSnap = snapshotAssessmentMapping();
          // Only cache marks that have valid week labels (not from "No weeks" state)
          if (amSnap && Array.isArray(amSnap.marks) && amSnap.marks.length > 0) {
            const hasValidLabels = amSnap.marks.some(m => m.weekLabel && m.weekLabel !== 'No weeks');
            if (hasValidLabels) {
              const newMarkedCount = amSnap.marks.filter(m => m.marked && m.weekLabel && m.weekLabel !== 'No weeks').length;
              const oldMarkedCount = (lastValidAssessmentMarks || []).filter(m => m.marked && m.weekLabel && m.weekLabel !== 'No weeks').length;
              // IMPORTANT: never shrink the cached pattern; only update if this snapshot has
              // at least as many concrete X marks as what we already have.
              if (newMarkedCount >= oldMarkedCount) {
                lastValidAssessmentMarks = amSnap.marks;
                console.log('[TLA SNAPSHOT] Cached valid marks:', lastValidAssessmentMarks.length, '(marked:', newMarkedCount, ')');
              } else {
                console.log('[TLA SNAPSHOT] Skip caching marks (new marked', newMarkedCount, '< old marked', oldMarkedCount, ')');
              }
            }
          }
          snap.assessmentMarks = amSnap ? amSnap.marks : [];
        } catch (e) { /* noop */ }
        console.log('[TLA SNAPSHOT]', snap.hash.substring(0, 8), 'rows:', snap.rows.length, snap.rows.map(r => r.ch + ':' + r.wks).join(', '), 'marks:', snap.assessmentMarks?.length || 0);
        safePush('tla', snap); 
      } catch (e) { console.warn('[TLA SNAPSHOT ERROR]', e); }
    };
    
    const lastSavedText = new WeakMap();
    const tbody = document.querySelector('#tlaTable tbody');
    
    // Define trackRowChange function for TLA row add/delete operations
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
    
    if (tbody){
      // Initialize row count tracking
      const initialRows = Array.from(tbody.querySelectorAll('tr:not(#tla-placeholder)'));
      lastRowStates.set('count', initialRows.length);
      console.log('[TLA INIT] Tracking', initialRows.length, 'rows');
      
      // Action-based triggers for row operations
      tbody.addEventListener('click', (e) => {
        if (e.target.closest('.remove-tla-row')) {
          console.log('[TLA DELETE CLICKED]', e.target.closest('.remove-tla-row').dataset.id);
          setTimeout(() => trackRowChange(tbody, 'DELETE_CLICK'), 10);
        }
      }, { capture: true });

      // Watch for row mutations (add/delete detected via row count change)
      if (window.MutationObserver){
        const mo = new MutationObserver(() => {
          setTimeout(() => trackRowChange(tbody, 'MUTATION'), 10);
        });
        mo.observe(tbody, { childList: true, subtree: false });
      }

      // Word-boundary snapshots for TLA text
      tbody.addEventListener('input', (e) => {
        const ta = e.target;
        if (!(ta && ta.tagName === 'TEXTAREA')) return;
        const current = ta.value || '';

        const prev = lastSavedText.get(ta) || '';
        if (current === prev) return;
        const lastChar = current.slice(-1);
        const isDelimiter = /[\s.!?,;:"'\-]/.test(lastChar);
        const isDeletion = current.length < prev.length;
        if (isDelimiter || isDeletion) {
          lastSavedText.set(ta, current);
          take();
        }
      }, { capture: true });

      // Change fallback
      tbody.addEventListener('change', (e) => {
        const ta = e.target;
        if (ta && ta.tagName === 'TEXTAREA') {
          lastSavedText.set(ta, ta.value || '');
        }
        take();
      }, { capture: true });

      // Text input fields (ch, ilo, so) - word-boundary snapshots (excluding wks)
      tbody.addEventListener('input', (e) => {
        const input = e.target;
        if (!(input && input.tagName === 'INPUT' && (input.name.includes('[ch]') || input.name.includes('[ilo]') || input.name.includes('[so]')))) return;
        const current = input.value || '';
        const prev = lastSavedText.get(input) || '';
        if (current === prev) return;
        const lastChar = current.slice(-1);
        const isDelimiter = /[\s.!?,;:"'\-]/.test(lastChar);
        const isDeletion = current.length < prev.length;
        if (isDelimiter || isDeletion) {
          lastSavedText.set(input, current);
          take();
        }
      }, { capture: true });

      // Change fallback for all input fields (including wks which only snapshots here)
      tbody.addEventListener('change', (e) => {
        const input = e.target;
        if (input && input.tagName === 'INPUT' && (input.name.includes('[ch]') || input.name.includes('[wks]') || input.name.includes('[ilo]') || input.name.includes('[so]'))) {
          console.log('[TLA INPUT CHANGE]', input.name, 'value:', input.value);
          lastSavedText.set(input, input.value || '');
          take();
        }
      }, { capture: true });

      if (window.MutationObserver){
        const mo = new MutationObserver(() => take());
        mo.observe(tbody, { childList: true, subtree: true });
      }

      // Add row action
      const addBtn = document.getElementById('add-tla-row');
      if (addBtn) addBtn.addEventListener('click', () => setTimeout(take, 100));

      tbody.addEventListener('focusin', () => { window.SVActiveModuleName = 'tla'; }, true);
      tbody.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'tla'; }, true);
    }
    try { safeInitialize('tla', snapshotTla()); } catch(e) {}
    updateButtons();
  }

  function registerAssessmentMappingWatchers(){
    const st = ensure('assessment_mapping');
    const lastMarksState = new Map(); // Track each cell's mark state to detect individual changes
    let captureTimeout = null;
    
    const take = () => {
      if (st.isApplying || window.globalApplying) return;
      if (Date.now() < suppressAssessmentMappingUntil) return; // skip AM snapshots caused by TLA-driven sync
      try {
        clearTimeout(captureTimeout);
        const amSnap = snapshotAssessmentMapping();
        // Cache latest valid marks here so both TLA undo and
        // Criteria/AT-driven row sync can restore the *current*
        // mark pattern, even if it has fewer Xs than before.
        if (amSnap && Array.isArray(amSnap.marks) && amSnap.marks.length > 0) {
          const hasValidLabels = amSnap.marks.some(m => m.weekLabel && m.weekLabel !== 'No weeks');
          if (hasValidLabels) {
            lastValidAssessmentMarks = amSnap.marks;
            const markedCount = amSnap.marks.filter(m => m.marked && m.weekLabel && m.weekLabel !== 'No weeks').length;
            console.log('[AM SNAPSHOT] Cached marks from AM watcher:', lastValidAssessmentMarks.length, '(marked:', markedCount, ')');
          }
        } else {
          // If user cleared all marks, reflect that in the cache too
          lastValidAssessmentMarks = [];
          console.log('[AM SNAPSHOT] Cached empty marks (all cleared by user)');
        }
        safePush('assessment_mapping', amSnap);
      } catch (e) { /* noop */ }
    };
    
    const trackMarkChange = (cell) => {
      const weekTable = cell.closest('table.week');
      if (!weekTable) return;
      
      // Determine current cell's position
      const allCells = Array.from(weekTable.querySelectorAll('td.week-mapping'));
      const cellIdx = allCells.indexOf(cell);
      if (cellIdx === -1) return;
      
      const cellKey = `cell_${cellIdx}`;
      const isMarked = cell.textContent.trim() === 'x';
      const wasMarked = lastMarksState.get(cellKey);
      
      // If state changed, capture snapshot immediately
      if (isMarked !== wasMarked) {
        lastMarksState.set(cellKey, isMarked);
        console.log('[AM MARK CHANGE]', cellKey, ':', wasMarked ? 'x→' : '→x');
        clearTimeout(captureTimeout);
        captureTimeout = setTimeout(take, 5); // Minimal delay to batch same-frame changes
      }
    };
    
    const lastSavedText = new WeakMap();
    const distTable = document.querySelector('.assessment-mapping table.distribution');
    const weekTable = document.querySelector('.assessment-mapping table.week');
    
    if (distTable && weekTable){
      // Distribution input changes
      distTable.addEventListener('input', (e) => {
        const input = e.target;
        if (input && input.classList.contains('distribution-input')) {
          const current = input.value || '';
          const prev = lastSavedText.get(input) || '';
          if (current === prev) return;
          const lastChar = current.slice(-1);
          const isDelimiter = /[\s.!?,;:"'\-]/.test(lastChar);
          const isDeletion = current.length < prev.length;
          if (isDelimiter || isDeletion) {
            lastSavedText.set(input, current);
            take();
          }
        }
      }, { capture: true });

      // Change fallback for distribution inputs
      distTable.addEventListener('change', (e) => {
        const input = e.target;
        if (input && input.classList.contains('distribution-input')) {
          lastSavedText.set(input, input.value || '');
          take();
        }
      }, { capture: true });

      // Week cell click handler - track individual mark changes
      weekTable.addEventListener('click', (e) => {
        const cell = e.target.closest('td.week-mapping');
        if (cell) {
          setTimeout(() => trackMarkChange(cell), 0);
        }
      }, { capture: true });

      // Watch for week columns being added/removed (via TLA sync)
      if (window.MutationObserver){
        const headerObserver = new MutationObserver(() => take());
        const headerRow = weekTable.querySelector('tr:first-child');
        if (headerRow) {
          headerObserver.observe(headerRow, { childList: true });
        }
      }

      weekTable.addEventListener('focusin', () => { window.SVActiveModuleName = 'assessment_mapping'; }, true);
      weekTable.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'assessment_mapping'; }, true);
    }
    try { safeInitialize('assessment_mapping', snapshotAssessmentMapping()); } catch(e) {}
    updateButtons();
  }

  function registerIgaWatchers(){
    const st = ensure('iga');
    const take = () => {
      if (st.isApplying || window.globalApplying) return;
      try { safePush('iga', snapshotIga()); } catch (e) { /* noop */ }
    };
    const lastSavedText = new WeakMap(); // track last-snapshotted value per textarea
    const list = document.getElementById('syllabus-iga-sortable');
    if (list){
      // Action-based triggers
      list.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-iga')) setTimeout(take, 0);
      }, { capture: true });

      // Inputs: snapshot on word boundaries (space/punctuation) or deletions, not pause-based
      list.addEventListener('input', (e) => {
        const ta = e.target;
        if (!(ta && ta.tagName === 'TEXTAREA' && (ta.name === 'iga_titles[]' || ta.name === 'igas[]'))) return;
        const current = ta.value || '';
        const prev = lastSavedText.get(ta) || '';
        if (current === prev) return;
        const lastChar = current.slice(-1);
        const isDelimiter = /[\s.!?,;:"'\-]/.test(lastChar); // word boundary characters
        const isDeletion = current.length < prev.length; // backspace/delete
        if (isDelimiter || isDeletion) {
          lastSavedText.set(ta, current);
          take();
        }
      }, { capture: true });

      // Change event as a fallback when leaving the field
      list.addEventListener('change', (e) => {
        const ta = e.target;
        if (ta && ta.tagName === 'TEXTAREA' && (ta.name === 'iga_titles[]' || ta.name === 'igas[]')) {
          lastSavedText.set(ta, ta.value || '');
        }
        take();
      }, { capture: true });
      if (window.MutationObserver){
        const mo = new MutationObserver(() => take());
        mo.observe(list, { childList: true, subtree: true });
      }

      // Add-button and load-predefined actions
      const addBtn = document.getElementById('iga-add-header');
      if (addBtn) addBtn.addEventListener('click', () => setTimeout(take, 0));
      const confirmLoad = document.getElementById('confirmLoadPredefinedIgas');
      if (confirmLoad) confirmLoad.addEventListener('click', () => setTimeout(take, 300));

      list.addEventListener('focusin', () => { window.SVActiveModuleName = 'iga'; }, true);
      list.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'iga'; }, true);
    }
    try { safeInitialize('iga', snapshotIga()); } catch(e) {}
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
    registerCdioWatchers();
    registerSdgWatchers();
    registerCoursePoliciesWatchers();
    registerTlaWatchers();
    registerAssessmentMappingWatchers();
    registerSoWatchers();
    registerIgaWatchers();
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
      // Expose helpers so other modules (e.g., Assessment Mapping / Criteria sync)
      // can safely re-apply cached assessment marks after structural changes.
      getLastValidAssessmentMarks: function(){
        return (lastValidAssessmentMarks || []).slice();
      },
      applyAssessmentMarksInline: function(marks){
        applyInlineAssessmentMarks(Array.isArray(marks) ? marks : []);
      }
    };
  } catch(e){}

})();
