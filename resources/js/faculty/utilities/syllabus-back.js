// File: resources/js/faculty/utilities/syllabus-back.js
// Purpose: Provide a global back/exit handler for the Syllabus page without unsaved prompts.

(function(){
  function isAdminPath() {
    try { return (window.location.pathname || '').startsWith('/admin'); } catch (e) { return false; }
  }

  function cameFromApprovals() {
    try {
      const ref = document.referrer || '';
      const refUrl = new URL(ref, window.location.origin);
      const params = new URLSearchParams(window.location.search || '');
      const fromParam = params.get('from');
      return (
        refUrl.pathname.includes('/faculty/syllabi/approvals') ||
        refUrl.pathname.includes('/admin/syllabi/approvals') ||
        fromParam === 'approvals'
      );
    } catch (e) { return false; }
  }

  function approvalsPath() {
    return isAdminPath() ? '/admin/syllabi/approvals' : '/faculty/syllabi/approvals';
  }

  function resolveExitUrl(explicitUrl) {
    let dest = explicitUrl || (typeof window.syllabusExitUrl === 'string' ? window.syllabusExitUrl : null);

    // Prefer going back to Approvals when applicable
    if (cameFromApprovals()) {
      try {
        const ref = document.referrer || '';
        const refUrl = new URL(ref, window.location.origin);
        if (refUrl && refUrl.href) dest = refUrl.href;
        else dest = approvalsPath();
      } catch (e) {
        dest = approvalsPath();
      }
    }

    // Fallbacks
    if (!dest || (typeof dest === 'string' && dest.indexOf('undefined') !== -1)) {
      if (typeof window.syllabusExitUrl === 'string' && window.syllabusExitUrl) {
        dest = window.syllabusExitUrl;
      } else if (typeof window.syllabusBasePath === 'string' && window.syllabusBasePath) {
        dest = window.syllabusBasePath.startsWith('/') ? window.syllabusBasePath : ('/' + window.syllabusBasePath);
      } else {
        dest = approvalsPath();
      }
    }

    // Normalize admin/faculty path if mismatched
    try {
      if (isAdminPath() && typeof dest === 'string' && dest.includes('/faculty/syllabi')) {
        dest = dest.replace('/faculty/syllabi', '/admin/syllabi');
      }
    } catch (e) { /* noop */ }

    return dest;
  }

  // Global exit/back handler used by toolbar buttons
  window.handleExit = function(url){
    const dest = resolveExitUrl(url);
    window.location.href = dest;
  };

  // Optional: auto-bind a Back button if present (non-blocking)
  document.addEventListener('DOMContentLoaded', function(){
    const btn = document.getElementById('syllabusBackBtn') || document.getElementById('syllabusExitBtn');
    if (!btn) return;
    btn.addEventListener('click', function(){
      try { handleExit(); } catch (e) { /* noop */ }
    });
  });
})();
