// -----------------------------------------------------------------------------
// File: resources/js/faculty/syllabus-ilo.js
// Description: Minimal ILO behaviors (add/delete/renumber + autosize + drag reorder).
// -----------------------------------------------------------------------------

// Local helpers (syllabus.js removed)
const updateUnsavedCount = () => {};
function autosize(el) { try { el.style.height = 'auto'; el.style.height = (el.scrollHeight || 0) + 'px'; } catch (e) { /* noop */ } }
function initAutosize() {
  const areas = document.querySelectorAll('textarea.autosize');
  areas.forEach((ta) => {
    if (!ta.__autosizeBound) {
      ta.__autosizeBound = true;
      const resize = () => autosize(ta);
      ta.addEventListener('input', resize);
      ta.addEventListener('change', resize);
    }
    autosize(ta);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('syllabus-ilo-sortable');
  if (!list) return; // tolerate pages without ILO list

  // Track deleted ILO IDs globally to send with save payload
  if (!window._iloDeletedIds) {
    window._iloDeletedIds = [];
  }

  function getIloRows() {
    return Array.from(list.querySelectorAll('tr')).filter(r => r.querySelector('textarea[name="ilos[]"]') || r.querySelector('.ilo-badge'));
  }

  function getCsrfToken() {
    try {
      return document.querySelector('meta[name="csrf-token"]')?.content
        || document.querySelector('#iloForm input[name="_token"], #syllabusForm input[name="_token"]')?.value
        || '';
    } catch (e) {
      return '';
    }
  }

  async function requestBackendDeletion(iloId) {
    const headers = { 'Accept': 'application/json' };
    const token = getCsrfToken();
    if (token) headers['X-CSRF-TOKEN'] = token;

    const res = await fetch(`/faculty/syllabi/ilos/${encodeURIComponent(iloId)}`, {
      method: 'DELETE',
      headers,
      credentials: 'same-origin',
    });

    if (!res.ok) {
      let message = 'Failed to delete ILO.';
      try {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const body = await res.json();
          message = body?.message || message;
        } else {
          message = await res.text() || message;
        }
      } catch (e) { /* ignored */ }
      throw new Error(message);
    }

    return res.json().catch(() => ({}));
  }

  async function deleteRowAndPersist(row) {
    if (!row) return false;
    
    // Prevent double-deletion (guard against rapid double-clicks or event bubbling)
    if (row.dataset.deleting === 'true') {
      console.log('[ILO DELETE] Already deleting this row, skipping');
      return false;
    }
    row.dataset.deleting = 'true';

    const iloCode = row.querySelector('input[name="code[]"]')?.value || 'unknown';
    console.log('[ILO DELETE] Starting deletion of ILO:', iloCode);

    // Capture AT snapshot BEFORE deletion to preserve data for undo
    let atSnapshotBeforeDeletion = null;
    console.log('[ILO DELETE] Checking for snapshotAssessmentTasks:', typeof window.snapshotAssessmentTasks);
    try {
      if (window.snapshotAssessmentTasks) {
        console.log('[ILO DELETE] Calling snapshotAssessmentTasks()');
        atSnapshotBeforeDeletion = window.snapshotAssessmentTasks();
        if (atSnapshotBeforeDeletion) {
          console.log('[ILO DELETE] ✅ AT SNAPSHOT CAPTURED - Full Data:');
          console.log(JSON.stringify(atSnapshotBeforeDeletion, null, 2));
        } else {
          console.warn('[ILO DELETE] AT snapshot is null/undefined!');
        }
      } else {
        console.warn('[ILO DELETE] snapshotAssessmentTasks not available!');
      }
    } catch (e) { 
      console.error('[ILO DELETE] Error capturing AT snapshot:', e);
      console.error('[ILO DELETE] Stack:', e.stack);
    }

    // Track the ID if it's a saved ILO
    const rawId = row.getAttribute('data-id');
    const hasServerId = rawId && /^\d+$/.test(rawId);
    
    if (hasServerId) {
      // Add to global deletion tracking list
      window._iloDeletedIds.push(Number(rawId));
      console.log('ILO Delete Tracked:', { id: rawId, totalDeleted: window._iloDeletedIds.length });
    }

    // Just remove from UI without backend deletion
    row.remove();
    console.log('[ILO DELETE] Row removed from DOM');
    
    // Check if any rows remain, if not show placeholder
    const rows = getIloRows();
    console.log('[ILO DELETE] Remaining ILO rows:', rows.length);
    
    if (rows.length === 0) {
      // Only create placeholder if one doesn't already exist
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
        console.log('[ILO DELETE] Placeholder added');
      }
      // Fire iloChanged event with AT snapshot for coordinated undo/redo
      try {
        console.log('[ILO DELETE] Dispatching iloChanged event with AT snapshot');
        document.dispatchEvent(new CustomEvent('iloChanged', {
          detail: { atSnapshot: atSnapshotBeforeDeletion }
        }));
      } catch (e) { 
        console.error('[ILO DELETE] Error dispatching event:', e);
      }
    } else {
      renumber();
      // Fire iloChanged event with AT snapshot for coordinated undo/redo
      try {
        console.log('[ILO DELETE] Dispatching iloChanged event with AT snapshot');
        document.dispatchEvent(new CustomEvent('iloChanged', {
          detail: { atSnapshot: atSnapshotBeforeDeletion }
        }));
      } catch (e) { 
        console.error('[ILO DELETE] Error dispatching event:', e);
      }
    }
    
    // Mark as unsaved
    try { updateUnsavedCount(); } catch (e) { /* noop */ }
    
    return true;
  }

  function renumber() {
    const rows = getIloRows();
    const codes = [];
    rows.forEach((row, i) => {
      const code = `ILO${i + 1}`;
      codes.push(code);
      const badge = row.querySelector('.ilo-badge'); if (badge) badge.textContent = code;
      const codeInput = row.querySelector('input[name="code[]"]'); if (codeInput) codeInput.value = code;
    });
    // mark ILOs as unsaved and update unsaved counter
    try { const pill = document.getElementById('unsaved-ilos'); if (pill) pill.classList.remove('d-none'); } catch (e) { /* noop */ }
    try { updateUnsavedCount(); } catch (e) { /* noop */ }
    
    // Dispatch event for AT module to sync columns
    try {
      document.dispatchEvent(new CustomEvent('ilo:changed', { 
        detail: { 
          count: rows.length,
          codes: codes
        } 
      }));
    } catch (e) { /* noop */ }
    
    // Don't dispatch iloChanged here - it's now dispatched before deletion
    
    // Trigger validation update
    try { if (typeof window.updateProgressBar === 'function') window.updateProgressBar(); } catch (e) { /* noop */ }
  }

  function createRow() {
    const tr = document.createElement('tr');
    tr.setAttribute('data-id', `new-${Date.now()}`);
    tr.innerHTML = `
      <td class="text-center align-middle">
        <div class="ilo-badge fw-semibold"></div>
      </td>
      <td>
        <div class="d-flex align-items-center gap-2">
          <textarea name="ilos[]" class="cis-textarea cis-field autosize flex-grow-1" placeholder="Description" rows="1" style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;"></textarea>
          <input type="hidden" name="code[]" value="">
          <button type="button" class="btn btn-sm btn-outline-danger btn-delete-ilo ms-2" title="Delete ILO">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>`;
    return tr;
  }

  function addRow(afterRow = null) {
    // Remove placeholder if it exists
    const placeholder = document.getElementById('ilo-placeholder');
    if (placeholder) placeholder.remove();
    
    const row = createRow();
    if (afterRow && afterRow.parentElement) {
      if (afterRow.nextSibling) afterRow.parentElement.insertBefore(row, afterRow.nextSibling);
      else afterRow.parentElement.appendChild(row);
    } else {
      list.appendChild(row);
    }
    try { initAutosize(); } catch (e) { /* noop */ }
    renumber();
    const ta = row.querySelector('textarea.autosize'); if (ta) ta.focus();
    try { updateUnsavedCount(); } catch (e) { /* noop */ }
    
    // Capture AT snapshot after row addition
    console.log('[ILO ADD] New ILO row added, capturing AT snapshot');
    let atSnapshotAfterAdd = null;
    try {
      if (window.snapshotAssessmentTasks) {
        atSnapshotAfterAdd = window.snapshotAssessmentTasks();
        if (atSnapshotAfterAdd) {
          console.log('[ILO ADD] ✅ AT SNAPSHOT CAPTURED - Full Data:');
          console.log(JSON.stringify(atSnapshotAfterAdd, null, 2));
        }
      }
    } catch (e) { console.error('[ILO ADD] Error capturing AT:', e); }
    
    // Fire iloChanged event after row addition for undo/redo tracking
    try {
      document.dispatchEvent(new CustomEvent('iloChanged', {
        detail: { atSnapshot: atSnapshotAfterAdd }
      }));
    } catch (e) { /* noop */ }
    
    // Also immediately sync AT columns with ILO count
    try {
      if (window.syncATWithILO) {
        window.syncATWithILO();
      }
    } catch (e) { /* noop */ }
    
    // Set active module name
    try { window.SVActiveModuleName = 'ilo'; } catch (e) { /* noop */ }
    
    return row;
  }

  // Allow AI helper to bulk-insert ILOs from a markdown table string
  window.applyIloFromAi = function applyIloFromAi(markdown){
    if (!list) return false;
    let src = String(markdown || '');
    if (!src.trim()) return false;

    function splitBlocks(text){
      return text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
    }
    function isTableBlock(block){
      const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length < 2) return false;
      if (lines[0].indexOf('|') === -1) return false;
      const divider = lines[1];
      return /^\|?\s*:?-{3,}/.test(divider);
    }
    function splitRow(line){
      let s = line.trim();
      if (s.startsWith('|')) s = s.slice(1);
      if (s.endsWith('|')) s = s.slice(0, -1);
      return s.split('|').map(c => c.trim());
    }

    // If the AI returned a compressed single-line table, expand it to one row per line
    if (!/\n/.test(src)){
      const rows = src.match(/\|[^|]+\|[^|]+\|/g);
      if (rows && rows.length >= 3){
        src = rows.join('\n');
      }
    }

    const blocks = splitBlocks(src);
    let tableBlock = null;
    for (let i = 0; i < blocks.length; i++){
      if (isTableBlock(blocks[i])){
        tableBlock = blocks[i];
        break;
      }
    }
    if (!tableBlock) return false;

    const lines = tableBlock.split(/\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 3) return false;
    const headers = splitRow(lines[0]);
    if (!headers.length) return false;

    // Find Code and Description columns (or ILO/Outcome variants)
    let codeIdx = -1;
    let descIdx = -1;
    headers.forEach((h, idx) => {
      const key = h.toLowerCase();
      if (codeIdx === -1 && (key === 'code' || key === 'ilo')) codeIdx = idx;
      if (descIdx === -1 && (key === 'description' || key === 'outcome' || key === 'outcomes')) descIdx = idx;
    });
    if (descIdx === -1) return false;

    const bodyLines = lines.slice(2);
    const entries = [];
    bodyLines.forEach(line => {
      if (line.indexOf('|') === -1) return;
      const cells = splitRow(line);
      if (!cells.length) return;
      const description = cells[descIdx] || '';
      if (!description.trim()) return;
      entries.push({
        code: (codeIdx >= 0 ? (cells[codeIdx] || '') : ''),
        description: description.trim()
      });
    });
    if (!entries.length) return false;

    // Append new rows for each entry (do not delete existing ILOs; instructor can prune as needed)
    entries.forEach(entry => {
      const row = addRow(null);
      if (!row) return;
      const ta = row.querySelector('textarea[name="ilos[]"]');
      if (ta){
        ta.value = entry.description;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    return true;
  };

  // Header buttons (optional)
  const addBtn = document.getElementById('ilo-add-header');
  if (addBtn) {
    // Remove any existing listener to prevent duplicates
    const newAddBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newAddBtn, addBtn);
    newAddBtn.addEventListener('click', () => addRow(null));
  }

  // Delegated delete button handling
  list.addEventListener('click', async (ev) => {
    const btn = ev.target && ev.target.closest && ev.target.closest('.btn-delete-ilo');
    if (!btn) return;
    const row = btn.closest('tr');
    await deleteRowAndPersist(row);
  });



  // Keyboard: Backspace on empty textarea at caret 0 removes row (not first, and keep >= 1)
  list.addEventListener('keydown', async (e) => {
    const el = e.target;
    if (!el || el.tagName !== 'TEXTAREA') return;
    if (e.key !== 'Backspace') return;
    const val = el.value || '';
    const selStart = (typeof el.selectionStart === 'number') ? el.selectionStart : 0;
    if (val.trim() !== '' || selStart !== 0) return;
    const row = el.closest('tr');
    const rows = getIloRows();
    const idx = rows.indexOf(row);
    e.preventDefault();
    const prev = rows[idx - 1] || rows[idx + 1] || null;
    const deleted = await deleteRowAndPersist(row);
    if (!deleted) return;
    const remainingRows = getIloRows();
    if (remainingRows.length > 0) {
      const targetRow = prev || remainingRows[0];
      const pta = targetRow ? targetRow.querySelector('textarea') : null;
      if (pta) setTimeout(() => pta.focus(), 10);
    }
  });

  // Initial run
  renumber();
  try { initAutosize(); } catch (e) { /* noop */ }

  // Set active module name on focus/hover
  list.addEventListener('focusin', () => { window.SVActiveModuleName = 'ilo'; }, true);
  list.addEventListener('mouseenter', () => { window.SVActiveModuleName = 'ilo'; }, true);

  // Delegated event listeners for textarea changes (for undo/redo tracking)
  let textChangeTimeout;
  list.addEventListener('input', (e) => {
    if (e.target && e.target.tagName === 'TEXTAREA' && e.target.name === 'ilos[]') {
      clearTimeout(textChangeTimeout);
      textChangeTimeout = setTimeout(() => {
        try { document.dispatchEvent(new CustomEvent('iloChanged')); } catch (err) { /* noop */ }
      }, 250);
    }
  }, true);
  
  list.addEventListener('change', (e) => {
    if (e.target && e.target.tagName === 'TEXTAREA' && e.target.name === 'ilos[]') {
      try { document.dispatchEvent(new CustomEvent('iloChanged')); } catch (err) { /* noop */ }
    }
  }, true);

  // Toolbar Save is handled centrally by syllabus-save.js (aggregator)
});

