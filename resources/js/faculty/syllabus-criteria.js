// Criteria board controls: add/remove sections with max of 3
// Assumes markup from criteria-assessment.blade.php

(function(){
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

	function createSubLine(initial){
		const el = document.createElement('div');
		el.className = 'sub-line';
		const task = document.createElement('input');
		task.type = 'text';
		task.className = 'sub-input cis-input';
		task.placeholder = 'Task';
		task.value = (initial && initial.description) ? String(initial.description) : '';
		el.appendChild(task);
		const pct = document.createElement('input');
		pct.type = 'text';
		pct.className = 'sub-percent cis-number';
		pct.placeholder = '0%';
		pct.value = (initial && initial.percent) ? String(initial.percent) : '';
		el.appendChild(pct);
		return el;
	}

	function addSubLineToSection(sectionEl){
		if (!sectionEl) return;
		const list = sectionEl.querySelector('.sub-list');
		if (!list) return;
		const line = createSubLine();
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
		let init = [];
		try {
			const raw = list.dataset.init;
			if (raw) {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) init = parsed;
			}
		} catch(e){}
		if (init.length){
			list.innerHTML = '';
			init.forEach(item => list.appendChild(createSubLine(item)));
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
					<input type="text" name="criteria_${key}_task" class="sub-input cis-input" placeholder="Task" />
					<input type="text" name="criteria_${key}_percent" class="sub-percent cis-number" placeholder="0%" />
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
		}
		updateButtonStates();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bind, { once: true });
	} else {
		try { bind(); } catch(e){}
	}
})();
