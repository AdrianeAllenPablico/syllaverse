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

	async function saveCourseInfo(){
		if (typeof window.saveCourseInfo !== 'function') return false;
		await window.saveCourseInfo(false);
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

				// Execute saves sequentially; ignore modules not present
				const results = [];
				try { results.push(await saveCourseInfo()); } catch (e) { console.error('Course Info save failed:', e); results.push(false); }
				try { results.push(await saveMissionVision()); } catch (e) { console.error('Mission/Vision save failed:', e); results.push(false); }

				// If any module reported failure, reflect error state
				if (results.some(r => r === false)) {
					setState('error');
				} else {
					setState('saved');
				}
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
