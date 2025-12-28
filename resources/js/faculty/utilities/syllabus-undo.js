// File: resources/js/faculty/utilities/syllabus-undo.js
// Purpose: Wire toolbar Undo button; provide a thin shim that dispatches an event
// and falls back to browser execCommand if available.

(function(){
  function performUndo(){
    try {
      if (window.SVUndo && typeof window.SVUndo.run === 'function') {
        return window.SVUndo.run();
      }
    } catch (e) { /* noop */ }
    try {
      // Fallback: attempt browser undo for focused editable elements
      if (typeof document.execCommand === 'function') {
        document.execCommand('undo');
      }
    } catch (e) { /* noop */ }
    try { document.dispatchEvent(new CustomEvent('sv:undo')); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('syllabusUndoBtn');
    if (!btn) return;
    btn.addEventListener('click', function(){
      try { performUndo(); } catch (e) { /* noop */ }
    });
  });
})();
