/*
 * File: resources/js/faculty/utilities/history/core.js
 * Purpose: Global unified history timeline across syllabus partials
 * API: SVHistoryCore.register(key, captureFn, applyFn, opts)
 *      SVHistoryCore.capture(key, source)
 *      SVHistoryCore.undo(), SVHistoryCore.redo(), SVHistoryCore.clear(), SVHistoryCore.get()
 */
(function(){
  const Modules = new Map(); // key -> { capture, apply, hash }
  const Timeline = { past: [], future: [], max: 200, lastHash: '' };

  function defaultHash(key, snapshot){
    const s = JSON.stringify(snapshot || {});
    return key + '|' + s.length + '|' + s;
  }

  const Core = {
    register(key, captureFn, applyFn, opts){
      if (!key || typeof captureFn !== 'function' || typeof applyFn !== 'function') return false;
      Modules.set(key, { capture: captureFn, apply: applyFn, hash: (opts && typeof opts.hash === 'function') ? opts.hash : defaultHash });
      return true;
    },
    capture(key, source){
      const mod = Modules.get(key);
      if (!mod) return false;
      const snapshot = mod.capture();
      const h = (mod.hash || defaultHash)(key, snapshot);
      if (h === Timeline.lastHash) return false; // skip identical consecutive
      Timeline.lastHash = h;
      Timeline.past.push({ key, snapshot, ts: Date.now(), source: source || 'user' });
      if (Timeline.past.length > Timeline.max) Timeline.past.shift();
      Timeline.future.length = 0; // invalidate redo on new action
      return true;
    },
    undo(){
      if (Timeline.past.length <= 1) return false; // need a previous state
      const current = Timeline.past.pop();
      Timeline.future.push(current);
      const prev = Timeline.past[Timeline.past.length - 1];
      const mod = Modules.get(prev.key);
      if (!mod) return false;
      try { mod.apply(prev.snapshot); Timeline.lastHash = (mod.hash || defaultHash)(prev.key, prev.snapshot); return true; } catch(e){ console.error('SVHistoryCore.undo failed', e); return false; }
    },
    redo(){
      if (Timeline.future.length === 0) return false;
      const next = Timeline.future.pop();
      Timeline.past.push(next);
      const mod = Modules.get(next.key);
      if (!mod) return false;
      try { mod.apply(next.snapshot); Timeline.lastHash = (mod.hash || defaultHash)(next.key, next.snapshot); return true; } catch(e){ console.error('SVHistoryCore.redo failed', e); return false; }
    },
    clear(){ Timeline.past.length = 0; Timeline.future.length = 0; Timeline.lastHash = ''; },
    get(){ return { past: Timeline.past.slice(), future: Timeline.future.slice(), lastHash: Timeline.lastHash }; }
  };

  try { window.SVHistoryCore = Core; } catch(_){}
})();
