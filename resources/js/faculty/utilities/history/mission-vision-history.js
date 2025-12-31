/*
 * File: resources/js/faculty/utilities/history/mission-vision-history.js
 * Purpose: Mission & Vision history wiring to global SVHistoryCore
 */
(function(){
  const MODULE = 'missionVision';
  const state = { mission: { last: '', deleting: false }, vision: { last: '', deleting: false } };
  let missionElRef = null, visionElRef = null;

  function getFields(){
    const missionEl = document.getElementById('mission-text') || document.querySelector('[name="mission"]');
    const visionEl = document.getElementById('vision-text') || document.querySelector('[name="vision"]');
    return { missionEl, visionEl };
  }

  function captureSnapshot(){
    const { missionEl, visionEl } = getFields();
    return {
      mission: (missionEl ? missionEl.value : '') || '',
      vision: (visionEl ? visionEl.value : '') || ''
    };
  }

  function applySnapshot(snapshot){
    if (!snapshot) return false;
    const { missionEl, visionEl } = getFields();
    if (missionEl) missionEl.value = snapshot.mission || '';
    if (visionEl) visionEl.value = snapshot.vision || '';
    try {
      // Trigger input for autosize and live context updates
      if (missionEl) missionEl.dispatchEvent(new Event('input', { bubbles:true }));
      if (visionEl) visionEl.dispatchEvent(new Event('input', { bubbles:true }));
    } catch(_){}
    return true;
  }

  function hashSnapshot(key, snapshot){
    const s = JSON.stringify(snapshot || {});
    return key + '|' + s.length + '|' + s;
  }

  // Word-boundary capture: snapshot on whitespace inserts (space/tab/newline) and on blur/change
  function onWordBoundaryInput(e){
    if (!(window.SVHistoryCore && typeof window.SVHistoryCore.capture === 'function')) return;
    const el = e.target;
    const type = e.inputType || '';
    const data = (e.data == null ? '' : String(e.data));
    const val = el && typeof el.value === 'string' ? el.value : '';
    const endsWithWhitespace = /\s$/.test(val);
    const isWhitespaceInsert = (type === 'insertText' && /\s/.test(data))
      || type === 'insertParagraph'
      || type === 'insertLineBreak';
    const isDeleteOp = /^delete/.test(type);
    const key = (el === missionElRef) ? 'mission' : (el === visionElRef ? 'vision' : null);
    const field = key ? state[key] : null;
    const prevVal = field ? field.last : '';

    if (isDeleteOp && field) {
      // Start of a delete streak: first capture the pre-delete state, then the post-delete state
      if (!field.deleting) {
        try {
          const currentVal = val;
          el.value = prevVal; // temporarily set to pre-delete value to capture it
          window.SVHistoryCore.capture(MODULE, 'pre-delete');
          el.value = currentVal; // restore actual post-delete value
        } catch(_){ /* noop */ }
        field.deleting = true;
      }
      try { window.SVHistoryCore.capture(MODULE, 'delete'); } catch(_){}
    } else if (isWhitespaceInsert || (type && type.startsWith('insert') && endsWithWhitespace)) {
      // Word completed by whitespace
      try { window.SVHistoryCore.capture(MODULE, 'word'); } catch(_){}
      if (field) field.deleting = false;
    } else if (type && type.startsWith('insert')) {
      // Regular insertion breaks delete streak
      if (field) field.deleting = false;
    }
    if (field) field.last = val;
  }

  document.addEventListener('DOMContentLoaded', function(){
    // Register with core
    if (window.SVHistoryCore && typeof window.SVHistoryCore.register === 'function') {
      try { window.SVHistoryCore.register(MODULE, captureSnapshot, applySnapshot, { hash: hashSnapshot }); } catch(e){}
      // Seed initial snapshot
      try { window.SVHistoryCore.capture(MODULE, 'init'); } catch(e){}
      // Attach word-by-word capture: on whitespace insertions and on blur/change
      const { missionEl, visionEl } = getFields();
      missionElRef = missionEl; visionElRef = visionEl;
      if (missionEl) {
        state.mission.last = missionEl.value || '';
        missionEl.addEventListener('input', onWordBoundaryInput, true);
        missionEl.addEventListener('change', function(){
          try { window.SVHistoryCore.capture(MODULE, 'change'); } catch(_){}
          state.mission.deleting = false; state.mission.last = missionEl.value || '';
        }, true);
        missionEl.addEventListener('blur', function(){
          try { window.SVHistoryCore.capture(MODULE, 'blur'); } catch(_){}
          state.mission.deleting = false; state.mission.last = missionEl.value || '';
        }, true);
      }
      if (visionEl) {
        state.vision.last = visionEl.value || '';
        visionEl.addEventListener('input', onWordBoundaryInput, true);
        visionEl.addEventListener('change', function(){
          try { window.SVHistoryCore.capture(MODULE, 'change'); } catch(_){}
          state.vision.deleting = false; state.vision.last = visionEl.value || '';
        }, true);
        visionEl.addEventListener('blur', function(){
          try { window.SVHistoryCore.capture(MODULE, 'blur'); } catch(_){}
          state.vision.deleting = false; state.vision.last = visionEl.value || '';
        }, true);
      }
    }
  });
})();
