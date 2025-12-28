// Criteria board controls: add/remove sections with max of 3
// Assumes markup from criteria-assessment.blade.php

(function(){
	let lastSavedCriteria = null; // cache snapshot from server to reseed on add/remove
	function getContainer(){
		return document.getElementById('criteria-sections-container');
	}
	function getAddBtn(){
		return document.querySelector('.cis-criteria .criteria-add-section-btn');
	}
	function getRemoveBtn(){
		return document.querySelector('.cis-criteria .criteria-remove-section-btn');
	}
	function sectionCount(){
		const c = getContainer();
		return c ? c.querySelectorAll('.section').length : 0;
	}
	function updateButtonStates(){
		const addBtn = getAddBtn();
		const removeBtn = getRemoveBtn();
		const count = sectionCount();
		if (addBtn){
			const disabled = count >= 3;
			addBtn.disabled = disabled;
			addBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
			try { addBtn.title = disabled ? 'Maximum of 3 sections reached' : 'Add section'; } catch(e){}
		}
		if (removeBtn){
			const disabled = count <= 1;
			removeBtn.disabled = disabled;
			removeBtn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
		}
	}

	// Ensure percent strings are normalized: '20' -> '20%'; '20 %' -> '20%'; '20%%' -> '20%'
	function ensurePercent(val){
		const s = String(val == null ? '' : val).trim();
		if (s === '') return '';
		if (/^\d+$/.test(s)) return s + '%';
		// Already has a percent, normalize to single trailing '%'
		if (/%$/.test(s) || /%+\s*$/.test(s)) return s.replace(/\s*%+\s*$/, '%');
		return s;
	}

	function createSubLine(initial, sectionKey, index){
		const el = document.createElement('div');
		el.className = 'sub-line';
		const task = document.createElement('input');
		task.type = 'text';
		task.className = 'sub-input cis-input';
		task.placeholder = 'Task';
		task.value = (initial && initial.description) ? String(initial.description) : '';
		if (sectionKey != null && index != null) {
			task.name = `criteria_${sectionKey}_task_${index}`;
			task.dataset.index = String(index);
		}
		el.appendChild(task);
		const pct = document.createElement('input');
		pct.type = 'text';
		pct.className = 'sub-percent cis-number';
		pct.placeholder = '0%';
		pct.value = ensurePercent((initial && initial.percent) ? String(initial.percent) : '');
		if (sectionKey != null && index != null) {
			pct.name = `criteria_${sectionKey}_percent_${index}`;
			pct.dataset.index = String(index);
		}
		el.appendChild(pct);
		return el;
	}

	function addSubLineToSection(sectionEl){
		if (!sectionEl) return;
		const list = sectionEl.querySelector('.sub-list');
		if (!list) return;
		const sectionKey = sectionEl.dataset.sectionKey || (sectionEl.querySelector('.category')?.dataset.section) || 'section';
		const index = list.querySelectorAll('.sub-line').length;
		let initial = null;
		if (lastSavedCriteria && Array.isArray(lastSavedCriteria)){
			const snap = lastSavedCriteria.find(s => (s.key || s.sectionKey || '') === sectionKey);
			if (snap && Array.isArray(snap.value) && snap.value[index]) initial = snap.value[index];
		}
		const line = createSubLine(initial, sectionKey, index);
		list.appendChild(line);
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
		const focusEl = line.querySelector('.sub-input');
		if (focusEl) { try { focusEl.focus(); } catch(e){} }
	}

	function removeSubLineFromSection(sectionEl){
		if (!sectionEl) return;
		const list = sectionEl.querySelector('.sub-list');
		if (!list) return;
		const lines = list.querySelectorAll('.sub-line');
		if (!lines.length) return;
		const last = lines[lines.length - 1];
		if (last) last.remove();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function seedSubList(sectionEl){
		if (!sectionEl) return;
		const list = sectionEl.querySelector('.sub-list');
		if (!list) return;
		const sectionKey = sectionEl.dataset.sectionKey || (sectionEl.querySelector('.category')?.dataset.section) || 'section';
		let init = [];
		// Prefer last saved snapshot when present
		if (lastSavedCriteria && Array.isArray(lastSavedCriteria)){
			const snap = lastSavedCriteria.find(s => (s.key || s.sectionKey || '') === sectionKey);
			if (snap){
				const cat = sectionEl.querySelector('.category');
				if (cat && (snap.heading || '') !== '') cat.value = snap.heading;
				init = Array.isArray(snap.value) ? snap.value : [];
			}
		}
		try {
			const raw = list.dataset.init;
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) init = parsed;
			}
		} catch(e){}
		if (init.length){
			list.innerHTML = '';
			init.forEach((item, idx) => list.appendChild(createSubLine(item, sectionKey, idx)));
		}
	}

	function createSectionElement(index){
		const key = 'section_' + (index + 1);
		const section = document.createElement('div');
		section.className = 'section';
		section.dataset.sectionKey = key;
		section.innerHTML = `
			<div class="section-head">
				<input type="text" name="criteria_${key}_category" id="category" data-section="${key}" class="category cis-input" placeholder="Category" value="" />
			</div>
			<div class="sub-list" aria-live="polite" data-init='[]'>
				<div class="sub-line">
					<input type="text" name="criteria_${key}_task_0" class="sub-input cis-input" placeholder="Task" data-index="0" />
					<input type="text" name="criteria_${key}_percent_0" class="sub-percent cis-number" placeholder="0%" data-index="0" />
				</div>
			</div>
			<div class="criteria-actions-row">
				<button type="button" class="btn btn-sm criteria-remove-btn" title="Remove last sub-item" aria-label="Remove last sub-item"><i data-feather="minus"></i></button>
				<button type="button" class="btn btn-sm criteria-add-btn" title="Add sub-item" aria-label="Add sub-item"><i data-feather="plus"></i></button>
			</div>`;
		return section;
	}

	function addSection(){
		const container = getContainer();
		if (!container) return;
		const count = sectionCount();
		if (count >= 3) { updateButtonStates(); return; }
		const section = createSectionElement(count);
		container.appendChild(section);
		// Seed from saved snapshot if available for this new index
		if (lastSavedCriteria && Array.isArray(lastSavedCriteria)){
			const snap = lastSavedCriteria[count];
			if (snap){
				const cat = section.querySelector('.category');
				if (cat && (snap.heading || '') !== '') cat.value = snap.heading;
				const list = section.querySelector('.sub-list');
				if (list) list.dataset.init = JSON.stringify(Array.isArray(snap.value) ? snap.value : []);
			}
		}
		seedSubList(section);
		updateButtonStates();
		try { if (window.feather && typeof window.feather.replace === 'function') window.feather.replace(); } catch(e){}
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function removeSection(){
		const container = getContainer();
		if (!container) return;
		const sections = container.querySelectorAll('.section');
		if (sections.length <= 1) { updateButtonStates(); return; }
		const last = sections[sections.length - 1];
		if (last) last.remove();
		updateButtonStates();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function bind(){
		const addBtn = getAddBtn();
		const removeBtn = getRemoveBtn();
		if (addBtn) addBtn.addEventListener('click', addSection);
		if (removeBtn) removeBtn.addEventListener('click', removeSection);
		// Capture initial server-rendered snapshot so re-adds work after reload
		(function initSnapshotFromDOM(){
			const container = getContainer();
			if (!container) return;
			const sections = [];
			container.querySelectorAll('.section').forEach(function(sec, idx){
				const key = sec.dataset.sectionKey || `section_${idx+1}`;
				const heading = (sec.querySelector('.section-head .category')?.value || '').trim();
				let init = [];
				try {
					const raw = sec.querySelector('.sub-list')?.dataset?.init || '[]';
					const parsed = JSON.parse(raw);
					if (Array.isArray(parsed)) init = parsed;
				} catch(e){}
				sections.push({ key, heading, value: init });
			});
			if (sections.length){ lastSavedCriteria = sections; }
		})();

		// Seed existing sections only; subline handlers use event delegation below
		document.querySelectorAll('.cis-criteria .section').forEach(function(section){
			seedSubList(section);
		});
		// Event delegation so newly added sections' bottom buttons work
		const container = getContainer();
		if (container){
			container.addEventListener('click', function(e){
				const add = e.target && e.target.closest ? e.target.closest('.criteria-add-btn') : null;
				if (add){
					const section = add.closest('.section');
					addSubLineToSection(section);
					return;
				}
				const rem = e.target && e.target.closest ? e.target.closest('.criteria-remove-btn') : null;
				if (rem){
					const section = rem.closest('.section');
					removeSubLineFromSection(section);
				}
			});

			// Normalize percent on blur/change for any .sub-percent input
			const normalize = function(target){
				if (!target || !target.classList || !target.classList.contains('sub-percent')) return;
				target.value = ensurePercent(target.value);
			};
			container.addEventListener('blur', function(e){ normalize(e.target); }, true);
			container.addEventListener('change', function(e){ normalize(e.target); }, true);
		}
		updateButtonStates();
	}

	// ------------------------------
	// Serialization + AJAX Save
	// ------------------------------
	function collectCriteriaSections(){
		const c = getContainer();
		if (!c) return [];
		const sections = Array.from(c.querySelectorAll('.section'));
		return sections.map((sectionEl, idx) => {
			const key = sectionEl.dataset.sectionKey || `section_${idx+1}`;
			const heading = (sectionEl.querySelector('.section-head .category')?.value || '').trim();
			const values = [];
			sectionEl.querySelectorAll('.sub-list .sub-line').forEach(line => {
				const desc = (line.querySelector('.sub-input')?.value || '').trim();
				const pct  = (line.querySelector('.sub-percent')?.value || '').trim();
				if (desc === '' && pct === '') return;
				values.push({ description: desc, percent: pct });
			});
			return { key, heading, value: values };
		});
	}

	async function saveCriteria(showAlert = false){
		try {
			const doc = document.getElementById('syllabus-document');
			const syllabusId = doc ? doc.getAttribute('data-syllabus-id') : null;
			if (!syllabusId) throw new Error('Missing syllabus id');
			const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
			const sections = collectCriteriaSections();
			const res = await fetch(`/faculty/syllabi/${syllabusId}/criteria`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'X-CSRF-TOKEN': token
				},
				body: JSON.stringify({ criteria_data: sections })
			});
			if (!res.ok) throw new Error(`Save failed (${res.status})`);
			const json = await res.json().catch(() => ({ success: true }));
			// Cache snapshot; prefer server 'criteria' payload, else fallback to what we sent
			lastSavedCriteria = Array.isArray(json?.criteria) ? json.criteria : sections;
			// Refresh existing sections' init to mirror snapshot
			const container = getContainer();
			if (container && lastSavedCriteria){
				container.querySelectorAll('.section').forEach(function(sec, idx){
					const key = sec.dataset.sectionKey || `section_${idx+1}`;
					const snap = lastSavedCriteria.find(s => (s.key || s.sectionKey || '') === key) || lastSavedCriteria[idx];
					if (snap){
						const cat = sec.querySelector('.category');
						if (cat && (snap.heading || '') !== '') cat.value = snap.heading;
						const list = sec.querySelector('.sub-list');
						if (list) {
							list.dataset.init = JSON.stringify(Array.isArray(snap.value) ? snap.value : []);
							seedSubList(sec);
						}
					}
				});
			}
			try { document.dispatchEvent(new Event('criteriaSaved')); } catch (e) {}
			if (showAlert) { try { alert('Criteria saved successfully'); } catch(e){} }
			return true;
		} catch (e) {
			console.error('saveCriteria error:', e);
			if (showAlert) { try { alert('Failed to save criteria: ' + e.message); } catch(_){} }
			return false;
		}
	}

	// Expose globally for toolbar integration
	try { window.saveCriteria = saveCriteria; } catch(e){}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bind, { once: true });
	} else {
		try { bind(); } catch(e){}
	}
})();
