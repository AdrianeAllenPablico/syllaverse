// File: resources/js/faculty/utilities/syllabus-redo.js
// Purpose: Wire toolbar Redo button; provide a thin shim that dispatches an event
// and falls back to browser execCommand if available.

(function(){
  function performRedo(){
    // Temporarily disabled: global Redo is a no-op until redesigned
    return;
  }

  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('syllabusRedoBtn');
    if (!btn) return;
    btn.addEventListener('click', function(){
      try { performRedo(); } catch (e) { /* noop */ }
    });
  });
})();
