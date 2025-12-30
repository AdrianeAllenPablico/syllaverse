/**
 * Mission & Vision Redo (keyboard + toolbar wiring)
 * Exports initMissionVisionRedo to attach listeners using mvUndoRedo state.
 */
export function initMissionVisionRedo(){
  // Prevent duplicate listener registration
  if (window.__mvRedoInitialized) return;
  window.__mvRedoInitialized = true;

  function redo(){
    if (window.mvUndoRedo && typeof window.mvUndoRedo.redo === 'function') {
      window.mvUndoRedo.redo();
    }
  }

  // Expose for toolbar/console even if undo not initialized yet
  window.mvRedo = redo;

  // Keyboard shortcuts when mission/vision has focus (redo)
  document.addEventListener('keydown', function(e){
    const active = document.activeElement;
    const focusedMV = active && (active.id === 'mission-text' || active.id === 'vision-text'
      || (active.getAttribute && (active.getAttribute('name') === 'mission' || active.getAttribute('name') === 'vision')));
    if (!focusedMV) return;
    const isCtrl = e.ctrlKey || e.metaKey;
    if (!isCtrl) return;
    const key = e.key;
    if ((key === 'z' || key === 'Z') && e.shiftKey) { redo(); e.preventDefault(); }
    else if (key === 'y' || key === 'Y') { redo(); e.preventDefault(); }
  }, true);

  // Listen for global toolbar redo
  document.addEventListener('sv:redo', function(){
    const mod = (window.SVActiveModuleName || window.SVLastActiveModule || '').toLowerCase();
    if (mod === 'missionvision') redo();
  });
}
