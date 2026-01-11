/**
 * Criteria Assessment Controls
 * Integrates with global undo/redo system via history-core.js
 * Add/remove sections with max of 3
 */

import { snapshotCriteria } from './utilities/snapshot.js';

(function(){
	const MODULE_NAME = 'criteria';
	let lastSavedCriteria = null; // cache snapshot from server to reseed on add/remove
	
	// Local undo/redo stacks for granular action tracking
	let actions = [];
	let redoActions = [];
	const HISTORY_LIMIT = 100;

	// Helper: ensure percent strings are normalized: '20' -> '20%'; '20 %' -> '20%'; '20%%' -> '20%'
	function ensurePercent(val){
		const s = String(val == null ? '' : val).trim();
		if (s === '') return '';
		if (/^\d+$/.test(s)) return s + '%';
		// Already has a percent, normalize to single trailing '%'
		if (/%$/.test(s) || /%+\s*$/.test(s)) return s.replace(/\s*%+\s*$/, '%');
		return s;
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

	function getSectionElByKey(key){
		const container = getContainer();
		if (!container) return null;
		return container.querySelector(`.section[data-section-key="${CSS.escape(key)}"]`);
	}

	function sectionCount(){
		const c = getContainer();
		return c ? c.querySelectorAll('.section').length : 0;
	}

	function updateButtonStates(){
		const addBtn = document.querySelector('.cis-criteria .criteria-add-section-btn');
		const removeBtn = document.querySelector('.cis-criteria .criteria-remove-section-btn');
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

	// ==================== Undo/Redo Helpers ====================
	
	function pushAction(action){
		try {
			action.ts = action.ts || Date.now();
			actions.push(action);
			if (actions.length > HISTORY_LIMIT){ actions.shift(); }
			redoActions = []; // Clear redo on new action
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

	function focusToField(sectionKey, field, index){
		try {
			const sec = getSectionElByKey(sectionKey);
			if (!sec) return;
			
			if (field === 'heading'){
				const cat = sec.querySelector('.category');
				if (cat) { cat.focus(); return; }
			}
			
			if ((field === 'description' || field === 'percent') && index != null){
				const lines = sec.querySelectorAll('.sub-line');
				if (lines[index]){
					const cls = field === 'description' ? '.sub-input' : '.sub-percent';
					const target = lines[index].querySelector(cls);
					if (target) { target.focus(); return; }
				}
			}
			
			// Fallback: focus last input
			const lines = sec.querySelectorAll('.sub-line');
			const target = lines.length ? lines[lines.length - 1].querySelector('.sub-input') : sec.querySelector('.category');
			if (target) target.focus();
		} catch(e){}
	}

	// Apply functions for each action type
	function applyEditInput(action, dir){
		const sec = getSectionElByKey(action.sectionKey);
		if (!sec) return;
		const value = dir === 'undo' ? action.oldValue : action.newValue;
		
		if (action.field === 'heading'){
			const cat = sec.querySelector('.category');
			if (cat) cat.value = value;
			focusToField(action.sectionKey, 'heading', null);
			return;
		}
		
		const idx = action.index ?? 0;
		const line = sec.querySelectorAll('.sub-line')[idx];
		if (!line) return;
		
		if (action.field === 'description'){
			const inp = line.querySelector('.sub-input');
			if (inp) inp.value = value;
		} else if (action.field === 'percent'){
			const inp = line.querySelector('.sub-percent');
			if (inp) inp.value = value;
		}
		focusToField(action.sectionKey, action.field, idx);
	}

	function applyAddRow(action, dir){
		const sec = getSectionElByKey(action.sectionKey);
		if (!sec) return;
		const list = sec.querySelector('.sub-list');
		if (!list) return;
		
		if (dir === 'undo'){
			// Remove the row that was added at this index
			const lines = list.querySelectorAll('.sub-line');
			const targetIndex = action.index ?? (lines.length - 1);
			if (lines[targetIndex]) {
				lines[targetIndex].remove();
			}
		} else {
			// Re-add the row at the same index
			const idx = action.index ?? list.querySelectorAll('.sub-line').length;
			const data = action.data || { description: '', percent: '' };
			const line = createSubLine(data, action.sectionKey, idx);
			list.appendChild(line);
		}
		updateButtonStates();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function applyRemoveRow(action, dir){
		const sec = getSectionElByKey(action.sectionKey);
		if (!sec) return;
		const list = sec.querySelector('.sub-list');
		if (!list) return;
		
		if (dir === 'undo'){
			// Re-add the removed row at its original index
			const idx = action.index ?? list.querySelectorAll('.sub-line').length;
			const data = action.data || { description: '', percent: '' };
			const line = createSubLine(data, action.sectionKey, idx);
			
			// Insert at the correct position
			const lines = list.querySelectorAll('.sub-line');
			if (idx < lines.length) {
				list.insertBefore(line, lines[idx]);
			} else {
				list.appendChild(line);
			}
		} else {
			// Remove the row at the specified index again
			const lines = list.querySelectorAll('.sub-line');
			const targetIndex = action.index ?? (lines.length - 1);
			if (lines[targetIndex]) {
				lines[targetIndex].remove();
			}
		}
		updateButtonStates();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function applyAddSection(action, dir){
		const container = getContainer();
		if (!container) return;
		
		if (dir === 'undo'){
			// Remove the section that was added
			const sec = getSectionElByKey(action.key);
			if (sec) {
				sec.remove();
			} else {
				// Fallback: remove last section
				const secs = container.querySelectorAll('.section');
				if (secs.length) secs[secs.length - 1].remove();
			}
		} else {
			// Re-add the section
			const idx = container.querySelectorAll('.section').length;
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
			if (list){ 
				list.dataset.init = JSON.stringify(action.rows || []); 
			}
			container.appendChild(section);
			seedSubList(section);
			try { if (window.feather && typeof window.feather.replace === 'function') window.feather.replace(); } catch(e){}
		}
		updateButtonStates();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function applyRemoveSection(action, dir){
		const container = getContainer();
		if (!container) return;
		
		if (dir === 'undo'){
			// Re-add the removed section
			const idx = container.querySelectorAll('.section').length;
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
			if (list){ 
				list.dataset.init = JSON.stringify(action.rows || []); 
			}
			container.appendChild(section);
			seedSubList(section);
			try { if (window.feather && typeof window.feather.replace === 'function') window.feather.replace(); } catch(e){}
		} else {
			// Remove the section again
			const sec = getSectionElByKey(action.key);
			if (sec) {
				sec.remove();
			} else {
				// Fallback: remove last section
				const secs = container.querySelectorAll('.section');
				if (secs.length) secs[secs.length - 1].remove();
			}
		}
		updateButtonStates();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
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
	}

	function performUndo(){
		if (!actions.length) return false;
		const a = actions.pop();
		redoActions.push(a);
		
		switch (a.type){
			case 'editInput': applyEditInput(a, 'undo'); break;
			case 'addRow': applyAddRow(a, 'undo'); break;
			case 'removeRow': applyRemoveRow(a, 'undo'); break;
			case 'addSection': applyAddSection(a, 'undo'); break;
			case 'removeSection': applyRemoveSection(a, 'undo'); break;
			case 'snapshot': applySnapshot(a.snapshot); break;
		}
		
		return true;
	}

	function performRedo(){
		if (!redoActions.length) return false;
		const a = redoActions.pop();
		actions.push(a);
		
		switch (a.type){
			case 'editInput': applyEditInput(a, 'redo'); break;
			case 'addRow': applyAddRow(a, 'redo'); break;
			case 'removeRow': applyRemoveRow(a, 'redo'); break;
			case 'addSection': applyAddSection(a, 'redo'); break;
			case 'removeSection': applyRemoveSection(a, 'redo'); break;
			case 'snapshot': applySnapshot(a.snapshot); break;
		}
		
		return true;
	}

	function recordSnapshot(){
		try {
			const sections = collectCriteriaSections();
			pushAction({ type: 'snapshot', snapshot: JSON.parse(JSON.stringify(sections)), ts: Date.now() });
		} catch(e){}
	}

	// ==================== End Undo/Redo Helpers ====================

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
					<input type="text" name="criteria_${key}_percent_0" class="sub-number" placeholder="0%" data-index="0" />
				</div>
			</div>
			<div class="criteria-actions-row">
				<button type="button" class="btn btn-sm criteria-remove-btn" title="Remove last sub-item" aria-label="Remove last sub-item"><i data-feather="minus"></i></button>
				<button type="button" class="btn btn-sm criteria-add-btn" title="Add sub-item" aria-label="Add sub-item"><i data-feather="plus"></i></button>
			</div>`;
		return section;
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
		// Push addRow action
		pushAction({ 
			type: 'addRow', 
			sectionKey, 
			index, 
			data: initial || { description: '', percent: '' } 
		});
		// Trigger global snapshot and history recording
		pushGlobalSnapshot();
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
		if (!last) return;
		
		// Capture data before removing
		const sectionKey = sectionEl.dataset.sectionKey || 'section';
		const index = lines.length - 1;
		const desc = (last.querySelector('.sub-input')?.value || '').trim();
		const pct = (last.querySelector('.sub-percent')?.value || '').trim();
		
		last.remove();
		
		// Push removeRow action
		pushAction({ 
			type: 'removeRow', 
			sectionKey, 
			index, 
			data: { description: desc, percent: pct } 
		});
		// Trigger global snapshot and history recording
		pushGlobalSnapshot();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function addSection(){
		const container = getContainer();
		if (!container) return;
		const count = sectionCount();
		if (count >= 3) { updateButtonStates(); return; }
		const section = createSectionElement(count);
		const sectionKey = section.dataset.sectionKey;
		let heading = '';
		let rows = [];
		
		// Seed from saved snapshot if available for this new index
		if (lastSavedCriteria && Array.isArray(lastSavedCriteria)){
			const snap = lastSavedCriteria[count];
			if (snap){
				heading = snap.heading || '';
				rows = Array.isArray(snap.value) ? snap.value : [];
				const cat = section.querySelector('.category');
				if (cat && heading) cat.value = heading;
				const list = section.querySelector('.sub-list');
				if (list) list.dataset.init = JSON.stringify(rows);
			}
		}
		
		container.appendChild(section);
		seedSubList(section);
		updateButtonStates();
		try { if (window.feather && typeof window.feather.replace === 'function') window.feather.replace(); } catch(e){}
		
		// Push addSection action
		pushAction({ 
			type: 'addSection', 
			key: sectionKey, 
			heading, 
			rows 
		});
		// Trigger global snapshot and history recording
		pushGlobalSnapshot();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	function removeSection(){
		const container = getContainer();
		if (!container) return;
		const sections = container.querySelectorAll('.section');
		if (sections.length <= 1) { updateButtonStates(); return; }
		const last = sections[sections.length - 1];
		if (!last) return;
		
		// Capture data before removing
		const key = last.dataset.sectionKey || `section_${sections.length}`;
		const heading = (last.querySelector('.category')?.value || '').trim();
		const rows = [];
		last.querySelectorAll('.sub-list .sub-line').forEach(line => {
			const desc = (line.querySelector('.sub-input')?.value || '').trim();
			const pct = (line.querySelector('.sub-percent')?.value || '').trim();
			if (desc || pct) rows.push({ description: desc, percent: pct });
		});
		
		last.remove();
		updateButtonStates();
		
		// Push removeSection action
		pushAction({ 
			type: 'removeSection', 
			key, 
			heading, 
			rows 
		});
		// Trigger global snapshot and history recording
		pushGlobalSnapshot();
		try { document.dispatchEvent(new Event('criteriaChanged')); } catch(e){}
	}

	/**
	 * Push current criteria state to global history via SVHistory
	 * This integrates criteria with the global undo/redo system
	 */
	function pushGlobalSnapshot(){
		try {
			if (window.SVHistory && typeof window.SVHistory.pushSnapshot === 'function'){
				window.SVActiveModuleName = MODULE_NAME;
				const snap = snapshotCriteria();
				window.SVHistory.pushSnapshot('criteria', snap);
			}
		} catch(e){
			console.error('Failed to push criteria snapshot to global history:', e);
		}
	}

	async function saveCriteria(showAlert = false){
		try {
			const doc = document.getElementById('syllabus-document');
			const syllabusId = doc ? doc.getAttribute('data-syllabus-id') : null;
			if (!syllabusId) throw new Error('Missing syllabus id');
			const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
			const sections = collectCriteriaSections();
			// Keep hidden criteria_data_input in sync so validators see latest JSON
			try {
				const hidden = document.getElementById('criteria_data_input');
				if (hidden) hidden.value = JSON.stringify(sections);
			} catch(e) {
				console.warn('Failed to sync criteria_data_input', e);
			}
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
			// Reset global history after successful save
			if (window.SVHistory && typeof window.SVHistory.resetAfterSave === 'function'){
				window.SVHistory.resetAfterSave();
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

	function bind(){
		const addBtn = document.querySelector('.cis-criteria .criteria-add-section-btn');
		const removeBtn = document.querySelector('.cis-criteria .criteria-remove-section-btn');
		if (addBtn) addBtn.addEventListener('click', addSection);
		if (removeBtn) removeBtn.addEventListener('click', removeSection);

		const root = getRootEl();
		if (root){
			root.addEventListener('focusin', function(){ 
				try { 
					window.SVLastActiveModule = MODULE_NAME; 
					window.SVActiveModuleName = MODULE_NAME; 
				} catch(e){} 
			});
			root.addEventListener('mouseenter', function(){ 
				try { 
					window.SVLastActiveModule = MODULE_NAME; 
					window.SVActiveModuleName = MODULE_NAME; 
				} catch(e){} 
			});
		}

		// Capture initial server-rendered snapshot
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
			if (sections.length){ 
				lastSavedCriteria = sections;
				// Don't record initial snapshot - start with clean history
			}
		})();

		// Seed existing sections
		document.querySelectorAll('.cis-criteria .section').forEach(function(section){
			seedSubList(section);
		});

		// Event delegation for add/remove buttons
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

			// Normalize percent on blur/change
			const normalize = function(target){
				if (!target || !target.classList || !target.classList.contains('sub-percent')) return;
				target.value = ensurePercent(target.value);
			};
			container.addEventListener('blur', function(e){ normalize(e.target); }, true);
			container.addEventListener('change', function(e){ normalize(e.target); }, true);

			// Track input changes and push editInput actions on blur
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
				if (prev === now) return; // No change
				
				const sec = t.closest('.section');
				const sectionKey = sec?.dataset?.sectionKey || (sec?.querySelector('.category')?.dataset?.section) || 'section';
				let field = 'heading';
				let index = null;
				
				if (t.classList.contains('category')){
					field = 'heading';
				} else if (t.classList.contains('sub-input')){
					field = 'description';
					const line = t.closest('.sub-line');
					const lines = Array.from(sec.querySelectorAll('.sub-line'));
					index = lines.indexOf(line);
				} else if (t.classList.contains('sub-percent')){
					field = 'percent';
					const line = t.closest('.sub-line');
					const lines = Array.from(sec.querySelectorAll('.sub-line'));
					index = lines.indexOf(line);
				}
				
				// Push editInput action
				pushAction({ 
					type: 'editInput', 
					sectionKey, 
					field, 
					index, 
					oldValue: prev, 
					newValue: now 
				});
				
				// Push to global history
				pushGlobalSnapshot();
				try { delete t.dataset.prevValue; } catch(_){}
			}, true);
		}

		updateButtonStates();
	}

	// Expose globally for toolbar integration
	try {
		window.saveCriteria = saveCriteria;
		window.performCriteriaUndo = performUndo;
		window.performCriteriaRedo = performRedo;
	} catch(e){}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bind, { once: true });
	} else {
		try { bind(); } catch(e){}
	}
})();
