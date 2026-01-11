// File: resources/js/faculty/utilities/syllabus-save-state.js
// Purpose: Lightweight save-state UI helper (no unsaved-change logic)
// Exposes window.SVSaveState with set/get and auto-updates the toolbar Save button.

(function(){
  const STATES = ['idle','saving','saved','error'];
  let _state = 'idle';
  const _listeners = new Set();

  function getSaveButton() { return document.getElementById('syllabusSaveBtn'); }

  function setAria(btn, label) {
    try {
      btn.setAttribute('aria-live','polite');
      btn.setAttribute('aria-label', label);
      btn.title = label;
    } catch (e) { /* noop */ }
  }

  function renderState(btn, state) {
    if (!btn) return;
    const iconIdle = '<i class="bi bi-floppy fs-5"></i>';
    const iconSaving = '<i class="bi bi-arrow-repeat fs-5" style="animation: spin 1s linear infinite;"></i>';
    const iconSaved = '<i class="bi bi-check-lg fs-5"></i>';
    const iconError = '<i class="bi bi-exclamation-triangle fs-5"></i>';
    const label = '<span class="small">Save</span>';

    let iconHtml = iconIdle; let aria = 'Save';
    switch(state){
      case 'saving': iconHtml = iconSaving; aria = 'Saving…'; break;
      case 'saved':  iconHtml = iconSaved;  aria = 'Saved'; break;
      case 'error':  iconHtml = iconError;  aria = 'Save failed'; break;
      default:       iconHtml = iconIdle;   aria = 'Save';
    }
    try { btn.innerHTML = iconHtml + label; } catch (e) {}
    setAria(btn, aria);
  }

  function set(state){
    if (!STATES.includes(state)) state = 'idle';
    _state = state;
    renderState(getSaveButton(), _state);
    try { _listeners.forEach(fn => { try { fn(_state); } catch(e){} }); } catch (e) {}
    try { document.dispatchEvent(new CustomEvent('sv:save-state', { detail: { state: _state } })); } catch (e) {}
  }
  function get(){ return _state; }
  function onChange(fn){ if (typeof fn === 'function') _listeners.add(fn); return () => _listeners.delete(fn); }

  // Public API
  window.SVSaveState = { set, get, onChange };

  // Global unsaved-count helper: count visible unsaved pills and
  // update the toolbar badge and Save button enabled state.
  window.updateUnsavedCount = function(){
    try {
      // 1) Count explicit unsaved pills in partials that still expose them
      const pills = document.querySelectorAll('.unsaved-pill:not(.d-none)');
      let count = pills.length;

      // 2) Also treat any available Undo history as an unsaved-change signal.
      //    When all changes are undone and the Undo button becomes
      //    disabled again, Save will be restricted.
      const undoBtn = document.getElementById('syllabusUndoBtn');
      const hasUndo = undoBtn && !undoBtn.disabled;
      if (hasUndo) {
        count = Math.max(count, 1);
      }
      const badge = document.getElementById('unsaved-count-badge');
      if (badge) {
        if (count > 0) {
          badge.textContent = String(count);
          badge.style.display = 'block';
        } else {
          badge.textContent = '0';
          badge.style.display = 'none';
        }
      }

      const btn = getSaveButton();
      if (btn && !btn.dataset.forceDisabled) {
        btn.disabled = (count === 0);
      }
    } catch (e) {
      // noop
    }
  };

  // Initialize after DOM ready: render idle state and set initial Save enabled/disabled
  document.addEventListener('DOMContentLoaded', function(){
    renderState(getSaveButton(), _state);
    try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}
  });
})();
