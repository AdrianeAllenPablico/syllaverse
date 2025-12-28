// File: resources/js/faculty/utilities/syllabus-redo.js
// Purpose: Wire toolbar Redo button; provide a thin shim that dispatches an event
// and falls back to browser execCommand if available.

(function(){
  function performRedo(){
    try {
      if (window.SVRedo && typeof window.SVRedo.run === 'function') {
        return window.SVRedo.run();
      }
    } catch (e) { /* noop */ }
    try {
      // Fallback: attempt browser redo for focused editable elements
      if (typeof document.execCommand === 'function') {
        document.execCommand('redo');
      }
    } catch (e) { /* noop */ }
    try { document.dispatchEvent(new CustomEvent('sv:redo')); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('syllabusRedoBtn');
    if (!btn) return;
    btn.addEventListener('click', function(){
      try { performRedo(); } catch (e) { /* noop */ }
    });
  });
})();
