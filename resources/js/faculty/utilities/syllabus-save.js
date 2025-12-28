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

	async function saveCriteria(){
		if (typeof window.saveCriteria !== 'function') return false;
		await window.saveCriteria(false);
		return true;
	}

	async function saveIlo(){
		if (typeof window.saveIlo !== 'function') return false;
		await window.saveIlo(false);
		return true;
	}

	async function saveIga(){
		if (typeof window.saveIga !== 'function') return false;
		await window.saveIga();
		return true;
	}

	async function saveCdio(){
		if (typeof window.saveCdio !== 'function') return false;
		await window.saveCdio();
		return true;
	}

	async function saveSdg(){
		if (typeof window.saveSdg !== 'function') return false;
		await window.saveSdg();
		return true;
	}

	async function saveCoursePolicies(){
		if (typeof window.saveCoursePolicies !== 'function') return false;
		await window.saveCoursePolicies();
		return true;
	}

	async function saveSo(){
		if (typeof window.saveSo !== 'function') return false;
		await window.saveSo();
		return true;
	}

	async function saveAssessmentTasks(){
		if (typeof window.saveAssessmentTasks !== 'function') return false;
		await window.saveAssessmentTasks();
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
				try { results.push(await saveCriteria()); } catch (e) { console.error('Criteria save failed:', e); results.push(false); }
				try { results.push(await saveIlo()); } catch (e) { console.error('ILO save failed:', e); results.push(false); }
				try { results.push(await saveIga()); } catch (e) { console.error('IGA save failed:', e); results.push(false); }
				try { results.push(await saveCdio()); } catch (e) { console.error('CDIO save failed:', e); results.push(false); }
				try { results.push(await saveSdg()); } catch (e) { console.error('SDG save failed:', e); results.push(false); }
				try { results.push(await saveCoursePolicies()); } catch (e) { console.error('Course Policies save failed:', e); results.push(false); }
				try { results.push(await saveSo()); } catch (e) { console.error('SO save failed:', e); results.push(false); }
				try { results.push(await saveAssessmentTasks()); } catch (e) { console.error('Assessment Tasks save failed:', e); results.push(false); }
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
