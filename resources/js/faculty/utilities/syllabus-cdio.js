// File: resources/js/faculty/utilities/syllabus-cdio.js
// Purpose: Provide a Settings switch to show/hide the CDIO partial.

(function(){
  function getSyllabusId(){
    const el = document.getElementById('syllabus-document');
    return el ? (el.getAttribute('data-syllabus-id') || '') : '';
  }

  function getKey(){
    return 'sv_show_cdio_' + (getSyllabusId() || 'default');
  }

  function readPref(){
    let show = true;
    try { const v = localStorage.getItem(getKey()); if (v !== null) show = (v === 'true'); } catch(_) {}
    return show;
  }

  function writePref(val){
    try { localStorage.setItem(getKey(), String(!!val)); } catch(_) {}
  }

  function applyCdioVisibility(show){
    const cdioPartial = document.querySelector('.sv-partial[data-partial-key="cdio"]');
    if (cdioPartial) cdioPartial.style.display = show ? '' : 'none';
  }

  function ensurePanel(){
    let panel = document.getElementById('syllabusSettingsPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'syllabusSettingsPanel';
      panel.className = 'sv-settings-panel';
      document.body.appendChild(panel);
    }
    // Ensure CDIO toggle exists
    let toggle = document.getElementById('toggleCdioVisibility');
    if (!toggle) {
      const row = document.createElement('div');
      row.className = 'form-check form-switch d-flex align-items-center gap-2';
      row.innerHTML = '<input class="form-check-input" type="checkbox" id="toggleCdioVisibility">\n<label class="form-check-label" for="toggleCdioVisibility">Show CDIO section</label>';
      panel.appendChild(row);
      toggle = row.querySelector('#toggleCdioVisibility');
    }
    // Wire toggle once
    if (toggle && !toggle.dataset.bound) {
      toggle.dataset.bound = '1';
      toggle.addEventListener('change', function(){
        const val = !!toggle.checked;
        applyCdioVisibility(val);
        toggle.setAttribute('aria-checked', val ? 'true' : 'false');
        writePref(val);
      });
    }
    // Reflect stored state
    const show = readPref();
    toggle.checked = !!show;
    toggle.setAttribute('aria-checked', show ? 'true' : 'false');
    return panel;
  }

  function positionPanel(btn, panel){
    if (!btn || !panel) return;
    const rect = btn.getBoundingClientRect();
    const gap = 8;
    let left = rect.right + gap;
    let top = rect.top;
    const maxLeft = window.innerWidth - panel.offsetWidth - gap;
    if (left > maxLeft) left = rect.left - panel.offsetWidth - gap;
    if (left < gap) left = gap;
    const maxTop = window.innerHeight - panel.offsetHeight - gap;
    if (top > maxTop) top = maxTop;
    if (top < gap) top = gap;
    panel.style.left = left + 'px';
    panel.style.top = top + 'px';
  }

  function openPanel(panel){ if (panel) { panel.style.display = 'block'; } }
  function closePanel(panel){ if (panel) { panel.style.display = 'none'; } }
  function isOpen(panel){ return !!(panel && panel.style.display !== 'none'); }

  document.addEventListener('DOMContentLoaded', function(){
    applyCdioVisibility(readPref());
    const settingsBtn = document.getElementById('syllabusSettingsBtn');
    if (!settingsBtn) return;
    let panel = ensurePanel();
    // Bind once
    if (!settingsBtn.dataset.cdioPanelBound) {
      settingsBtn.dataset.cdioPanelBound = '1';
      settingsBtn.addEventListener('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        panel = ensurePanel();
        if (isOpen(panel)) { closePanel(panel); return; }
        openPanel(panel);
        positionPanel(settingsBtn, panel);
      });
      // Close on outside click
      document.addEventListener('click', function(e){
        if (!panel || !isOpen(panel)) return;
        if (e.target === settingsBtn) return;
        if (panel.contains(e.target)) return;
        closePanel(panel);
      });
      // Handle resize and escape key
      window.addEventListener('resize', function(){ if (isOpen(panel)) positionPanel(settingsBtn, panel); });
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closePanel(panel); });
    }
  });
})();
