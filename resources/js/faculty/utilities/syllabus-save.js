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

	async function saveIloIga(){
		if (typeof window.saveIloIga !== 'function') return false;
		await window.saveIloIga();
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

	async function saveIloCdioSdg(){
		const fn = (typeof window.saveIloCdioSdgMapping === 'function')
			? window.saveIloCdioSdgMapping
			: (typeof window.saveIloCdioSdg === 'function' ? window.saveIloCdioSdg : null);
		if (!fn) return false;
		await fn();
		return true;
	}

	async function saveCoursePolicies(){
		if (typeof window.saveCoursePolicies !== 'function') return false;
		await window.saveCoursePolicies();
		return true;
	}

	async function saveTla(){
		if (typeof window.saveTla !== 'function') return false;
		await window.saveTla();
		return true;
	}

	async function saveAssessmentMappings(){
		if (typeof window.saveAssessmentMappings !== 'function') return false;
		await window.saveAssessmentMappings();
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

	async function saveIloSoCpa(){
		if (typeof window.saveIloSoCpa !== 'function') return false;
		await window.saveIloSoCpa();
		return true;
	}

	document.addEventListener('DOMContentLoaded', function(){
		const btn = document.getElementById('syllabusSaveBtn');
		if (!btn) return;
		btn.addEventListener('click', async function(){
			const prevDisabled = btn.disabled;
			try {
				btn.dataset.forceDisabled = '1';
				btn.disabled = true;
				setState('saving');
				try { if (window.SVHistory && window.SVHistory.setRestricted) window.SVHistory.setRestricted(true); } catch(e){}

				// Execute saves sequentially; ignore modules not present
				const results = [];
				try { results.push(await saveCourseInfo()); } catch (e) { console.error('Course Info save failed:', e); results.push(false); }
				try { results.push(await saveCriteria()); } catch (e) { console.error('Criteria save failed:', e); results.push(false); }
				try { results.push(await saveIlo()); } catch (e) { console.error('ILO save failed:', e); results.push(false); }
				try { results.push(await saveIga()); } catch (e) { console.error('IGA save failed:', e); results.push(false); }
				try { results.push(await saveIloIga()); } catch (e) { console.error('ILO-IGA save failed:', e); results.push(false); }
				try { results.push(await saveCdio()); } catch (e) { console.error('CDIO save failed:', e); results.push(false); }
				try { results.push(await saveSdg()); } catch (e) { console.error('SDG save failed:', e); results.push(false); }
				try { results.push(await saveIloCdioSdg()); } catch (e) { console.error('ILO-CDIO-SDG save failed:', e); results.push(false); }
				try { results.push(await saveCoursePolicies()); } catch (e) { console.error('Course Policies save failed:', e); results.push(false); }
				try { results.push(await saveTla()); } catch (e) { console.error('TLA save failed:', e); results.push(false); }
				try { results.push(await saveAssessmentMappings()); } catch (e) { console.error('Assessment Mapping save failed:', e); results.push(false); }
				try { results.push(await saveSo()); } catch (e) { console.error('SO save failed:', e); results.push(false); }
				try { results.push(await saveIloSoCpa()); } catch (e) { console.error('ILO-SO-CPA save failed:', e); results.push(false); }
				try { results.push(await saveAssessmentTasks()); } catch (e) { console.error('Assessment Tasks save failed:', e); results.push(false); }
				try { results.push(await saveMissionVision()); } catch (e) { console.error('Mission/Vision save failed:', e); results.push(false); }

				// If any module reported failure, reflect error state
				if (results.some(r => r === false)) {
					setState('error');
					// allow undo/redo to continue; don't reset history on failure
				} else {
					setState('saved');
					// Reset global undo/redo stacks and baselines after successful save
					try { if (window.SVHistory && window.SVHistory.resetAfterSave) window.SVHistory.resetAfterSave(); } catch(e){}
				}
			} catch (e) {
				console.error('Toolbar Save failed:', e);
				setState('error');
			} finally {
				// Return to idle after a short delay for visual feedback
				setTimeout(() => {
					setState('idle');
					try { delete btn.dataset.forceDisabled; } catch(e) {}
					// Re-evaluate unsaved-count and Save enabled/disabled state after all module saves
					try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}
					try { if (window.SVHistory && window.SVHistory.setRestricted) window.SVHistory.setRestricted(false); } catch(e){}
				}, 800);
			}
		});
	});
})();