// Persist ILOs (create/update + order). Inserts new rows typed before save.
// Exposed globally so the main Save button can call it first.
window.saveIlo = async function saveIlo() {
  const list = document.getElementById('syllabus-ilo-sortable');
  if (!list) return { message: 'No ILO list present' };

  function getSyllabusId() {
    try { const id = list.getAttribute('data-syllabus-id'); if (id) return id; } catch (e) {}
    try {
      const form = document.getElementById('syllabusForm') || document.getElementById('iloForm');
      const act = (form && form.action) ? form.action : '';
      const m = act.match(/\/faculty\/syllabi\/([^\/?#]+)/);
      if (m) return decodeURIComponent(m[1]);
    } catch (e) {}
    try {
      const idInput = document.querySelector('[name="id"], input[name="syllabus_id"], input[name="syllabus"]');
      if (idInput && idInput.value) return idInput.value;
    } catch (e) {}
    return '';
  }

  const syllabusId = getSyllabusId();
  if (!syllabusId) throw new Error('Cannot determine syllabus id for ILO save');

  // Collect visible rows and ensure sequential codes before reading values
  const rows = Array.from(list.querySelectorAll('tr'))
    .filter(r => r.querySelector('textarea[name="ilos[]"]') || r.querySelector('.ilo-badge'));

  rows.forEach((row, i) => {
    const code = `ILO${i + 1}`;
    const badge = row.querySelector('.ilo-badge'); if (badge) badge.textContent = code;
    const codeInput = row.querySelector('input[name="code[]"]'); if (codeInput) codeInput.value = code;
  });

  const descriptors = rows.map((row, index) => {
    const rawId = row.getAttribute('data-id') || '';
    const id = (/^\d+$/.test(rawId)) ? Number(rawId) : null;
    const code = row.querySelector('input[name="code[]"]')?.value || `ILO${index + 1}`;
    const ta = row.querySelector('textarea[name="ilos[]"]');
    const description = ta ? (ta.value || '') : '';
    const hasContent = (description.trim().length > 0);
    return { row, entry: { id, code, description, position: index + 1 }, hasContent };
  });

  const payloadIlos = descriptors.map(d => d.entry);

  // Get deleted IDs from the module scope
  const deletedIds = window._iloDeletedIds || [];
  
  // Debug logging
  console.log('ILO Save Debug:', {
    syllabusId,
    totalRows: rows.length,
    payloadIlos: payloadIlos.length,
    deletedIds: deletedIds.length,
    deletedIdsList: deletedIds
  });

  const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
  try {
    const token = document.querySelector('meta[name="csrf-token"]')?.content
      || document.querySelector('#iloForm input[name="_token"], #syllabusForm input[name="_token"]')?.value
      || '';
    if (token) headers['X-CSRF-TOKEN'] = token;
  } catch (e) { /* noop */ }

  const url = (window.syllabusBasePath || '/faculty/syllabi') + `/${encodeURIComponent(syllabusId)}/ilos`;

  const pendingNew = descriptors.filter(d => !d.entry.id).map(d => d.row);

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    credentials: 'same-origin',
    body: JSON.stringify({ 
      ilos: payloadIlos,
      deleted_ids: deletedIds,
      delete_all: payloadIlos.length === 0
    })
  });
  
  console.log('ILO Save Response:', { status: res.status, ok: res.ok });
  
  if (!res.ok) {
    let body = null; let text = '';
    try {
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) { body = await res.json(); }
      else { text = await res.text(); }
    } catch (e) { /* noop */ }
    const msg = (body && (body.message || (body.errors && JSON.stringify(body.errors)))) || text || 'Failed to save ILOs';
    throw new Error(msg);
  }
  const data = await res.json().catch(() => ({}));

  // Assign server IDs back to newly-created rows in DOM
  if (Array.isArray(data.created_ids) && data.created_ids.length) {
    const apply = pendingNew.slice(0, data.created_ids.length);
    apply.forEach((row, i) => {
      const nid = data.created_ids[i];
      if (row && nid) {
        row.setAttribute('data-id', String(nid));
      }
    });
  }

  // Update originals and unsaved indicators
  try { document.getElementById('unsaved-ilos')?.classList.add('d-none'); } catch (e) {}
  try { list.querySelectorAll('textarea[name="ilos[]"]').forEach(ta => ta.setAttribute('data-original', ta.value || '')); } catch (e) {}
  try { updateUnsavedCount(); } catch (e) {}
  
  // Clear deleted IDs list after successful save
  if (window._iloDeletedIds) {
    window._iloDeletedIds.length = 0;
  }
  
  console.log('ILO Save Success:', { 
    created: data.created_ids?.length || 0, 
    updated: data.updated_ids?.length || 0,
    deleted: data.deleted_ids?.length || 0
  });
  
  return data;
};
