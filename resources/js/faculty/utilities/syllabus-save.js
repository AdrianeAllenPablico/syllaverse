// File: resources/js/faculty/utilities/syllabus-save.js
// Purpose: Wire the global toolbar Save button to module-specific saves.
// Currently triggers Mission & Vision save; extendable for other modules.

(function(){
	function setState(state){ try { if (window.SVSaveState) window.SVSaveState.set(state); } catch (e) { /* noop */ } }

	async function saveMissionVision(){
		if (typeof window.saveMissionVision !== 'function') return false;
		await window.saveMissionVision(false);
		return true;
	}

	document.addEventListener('DOMContentLoaded', function(){
		const btn = document.getElementById('syllabusSaveBtn');
		if (!btn) return;
		btn.addEventListener('click', async function(){
			const prevDisabled = btn.disabled;
			try {
				btn.disabled = true;
				setState('saving');
				// Run Mission & Vision save first
				await saveMissionVision();
				setState('saved');
			} catch (e) {
				console.error('Toolbar Save failed:', e);
				setState('error');
			} finally {
				// Return to idle after a short delay for visual feedback
				setTimeout(() => { setState('idle'); btn.disabled = prevDisabled; }, 800);
			}
		});
	});
})();
