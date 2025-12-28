// Criteria board controls: add/remove sections with max of 3
// Assumes markup from criteria-assessment.blade.php

(function(){
	const MODULE_NAME = 'criteria';
	let lastSavedCriteria = null; // cache snapshot from server to reseed on add/remove
	// Action-based undo/redo
	let actions = [];
	let redoActions = [];
	const HISTORY_LIMIT = 50;
	let prevSerialized = null;
	let recordTimer = null;

	function snapshotsEqual(a, b){
		try {
			return JSON.stringify(a) === JSON.stringify(b);
		} catch(e){ return false; }
	}

	function recordHistory(){
		try {
			const snap = collectCriteriaSections();
			const serialized = JSON.stringify(snap);
			if (prevSerialized && prevSerialized === serialized){
				return; // skip duplicate consecutive snapshots
			}
			prevSerialized = serialized;
			actions.push({ type: 'snapshot', snapshot: JSON.parse(JSON.stringify(snap)) });
			redoActions = [];
			if (actions.length > HISTORY_LIMIT){ actions.shift(); }
		} catch(e){}
	}

	function recordHistoryDebounced(){
		try { clearTimeout(recordTimer); } catch(e){}
		recordTimer = setTimeout(recordHistory, 250);
	}

	function rebuildFromSnapshot(sections){
		const container = getContainer();
		if (!container) return;
		container.innerHTML = '';
		const max = Math.min(3, Array.isArray(sections) ? sections.length : 0);
		for (let i = 0; i < max; i++){
			const s = sections[i] || {};
			const key = s.key || `section_${i+1}`;
			const heading = (s.heading || '').trim();
			const value = Array.isArray(s.value) ? s.value : [];
			const section = createSectionElement(i);
			section.dataset.sectionKey = key;
			const cat = section.querySelector('.category');
			if (cat){
				cat.value = heading;
				cat.name = `criteria_${key}_category`;
				cat.dataset.section = key;
			}
			const list = section.querySelector('.sub-list');
			if (list){
				list.dataset.init = JSON.stringify(value);
			}
			container.appendChild(section);
			seedSubList(section);
		}
		updateButtonStates();
		try { if (window.feather && typeof window.feather.replace === 'function') window.feather.replace(); } catch(e){}
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function applySnapshot(sections){
		lastSavedCriteria = Array.isArray(sections) ? sections : [];
		rebuildFromSnapshot(lastSavedCriteria);
		prevSerialized = JSON.stringify(lastSavedCriteria);
	}
	function pushAction(action){
		try {
			actions.push(action);
			if (actions.length > HISTORY_LIMIT){ actions.shift(); }
			redoActions = [];
		} catch(e){}
	}

	function getSectionElByKey(key){
		const container = getContainer();
		if (!container) return null;
		return container.querySelector(`.section[data-section-key="${CSS.escape(key)}"]`);
	}

	function getActiveSectionKey(){
		try {
			const container = getContainer();
			const ae = document.activeElement;
			if (container && ae && container.contains(ae)){
				const sec = ae.closest('.section');
				if (sec && sec.dataset && sec.dataset.sectionKey) return sec.dataset.sectionKey;
			}
			return window.SVCriteriaLastSectionKey || null;
		} catch(e){ return null; }
	}

	function focusToSectionEnd(sectionKey){
		try {
			const sec = getSectionElByKey(sectionKey);
			if (!sec) return;
			const lines = sec.querySelectorAll('.sub-line');
			const target = lines.length ? lines[lines.length - 1].querySelector('.sub-input') : sec.querySelector('.category');
			if (target) target.focus();
		} catch(e){}
	}

	function applyEditInput(action, dir){
		const key = action.sectionKey;
		const sec = getSectionElByKey(key);
		if (!sec) return;
		const value = dir === 'undo' ? action.oldValue : action.newValue;
		if (action.field === 'heading'){
			const cat = sec.querySelector('.category');
			if (cat) cat.value = value;
			return;
		}
		// row fields
		const idx = action.index ?? 0;
		const line = sec.querySelectorAll('.sub-line')[idx];
		if (!line) return;
		if (action.field === 'description'){
			const inp = line.querySelector('.sub-input');
			if (inp) inp.value = value;
		} else if (action.field === 'percent'){
			const inp = line.querySelector('.sub-percent');
			if (inp) inp.value = ensurePercent(value);
		}
	}

	function applyAddRow(action, dir){
		const sec = getSectionElByKey(action.sectionKey);
		if (!sec) return;
		const list = sec.querySelector('.sub-list');
		if (!list) return;
		if (dir === 'undo'){
			const lines = list.querySelectorAll('.sub-line');
			if (lines.length) lines[lines.length - 1].remove();
		} else {
			const idx = list.querySelectorAll('.sub-line').length;
			const line = createSubLine(action.snapshot || null, action.sectionKey, idx);
			list.appendChild(line);
		}
	}

	function applyRemoveRow(action, dir){
		const sec = getSectionElByKey(action.sectionKey);
		if (!sec) return;
		const list = sec.querySelector('.sub-list');
		if (!list) return;
		if (dir === 'undo'){
			const idx = list.querySelectorAll('.sub-line').length;
			const line = createSubLine(action.snapshot || null, action.sectionKey, idx);
			list.appendChild(line);
		} else {
			const lines = list.querySelectorAll('.sub-line');
			if (lines.length) lines[lines.length - 1].remove();
		}
	}

	function applyAddSection(action, dir){
		const container = getContainer();
		if (!container) return;
		if (dir === 'undo'){
			const secs = container.querySelectorAll('.section');
			if (secs.length) secs[secs.length - 1].remove();
			updateButtonStates();
			return;
		}
		const idx = sectionCount();
		if (idx >= 3) return;
		const section = createSectionElement(idx);
		section.dataset.sectionKey = action.key || section.dataset.sectionKey;
		const cat = section.querySelector('.category');
		if (cat){
			cat.value = action.heading || '';
			cat.name = `criteria_${section.dataset.sectionKey}_category`;
			cat.dataset.section = section.dataset.sectionKey;
		}
		const list = section.querySelector('.sub-list');
		if (list){ list.dataset.init = JSON.stringify(action.value || []); }
		container.appendChild(section);
		seedSubList(section);
		updateButtonStates();
	}

	function applyRemoveSection(action, dir){
		const container = getContainer();
		if (!container) return;
		if (dir === 'undo'){
			// re-add section from snapshot
			applyAddSection({ key: action.key, heading: action.heading, value: action.value }, 'redo');
		} else {
			const secs = container.querySelectorAll('.section');
			if (secs.length) secs[secs.length - 1].remove();
			updateButtonStates();
		}
	}

	function performUndo(){
		if (!actions.length) return;
		const targetKey = getActiveSectionKey();
		let idx = -1;
		for (let i = actions.length - 1; i >= 0; i--){
			const act = actions[i];
			if (act.type === 'snapshot'){ idx = i; break; }
			if (targetKey && act.sectionKey && act.sectionKey === targetKey){ idx = i; break; }
			if (!targetKey && (act.type === 'addSection' || act.type === 'removeSection' || act.type === 'addRow' || act.type === 'removeRow')){ idx = i; break; }
		}
		if (idx < 0) idx = actions.length - 1;
		const a = actions.splice(idx, 1)[0];
		redoActions.push(a);
		switch (a.type){
			case 'editInput': applyEditInput(a, 'undo'); break;
			case 'addRow': applyAddRow(a, 'undo'); break;
			case 'removeRow': applyRemoveRow(a, 'undo'); break;
			case 'addSection': applyAddSection(a, 'undo'); break;
			case 'removeSection': applyRemoveSection(a, 'undo'); break;
			case 'snapshot': applySnapshot(a.snapshot); break;
		}
		const keyForFocus = a.sectionKey || targetKey || null;
		if (keyForFocus) focusToSectionEnd(keyForFocus);
	}

	function performRedo(){
		if (!redoActions.length) return;
		const targetKey = getActiveSectionKey();
		let idx = -1;
		for (let i = redoActions.length - 1; i >= 0; i--){
			const act = redoActions[i];
			if (act.type === 'snapshot'){ idx = i; break; }
			if (targetKey && act.sectionKey && act.sectionKey === targetKey){ idx = i; break; }
			if (!targetKey && (act.type === 'addSection' || act.type === 'removeSection' || act.type === 'addRow' || act.type === 'removeRow')){ idx = i; break; }
		}
		if (idx < 0) idx = redoActions.length - 1;
		const a = redoActions.splice(idx, 1)[0];
		actions.push(a);
		switch (a.type){
			case 'editInput': applyEditInput(a, 'redo'); break;
			case 'addRow': applyAddRow(a, 'redo'); break;
			case 'removeRow': applyRemoveRow(a, 'redo'); break;
			case 'addSection': applyAddSection(a, 'redo'); break;
			case 'removeSection': applyRemoveSection(a, 'redo'); break;
			case 'snapshot': applySnapshot(a.snapshot); break;
		}
		const keyForFocus = a.sectionKey || targetKey || null;
		if (keyForFocus) focusToSectionEnd(keyForFocus);
	}
	function getContainer(){
		return document.getElementById('criteria-sections-container');
	}

	function getRootEl(){
		try {
			const el = document.querySelector('.cis-criteria');
			if (el) return el;
			const c = getContainer();
			return c ? c.closest('.cis-criteria') : null;
		} catch(e){ return null; }
	}

	function isFocusInsideModule(){
		const root = getRootEl();
		const ae = document.activeElement;
		return !!(root && ae && root.contains(ae));
	}

	function isEventForModule(e){
		const requested = e && e.detail && e.detail.module ? String(e.detail.module) : null;
		if (requested) return requested === MODULE_NAME;
		return isFocusInsideModule();
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
		pushAction({ type: 'addRow', sectionKey, index, snapshot: initial || { description: '', percent: '' } });
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
		if (last){
			const desc = (last.querySelector('.sub-input')?.value || '').trim();
			const pct  = ensurePercent((last.querySelector('.sub-percent')?.value || '').trim());
			const index = lines.length - 1;
			last.remove();
			const sectionKey = sectionEl.dataset.sectionKey || (sectionEl.querySelector('.category')?.dataset.section) || 'section';
			pushAction({ type: 'removeRow', sectionKey, index, snapshot: { description: desc, percent: pct } });
		}
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
		const key = section.dataset.sectionKey;
		const heading = (section.querySelector('.category')?.value || '').trim();
		const list = section.querySelector('.sub-list');
		let value = [];
		try {
			const raw = list?.dataset?.init || '[]';
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed)) value = parsed;
		} catch(e){}
		pushAction({ type: 'addSection', index: count, key, heading, value });
	}

	function removeSection(){
		const container = getContainer();
		if (!container) return;
		const sections = container.querySelectorAll('.section');
		if (sections.length <= 1) { updateButtonStates(); return; }
		const last = sections[sections.length - 1];
		if (last){
			const key = last.dataset.sectionKey || `section_${sections.length}`;
			const heading = (last.querySelector('.category')?.value || '').trim();
			const list = last.querySelector('.sub-list');
			let value = [];
			try {
				const initRaw = list?.dataset?.init || '[]';
				const parsed = JSON.parse(initRaw);
				if (Array.isArray(parsed)) value = parsed;
				else {
					// Build from DOM if dataset not present
					value = Array.from(list.querySelectorAll('.sub-line')).map(line => ({
						description: (line.querySelector('.sub-input')?.value || '').trim(),
						percent: ensurePercent((line.querySelector('.sub-percent')?.value || '').trim())
					}));
				}
			} catch(e){}
			last.remove();
			pushAction({ type: 'removeSection', index: sections.length - 1, key, heading, value });
		}
		updateButtonStates();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function bind(){
		const addBtn = getAddBtn();
		const removeBtn = getRemoveBtn();
		if (addBtn) addBtn.addEventListener('click', addSection);
		if (removeBtn) removeBtn.addEventListener('click', removeSection);

		const root = getRootEl();
		if (root){
			root.addEventListener('focusin', function(){ try { window.SVLastActiveModule = MODULE_NAME; window.SVActiveModuleName = MODULE_NAME; } catch(e){} });
			root.addEventListener('mouseenter', function(){ try { window.SVLastActiveModule = MODULE_NAME; window.SVActiveModuleName = MODULE_NAME; } catch(e){} });
			// Global toolbar will dispatch sv:undo/sv:redo; we mark active module only.
		}
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
		// Record initial snapshot for undo/redo fallback
		recordHistory();
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
			// Track input previous values and push granular edit actions
			container.addEventListener('focusin', function(e){
				const t = e.target;
				if (!t || !t.classList) return;
				if (t.classList.contains('category') || t.classList.contains('sub-input') || t.classList.contains('sub-percent')){
					t.dataset.prevValue = t.value || '';
					try {
						const sec = t.closest('.section');
						if (sec && sec.dataset && sec.dataset.sectionKey) window.SVCriteriaLastSectionKey = sec.dataset.sectionKey;
						try { window.SVActiveModuleName = MODULE_NAME; window.SVLastActiveModule = MODULE_NAME; } catch(e){}
					} catch(e){}
				}
			});
			container.addEventListener('blur', function(e){
				const t = e.target;
				if (!t || !t.classList) return;
				if (!(t.classList.contains('category') || t.classList.contains('sub-input') || t.classList.contains('sub-percent'))) return;
				const prev = t.dataset.prevValue ?? '';
				const now = t.value || '';
				if (prev === now) return;
				const sec = t.closest('.section');
				const sectionKey = sec?.dataset?.sectionKey || (sec?.querySelector('.category')?.dataset?.section) || 'section';
				let field = 'heading';
				let index = null;
				if (t.classList.contains('sub-input')){ field = 'description'; index = (t.closest('.sub-line')?.querySelector('.sub-input')?.dataset?.index) ?? null; }
				if (t.classList.contains('sub-percent')){ field = 'percent'; index = (t.closest('.sub-line')?.querySelector('.sub-percent')?.dataset?.index) ?? null; }
				pushAction({ type: 'editInput', sectionKey, field, index: index != null ? parseInt(index, 10) : null, oldValue: prev, newValue: now });
				try { delete t.dataset.prevValue; } catch(_){}
			}, true);

			// Keyboard shortcuts handled by global toolbar; no local interception
		}

		// Global toolbar will invoke window.performCriteriaUndo/Redo directly; no local event listeners
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
			// Record server-confirmed snapshot as action
			pushAction({ type: 'snapshot', snapshot: lastSavedCriteria });
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
	try {
		window.saveCriteria = saveCriteria;
		// Undo/Redo temporarily disabled; no exports
	} catch(e){}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bind, { once: true });
	} else {
		try { bind(); } catch(e){}
	}
})();
