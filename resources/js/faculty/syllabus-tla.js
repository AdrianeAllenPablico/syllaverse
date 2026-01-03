// -----------------------------------------------------------------------------
// File: resources/js/faculty/syllabus-tla.js
// Purpose: Minimal restart — Add Row behavior for TLA table (client-side only)
// Notes:
// - Removes placeholder, clones first row when available, otherwise inserts a
//   compact template row consistent with the TLA partial.
// - Renumbers input names to sequential indices: tla[0], tla[1], ...
// - No backend calls; persistence happens via toolbar Save (window.saveTla).
// -----------------------------------------------------------------------------

(function(){
	'use strict';

	document.addEventListener('DOMContentLoaded', function(){
		const table = document.getElementById('tlaTable');
		const addBtn = document.getElementById('add-tla-row');
		if (!table || !addBtn) return;

		const tbody = table.querySelector('tbody');
		if (!tbody) return;

		// --- Autosize textareas so rows expand to fit long text ---
		function autosizeTextarea(el){
			if (!el) return;
			const prev = el.style.height;
			el.style.overflowY = 'hidden';
			el.style.height = 'auto';
			el.style.height = (el.scrollHeight) + 'px';
			return prev !== el.style.height;
		}

		function bindAutosize(el){
			if (!el || el.dataset.autosizeBound === '1') return;
			el.dataset.autosizeBound = '1';
			autosizeTextarea(el);
			el.addEventListener('input', () => autosizeTextarea(el));
			el.addEventListener('change', () => autosizeTextarea(el));
		}

		function initAutosize(scope){
			const root = scope || tbody;
			root.querySelectorAll('textarea').forEach(bindAutosize);
		}

		function removePlaceholder(){
			const ph = tbody.querySelector('#tla-placeholder');
			if (ph) ph.remove();
		}

		function focusRowDefaultField(row){
			if (!row) return;
			const topic = row.querySelector('textarea[name*="[topic]"]');
			if (topic) { topic.focus(); return; }
			const first = row.querySelector('input,textarea');
			if (first) first.focus();
		}

		function updateTlaIndices(){
			const rows = Array.from(tbody.querySelectorAll('tr:not(#tla-placeholder)'));
			rows.forEach((row, index) => {
				row.querySelectorAll('input, textarea').forEach(input => {
					const name = input.getAttribute('name');
					if (!name) return;
					const newName = name.replace(/tla\[\d*\]|tla\[\]/, `tla[${index}]`);
					input.setAttribute('name', newName);
					if (input.classList.contains('tla-position-field')) {
						input.value = index;
					}
					if (input.classList.contains('tla-id-field') && !input.value) {
						input.value = '';
					}
				});
			});
		}

		function createTemplateRow(){
			const tr = document.createElement('tr');
			tr.className = 'text-center align-middle';
			tr.innerHTML = `
				<td class="tla-ch"><input name="tla[][ch]" form="syllabusForm" class="form-control cis-input text-center" value="" placeholder="-"></td>
				<td class="tla-topic text-start"><textarea name="tla[][topic]" form="syllabusForm" class="form-control cis-textarea autosize cis-field" rows="2" placeholder="-"></textarea></td>
				<td class="tla-wks"><input name="tla[][wks]" form="syllabusForm" class="form-control cis-input text-center" value="" placeholder="-"></td>
				<td class="tla-outcomes text-start"><textarea name="tla[][outcomes]" form="syllabusForm" class="form-control cis-textarea autosize cis-field" rows="2" placeholder="-"></textarea></td>
				<td class="tla-ilo"><input name="tla[][ilo]" form="syllabusForm" class="form-control cis-input text-center" value="" placeholder="-"></td>
				<td class="tla-so"><input name="tla[][so]" form="syllabusForm" class="form-control cis-input text-center" value="" placeholder="-"></td>
				<td class="tla-delivery"><textarea name="tla[][delivery]" form="syllabusForm" class="form-control cis-textarea autosize cis-field" rows="1" placeholder="-"></textarea></td>
				<td class="tla-actions text-center"><button type="button" class="btn btn-sm btn-outline-danger remove-tla-row" data-id="" title="Delete Row"><i class="bi bi-trash"></i></button></td>
				<input type="hidden" class="tla-id-field" name="tla[][id]" value="">
				<input type="hidden" class="tla-position-field" name="tla[][position]" value="0">
			`;
			return tr;
		}

		function clearRowInputs(row){
			row.querySelectorAll('input, textarea').forEach(el => {
				if (el.type === 'hidden') { el.value = ''; }
				else { el.value = ''; }
			});
			// Reset autosize bindings on cloned textareas so new listeners can attach
			row.querySelectorAll('textarea').forEach(el => {
				try { el.removeAttribute('data-autosize-bound'); } catch(e) {}
				try { el.style.height = 'auto'; el.style.overflowY = 'hidden'; } catch(e) {}
			});
			const delBtn = row.querySelector('.remove-tla-row');
			if (delBtn) delBtn.setAttribute('data-id', '');
			// Clear any mapped displays if present
			const iloDisplay = row.querySelector('.ilo-mapped-codes');
			if (iloDisplay) iloDisplay.textContent = '';
			const soDisplay = row.querySelector('.so-mapped-codes');
			if (soDisplay) soDisplay.textContent = '';
			// Clear mapping button data attributes if present
			row.querySelectorAll('.map-ilo-btn, .map-so-btn').forEach(btn => { if (btn.dataset) btn.dataset.tlaid = ''; });
		}

		function addTlaRow(){
			removePlaceholder();

			const firstRow = tbody.querySelector('tr:not(#tla-placeholder)');
			let newRow;
			if (!firstRow) {
				newRow = createTemplateRow();
			} else {
				newRow = firstRow.cloneNode(true);
				clearRowInputs(newRow);
			}

			tbody.appendChild(newRow);
			updateTlaIndices();

			// Ensure new row textareas autosize to content
			initAutosize(newRow);

			// Re-render icons if feather is available
			try { if (window.feather) window.feather.replace(); } catch (e) {}

			// Focus sensible field
			setTimeout(() => focusRowDefaultField(newRow), 40);

			// Trigger change events for undo/redo capture
			setTimeout(() => {
				newRow.querySelectorAll('input, textarea').forEach(el => {
					el.dispatchEvent(new Event('input', { bubbles: true }));
					el.dispatchEvent(new Event('change', { bubbles: true }));
				});
			}, 50);

			// Unsaved changes indicator if available
			try { if (typeof window.updateUnsavedCount === 'function') window.updateUnsavedCount(); } catch (e) {}
		}

		addBtn.addEventListener('click', addTlaRow);

		// --- UI-only delete flow (no modal) ---

		function removeTlaRowClient(row, colIndex){
			if (!row) return;
			const rowsBefore = Array.from(tbody.querySelectorAll('tr:not(#tla-placeholder)'));
			const idx = rowsBefore.indexOf(row);

			// Remove row and renumber
			row.remove();
			updateTlaIndices();

			// If no rows left, show placeholder
			const remaining = Array.from(tbody.querySelectorAll('tr:not(#tla-placeholder)'));
			if (remaining.length === 0) {
				const placeholder = document.createElement('tr');
				placeholder.id = 'tla-placeholder';
				placeholder.innerHTML = `
					<td colspan="8" class="text-center text-muted py-4">
						<p class="mb-2">No TLA activities added yet.</p>
						<p class="mb-0"><small>Click the <strong>+</strong> button above to add a TLA row.</small></p>
					</td>
				`;
				tbody.appendChild(placeholder);
			}

			// Focus a logical next target
			const rowsAfter = Array.from(tbody.querySelectorAll('tr:not(#tla-placeholder)'));
			let targetRow = rowsAfter[idx] || rowsAfter[idx - 1] || null;
			if (!targetRow) return;

			if (typeof colIndex === 'number' && colIndex >= 0) {
				const els = Array.from(targetRow.querySelectorAll('input,textarea'));
				if (els[colIndex]) { els[colIndex].focus(); return; }
			}
			focusRowDefaultField(targetRow);

			// Update unsaved count and realtime snapshot if available
			try { if (typeof window.updateUnsavedCount === 'function') window.updateUnsavedCount(); } catch (e) {}
			try { if (typeof window.rebuildTlaRealtimeContext === 'function') window.rebuildTlaRealtimeContext(); } catch (e) {}
		}

		tbody.addEventListener('click', function(e){
			const btn = e.target.closest('.remove-tla-row');
			if (!btn) return;

			const row = btn.closest('tr');
			// Determine focused column index for restoring focus
			let colIndex = -1;
			const active = document.activeElement;
			if (active && row.contains(active) && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
				const els = Array.from(row.querySelectorAll('input,textarea'));
				colIndex = Math.max(0, els.indexOf(active));
			}

			// Remove immediately, regardless of saved/unsaved state
			removeTlaRowClient(row, colIndex);
		});

		// Initial autosize on existing rows
		initAutosize(tbody);

		// Observe future additions to keep autosize behavior
		const mo = new MutationObserver((mutations) => {
			for (const m of mutations) {
				m.addedNodes && m.addedNodes.forEach(node => {
					if (!(node instanceof Element)) return;
					if (node.matches('tr')) initAutosize(node);
					node.querySelectorAll && initAutosize(node);
				});
			}
		});
		mo.observe(tbody, { childList: true, subtree: true });

		// Expose for other scripts if needed
		try { window.addTlaRow = addTlaRow; } catch (e) {}
	});
})();

