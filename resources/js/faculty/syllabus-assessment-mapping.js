document.addEventListener('DOMContentLoaded', function() {
	const addColumnBtn = document.getElementById('add-week-column');
	const removeColumnBtn = document.getElementById('remove-week-column');

	// Capture current marks keyed by row + week label so we can re-apply after structure changes
	function captureWeekMarks(weekTable) {
		if (!weekTable) return new Map();
		const headerRow = weekTable.querySelector('tr:first-child');
		const headers = Array.from(headerRow.querySelectorAll('th.week-number')).map(th => th.textContent.trim());
		const rows = Array.from(weekTable.querySelectorAll('tr:not(:first-child)'));
		const markMap = new Map();
		rows.forEach((row, rIdx) => {
			const cells = row.querySelectorAll('td.week-mapping');
			headers.forEach((label, cIdx) => {
				const cell = cells[cIdx];
				if (!cell || !label || label === 'No weeks') return;
				const marked = cell.textContent.trim() === 'x' || cell.classList.contains('marked');
				if (marked) markMap.set(`${rIdx}|${label}`, true);
			});
		});
		return markMap;
	}

	// Function to sync week columns with TLA week numbers
	// skipMarkHandling: when true, don't capture/reapply marks (used during undo/redo)
	function syncWeekColumnsWithTLA(skipMarkHandling = false) {
		const tlaRows = document.querySelectorAll('#tlaTable tbody tr:not(#tla-placeholder)');
		const weekTable = document.querySelector('.assessment-mapping table.week');
		
		if (!weekTable) return;
		// Only capture existing marks if not in undo/redo mode
		const existingMarks = skipMarkHandling ? new Map() : captureWeekMarks(weekTable);
		
		// If no TLA rows, set to "No weeks" state
		if (tlaRows.length === 0) {
			const headerRow = weekTable.querySelector('tr:first-child');
			const allDataRows = weekTable.querySelectorAll('tr:not(:first-child)');
			const currentHeaders = Array.from(headerRow.querySelectorAll('th.week-number'));
			
			// Check if already in "No weeks" state
			const hasPlaceholder = currentHeaders.length === 1 && currentHeaders[0].textContent.trim() === 'No weeks';
			if (hasPlaceholder) return;
			
			// Remove all existing columns
			currentHeaders.forEach(th => th.remove());
			allDataRows.forEach(row => {
				const cells = row.querySelectorAll('td.week-mapping');
				cells.forEach(cell => cell.remove());
			});
			
			// Add "No weeks" placeholder
			const placeholderTh = document.createElement('th');
			placeholderTh.className = 'week-number';
			placeholderTh.style.cssText = 'border:none; border-bottom:1px solid #343a40; height:30px; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; color:#6c757d; font-weight:normal; text-align:center;';
			placeholderTh.textContent = 'No weeks';
			headerRow.appendChild(placeholderTh);
			
			// Add placeholder cells to all data rows
			allDataRows.forEach(function(row, index) {
				const placeholderTd = document.createElement('td');
				placeholderTd.className = 'week-mapping';
				// Match initial blade markup but add top border for rows after the first
				const borderTop = index > 0 ? 'border-top:1px solid #343a40;' : '';
				placeholderTd.style.cssText = `border:none; ${borderTop} height:30px; padding:0.2rem 0.5rem; background-color:#fff; height:30px;`;
				row.appendChild(placeholderTd);
			});
			
			return;
		}

		// Collect week labels from TLA rows, keeping ranges as-is and
		// removing single numbers that are covered by an existing range.
		// Examples:
		//  - ["1", "1-2"] → ["1-2"]
		//  - ["2", "3-4"] → ["2", "3-4"] (no merging to 2-4)
		function parseInterval(label){
			const raw = String(label || '').trim();
			if (!raw) return null;
			// Normalize different dash characters (en dash, em dash, etc.) to a plain hyphen
			const t = raw.replace(/[\u2012-\u2015]/g, '-');
			const mRange = /^\s*(\d+)\s*-\s*(\d+)\s*$/.exec(t);
			if (mRange){
				const a = parseInt(mRange[1], 10);
				const b = parseInt(mRange[2], 10);
				if (Number.isFinite(a) && Number.isFinite(b)) {
					const start = Math.min(a,b), end = Math.max(a,b);
					return { start, end, isRange: true };
				}
			}
			const mNum = /^\s*(\d+)\s*$/.exec(t);
			if (mNum){
				const n = parseInt(mNum[1], 10);
				if (Number.isFinite(n)) return { start: n, end: n, isRange: false };
			}
			return null; // non-numeric token
		}

		// Gather tokens in encounter order
		const ranges = [];
		const singles = [];
		const nonNumericOrdered = [];
		const seenRangeLabels = new Set();
		const seenSingleLabels = new Set();
		const seenNonNumeric = new Set();
		tlaRows.forEach(function(row){
			const wksInput = row.querySelector('.tla-wks input');
			const raw = (wksInput && wksInput.value) ? wksInput.value.trim() : '';
			if (!raw) return;
			raw.split(',').map(t => t.trim()).filter(Boolean).forEach(token => {
				const iv = parseInterval(token);
				if (iv && iv.isRange) {
					const lbl = iv.start === iv.end ? String(iv.start) : (iv.start + '-' + iv.end);
					if (!seenRangeLabels.has(lbl)) { ranges.push(iv); seenRangeLabels.add(lbl); }
				} else if (iv && !iv.isRange) {
					const lbl = String(iv.start);
					if (!seenSingleLabels.has(lbl)) { singles.push(iv); seenSingleLabels.add(lbl); }
				} else {
					if (!seenNonNumeric.has(token)) { nonNumericOrdered.push(token); seenNonNumeric.add(token); }
				}
			});
		});

		// Build final labels in ascending numeric order:
		//  - keep ranges as-is
		//  - drop single weeks that are contained inside any range
		//  - sort the remaining numeric tokens by their start week
		//  - then append any non-numeric tokens, in the order first seen
		const weekLabels = [];
		const pushLabel = (lbl) => { if (!weekLabels.includes(lbl)) weekLabels.push(lbl); };
		// Filter out singles that are covered by any numeric range
		const singlesNotCovered = singles.filter(function(s) {
			return !ranges.some(function(r) {
				return s.start >= r.start && s.start <= r.end;
			});
		});

		// Combine ranges and uncovered singles, then sort by start (and end as tie-breaker)
		const numericIntervals = ranges.concat(singlesNotCovered).sort(function(a, b) {
			if (a.start !== b.start) return a.start - b.start;
			return a.end - b.end;
		});

		numericIntervals.forEach(function(iv) {
			const lbl = iv.start === iv.end ? String(iv.start) : (iv.start + '-' + iv.end);
			pushLabel(lbl);
		});

		// Finally non-numeric tokens (keep original encounter order)
		for (const nn of nonNumericOrdered) pushLabel(nn);
		
		const headerRow = weekTable.querySelector('tr:first-child');
		const allDataRows = weekTable.querySelectorAll('tr:not(:first-child)');
		const currentHeaders = Array.from(headerRow.querySelectorAll('th.week-number'));
		
		// If no weeks, show "No weeks" placeholder
		if (weekLabels.length === 0) {
			// Check if placeholder already exists
			const hasPlaceholder = currentHeaders.length === 1 && currentHeaders[0].textContent.trim() === 'No weeks';
			if (hasPlaceholder) return;
			
			// Remove all existing columns
			currentHeaders.forEach(th => th.remove());
			allDataRows.forEach(row => {
				const cells = row.querySelectorAll('td.week-mapping');
				cells.forEach(cell => cell.remove());
			});
			
			// Add placeholder
			const placeholderTh = document.createElement('th');
			placeholderTh.className = 'week-number';
			placeholderTh.style.cssText = 'border:none; border-bottom:1px solid #343a40; height:30px; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; color:#6c757d; font-weight:normal; text-align:center;';
			placeholderTh.textContent = 'No weeks';
			headerRow.appendChild(placeholderTh);
			
			// Add placeholder cells to all data rows
			allDataRows.forEach(function(row, index) {
				const placeholderTd = document.createElement('td');
				placeholderTd.className = 'week-mapping';
				// Match initial blade markup but add top border for rows after the first
				const borderTop = index > 0 ? 'border-top:1px solid #343a40;' : '';
				placeholderTd.style.cssText = `border:none; ${borderTop} height:30px; padding:0.2rem 0.5rem; background-color:#fff; height:30px;`;
				row.appendChild(placeholderTd);
			});
			
			return;
		}
		
		// Check if we have a placeholder
		const hasPlaceholder = currentHeaders.length === 1 && currentHeaders[0].textContent.trim() === 'No weeks';
		
		// Get current header labels (excluding placeholder)
		const currentLabels = hasPlaceholder ? [] : currentHeaders.map(th => th.textContent.trim());
		
		// If current labels match collected labels, no need to update
		if (JSON.stringify(currentLabels) === JSON.stringify(weekLabels)) return;

		// Clear existing headers and cells
		if (hasPlaceholder) {
			currentHeaders[0].remove();
			allDataRows.forEach(row => {
				const cell = row.querySelector('td.week-mapping');
				if (cell) cell.remove();
			});
		} else {
			currentHeaders.forEach(th => th.remove());
			allDataRows.forEach(row => {
				const cells = row.querySelectorAll('td.week-mapping');
				cells.forEach(cell => cell.remove());
			});
		}

		// Add new week columns based on TLA week labels
		weekLabels.forEach(function(weekLabel, index) {
			// Add header
			const newTh = document.createElement('th');
			newTh.className = 'week-number';
			const borderLeft = index > 0 ? 'border-left:1px solid #343a40;' : '';
			newTh.style.cssText = `border:none; border-bottom:1px solid #343a40; ${borderLeft} height:30px; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; color:#000; font-weight:bold; text-align:center;`;
			newTh.textContent = weekLabel;
			headerRow.appendChild(newTh);

			// Add cells to all data rows
			allDataRows.forEach(function(row, rowIndex) {
				const newTd = document.createElement('td');
				newTd.className = 'week-mapping';
				const borderTop = rowIndex > 0 ? 'border-top:1px solid #343a40;' : '';
				newTd.style.cssText = `border:none; ${borderLeft} ${borderTop} height:30px; padding:0.2rem 0.5rem; background-color:#fff; cursor:pointer; text-align:center;`;
				row.appendChild(newTd);
				attachWeekCellClickHandler(newTd);
			});
		});

		// Re-apply marks, mapping prior labels to merged intervals (skip if undo/redo mode)
		if (!skipMarkHandling) {
			const parseNew = (lbl) => parseInterval(lbl);
			const newIntervals = weekLabels.map(parseNew);
			const updatedRows = Array.from(weekTable.querySelectorAll('tr:not(:first-child)'));
			// Build set of previous labels for iteration
			const prevLabelSet = new Set();
			existingMarks.forEach((val, key) => {
				const parts = String(key).split('|');
				if (parts.length === 2) prevLabelSet.add(parts[1]);
			});
			const prevIntervals = {};
			prevLabelSet.forEach(lbl => { prevIntervals[lbl] = parseInterval(lbl); });
			updatedRows.forEach((row, rIdx) => {
				const cells = row.querySelectorAll('td.week-mapping');
				// For each new column, determine if any previous mark maps into it
				weekLabels.forEach((newLbl, cIdx) => {
					let shouldMark = false;
					const newIv = newIntervals[cIdx];
					// Exact label match first
					if (existingMarks.has(`${rIdx}|${newLbl}`)) {
						shouldMark = true;
					} else {
						// Check containment/intersection for numeric labels
						if (newIv) {
							for (const prevLbl of prevLabelSet) {
								const key = `${rIdx}|${prevLbl}`;
								if (!existingMarks.has(key)) continue;
								const piv = prevIntervals[prevLbl];
								if (!piv) continue;
								// Intersects if ranges overlap
								const intersects = !(piv.end < newIv.start || piv.start > newIv.end);
								if (intersects) { shouldMark = true; break; }
							}
						}
					}
					if (shouldMark) {
						const cell = cells[cIdx];
						if (cell) {
							cell.textContent = 'x';
							cell.classList.add('marked');
							cell.style.color = '#000';
						}
					}
				});
			});
		}
	}

	// Expose syncWeekColumnsWithTLA to window for undo/redo system
	window.syncWeekColumnsWithTLA = syncWeekColumnsWithTLA;

	// Initial sync on load
	setTimeout(syncWeekColumnsWithTLA, 500);

	// Watch for changes in TLA table week inputs
	const tlaTable = document.querySelector('#tlaTable tbody');
	if (tlaTable) {
		// Use event delegation for input changes
		tlaTable.addEventListener('input', function(e) {
			if (e.target.matches('.tla-wks input')) {
				// Debounce the sync
				clearTimeout(window.tlaWeekSyncTimeout);
				window.tlaWeekSyncTimeout = setTimeout(syncWeekColumnsWithTLA, 300);
			}
		});

		// Watch for row additions/deletions
		const tlaObserver = new MutationObserver(function(mutations) {
			clearTimeout(window.tlaWeekSyncTimeout);
			window.tlaWeekSyncTimeout = setTimeout(syncWeekColumnsWithTLA, 300);
		});

		tlaObserver.observe(tlaTable, {
			childList: true
		});
	}

	if (addColumnBtn) {
		addColumnBtn.addEventListener('click', function() {
			// Target the week table specifically
			const weekTable = document.querySelector('.assessment-mapping table.week');
			if (!weekTable) return;

			const headerRow = weekTable.querySelector('tr:first-child');
			
			// Get current week headers
			const weekHeaders = Array.from(headerRow.querySelectorAll('th.week-number'));
			
			// Get all data rows
			const allDataRows = weekTable.querySelectorAll('tr:not(:first-child)');
			
			// Check if there's a placeholder "No weeks"
			const hasPlaceholder = weekHeaders.length === 1 && weekHeaders[0].textContent.trim() === 'No weeks';
			
			let newWeekNumber;
			if (hasPlaceholder) {
				// Remove placeholder header
				weekHeaders[0].remove();
				// Remove placeholder cells from all data rows
				allDataRows.forEach(function(row) {
					const placeholderCell = row.querySelector('td.week-mapping');
					if (placeholderCell) placeholderCell.remove();
				});
				newWeekNumber = 1;
			} else {
				// Get the next week number
				newWeekNumber = weekHeaders.length + 1;
			}

			// Add new week header (th)
			const newTh = document.createElement('th');
			newTh.className = 'week-number';
			// Add left border if this is not the first column
			const borderLeft = newWeekNumber > 1 ? 'border-left:1px solid #343a40;' : '';
			newTh.style.cssText = `border:none; border-bottom:1px solid #343a40; ${borderLeft} height:30px; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; color:#000; font-weight:bold; text-align:center;`;
			newTh.textContent = newWeekNumber;
			headerRow.appendChild(newTh);

			// Add new week mapping cell to all data rows
			allDataRows.forEach(function(row, rowIndex) {
				const newTd = document.createElement('td');
				newTd.className = 'week-mapping';
				// Check if it's the first row or not to determine border-top
				const borderTop = rowIndex > 0 ? 'border-top:1px solid #343a40;' : '';
				newTd.style.cssText = `border:none; ${borderLeft} ${borderTop} height:30px; padding:0.2rem 0.5rem; background-color:#fff; cursor:pointer; text-align:center;`;
				row.appendChild(newTd);
				attachWeekCellClickHandler(newTd);
			});
		});
	}

	if (removeColumnBtn) {
		removeColumnBtn.addEventListener('click', function() {
			// Target the week table specifically
			const weekTable = document.querySelector('.assessment-mapping table.week');
			if (!weekTable) return;

			const headerRow = weekTable.querySelector('tr:first-child');
			const dataRow = weekTable.querySelector('tr:last-child');
			
			const weekHeaders = Array.from(headerRow.querySelectorAll('th.week-number'));
			const allDataRows = weekTable.querySelectorAll('tr:not(:first-child)');

			// Remove last header first
			weekHeaders[weekHeaders.length - 1].remove();
			
			// Remove last cell from all data rows (including any 'x' marks)
			allDataRows.forEach(function(row) {
				const cells = row.querySelectorAll('td.week-mapping');
				if (cells.length > 0) {
					cells[cells.length - 1].remove();
				}
			});

			// If no columns left after removal, add placeholder
			if (weekHeaders.length === 1) {
				// Add placeholder header
				const placeholderTh = document.createElement('th');
				placeholderTh.className = 'week-number';
				placeholderTh.style.cssText = 'border:none; border-bottom:1px solid #343a40; height:30px; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; color:#6c757d; font-weight:normal; text-align:center;';
				placeholderTh.textContent = 'No weeks';
				headerRow.appendChild(placeholderTh);
				
				// Add empty placeholder cells to all data rows
				allDataRows.forEach(function(row, index) {
					const placeholderTd = document.createElement('td');
					placeholderTd.className = 'week-mapping';
					const borderTop = index > 0 ? 'border-top:1px solid #343a40;' : '';
					// Match initial blade markup for "No weeks" placeholder cell
					placeholderTd.style.cssText = `border:none; ${borderTop} height:30px; padding:0.2rem 0.5rem; background-color:#fff; height:30px;`;
					placeholderTd.textContent = '';
					row.appendChild(placeholderTd);
				});
			}
		});
	}

	// Week cell click handler - toggle 'x'
	function attachWeekCellClickHandler(cell) {
		cell.addEventListener('click', function() {
			// Check if this is a "No weeks" placeholder column
			const weekTable = this.closest('table.week');
			if (!weekTable) return;
			
			const headerRow = weekTable.querySelector('tr:first-child');
			const headers = Array.from(headerRow.querySelectorAll('th.week-number'));
			
			// If only one header and it says "No weeks", don't allow mapping
			if (headers.length === 1 && headers[0].textContent.trim() === 'No weeks') {
				return; // Do nothing, can't map on "No weeks"
			}
			
			// Normal toggle behavior
			if (this.textContent.trim() === 'x') {
				this.textContent = '';
				this.classList.remove('marked');
				this.style.color = '';
			} else {
				this.textContent = 'x';
				this.classList.add('marked');
				this.style.color = '#000';
			}
			
			// Trigger change event for undo/redo capture
			this.dispatchEvent(new Event('change', { bubbles: true }));
		});
	}

	// Attach handlers to existing week cells
	document.querySelectorAll('.assessment-mapping .week-mapping').forEach(function(cell) {
		attachWeekCellClickHandler(cell);
	});

	// Add Row Button
	const addRowBtn = document.getElementById('add-row');
	if (addRowBtn) {
		addRowBtn.addEventListener('click', function() {
			alert('Rows are automatically synced from Criteria for Assessment. Please add sub-rows there instead.');
			return;
			
			/* Original manual add logic disabled due to auto-sync
			const distributionTable = document.querySelector('.assessment-mapping table.distribution');
			const weekTable = document.querySelector('.assessment-mapping table.week');
			if (!distributionTable || !weekTable) return;

			// Add row to distribution table
			const distTr = document.createElement('tr');
			const distTd = document.createElement('td');
			distTd.className = 'task';
			distTd.style.cssText = 'border:none; border-top:1px solid #343a40; height:30px; padding:0; background-color:#fff;';
			
			const distInput = document.createElement('input');
			distInput.type = 'text';
			distInput.className = 'form-control form-control-sm distribution-input';
			distInput.placeholder = '-';
			distInput.style.cssText = 'width:100%; height:22px; border:none; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; text-align:center; box-sizing:border-box;';
			
			distTd.appendChild(distInput);
			distTr.appendChild(distTd);
			distributionTable.appendChild(distTr);

			// Add row to week table (matching all week columns)
			const weekTr = document.createElement('tr');
			const weekHeaders = weekTable.querySelectorAll('tr:first-child th.week-number');
			
			weekHeaders.forEach(function(header, index) {
				const weekTd = document.createElement('td');
				weekTd.className = 'week-mapping';
				const borderLeft = index > 0 ? 'border-left:1px solid #343a40;' : '';
				weekTd.style.cssText = `border:none; border-top:1px solid #343a40; ${borderLeft} height:30px; padding:0.2rem 0.5rem; background-color:#fff; cursor:pointer; text-align:center;`;
				weekTr.appendChild(weekTd);
				attachWeekCellClickHandler(weekTd);
			});
			
			weekTable.appendChild(weekTr);
			*/
		});
	}

	// Remove Row Button
	const removeRowBtn = document.getElementById('remove-row');
	if (removeRowBtn) {
		removeRowBtn.addEventListener('click', function() {
			alert('Rows are automatically synced from Criteria for Assessment. Please remove sub-rows there instead.');
			return;
			
			/* Original manual remove logic disabled due to auto-sync
			const distributionTable = document.querySelector('.assessment-mapping table.distribution');
			const weekTable = document.querySelector('.assessment-mapping table.week');
			if (!distributionTable || !weekTable) return;

			const distRows = distributionTable.querySelectorAll('tr');
			const weekRows = weekTable.querySelectorAll('tr');

			// Keep at least 2 rows (1 header + 1 data)
			if (distRows.length <= 2 || weekRows.length <= 2) {
				alert('Cannot remove the last data row');
				return;
			}

			// Remove last row from both tables
			distRows[distRows.length - 1].remove();
			weekRows[weekRows.length - 1].remove();
			*/
		});
	}

	// Global save function that can be called from toolbar
	window.saveAssessmentMappings = function() {
		return new Promise((resolve, reject) => {
			const distributionTable = document.querySelector('.assessment-mapping table.distribution');
			const weekTable = document.querySelector('.assessment-mapping table.week');
			if (!distributionTable || !weekTable) {
				resolve(); // No tables, nothing to save
				return;
			}

			// Get syllabus ID from URL or data attribute
			const syllabusId = document.querySelector('[data-syllabus-id]')?.dataset.syllabusId;
			if (!syllabusId) {
				reject(new Error('Syllabus ID not found'));
				return;
			}

			// Collect data from tables
			const mappings = [];
			const distRows = distributionTable.querySelectorAll('tr:not(:first-child)');
			const weekRows = weekTable.querySelectorAll('tr:not(:first-child)');
			const weekHeaders = weekTable.querySelectorAll('tr:first-child th.week-number');

			// Build week labels array (skip placeholder), preserving ranges and text labels
			const weekLabels = [];
			weekHeaders.forEach(function(header) {
				const label = header.textContent.trim();
				if (label !== 'No weeks') {
					weekLabels.push(label);
				}
			});

			// Iterate through each row
			distRows.forEach(function(distRow, index) {
				const distInput = distRow.querySelector('input.distribution-input');
				const name = distInput ? distInput.value.trim() : '';

				// Get week marks from corresponding week row
				const weekRow = weekRows[index];
				const weekCells = weekRow ? weekRow.querySelectorAll('td.week-mapping') : [];
				
				const weekMarks = {};
				weekCells.forEach(function(cell, cellIndex) {
					if (cellIndex < weekLabels.length) {
						const label = weekLabels[cellIndex];
						const txt = cell.textContent.trim();
						const marked = txt.toLowerCase() === 'x' || cell.classList.contains('marked') || cell.getAttribute('data-mark') === 'x' || /x/i.test(cell.innerHTML);
						weekMarks[label] = marked ? 'x' : '';
					}
				});

				// Only add if there's a name or any week marks
				if (name || Object.keys(weekMarks).length > 0) {
					mappings.push({
						name: name || null,
						week_marks: weekMarks,
						position: index
					});
				}
			});

			// If no mappings collected, send empty array to delete all existing mappings
			// This allows saving when there are no fields (clears all data)

			// Send AJAX request (even if mappings is empty to delete all)
			fetch(`/faculty/syllabi/${syllabusId}/assessment-mappings`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
				'Accept': 'application/json'
			},
			body: JSON.stringify({ mappings: mappings })
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				resolve(data);
			} else {
				reject(new Error(data.message || 'Failed to save assessment mappings'));
			}
		})
		.catch(error => {
			console.error('Error saving assessment mappings:', error);
			reject(error);
		});
	});
};

// Save Assessment Mappings Button (uses the global function)
const saveBtn = document.getElementById('save-assessment-mappings');
if (saveBtn) {
	saveBtn.addEventListener('click', function() {
		const btn = this;
		const originalText = btn.textContent;
		btn.disabled = true;
		btn.textContent = 'Saving...';

		window.saveAssessmentMappings()
			.then(data => {
				console.info('Assessment mappings saved successfully.');
				btn.disabled = false;
				btn.textContent = originalText;
			})
			.catch(error => {
				console.error('Failed to save assessment mappings:', error);
				btn.disabled = false;
				btn.textContent = originalText;
			});
	});
}	// Function to load existing assessment mappings
	function loadAssessmentMappings() {
		const syllabusId = document.querySelector('[data-syllabus-id]')?.dataset.syllabusId;
		if (!syllabusId) return;

		fetch(`/faculty/syllabi/${syllabusId}/assessment-mappings`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
			}
		})
		.then(response => response.json())
		.then(data => {
			if (data.success && data.mappings && data.mappings.length > 0) {
				renderMappings(data.mappings);
				// After mappings are rendered, ensure syllabus progress is recalculated
				try {
					if (typeof window.updateProgressBar === 'function') {
						window.updateProgressBar();
					}
				} catch (e) {
					console.warn('Failed to update syllabus progress after loading assessment mappings', e);
				}
			}
		})
		.catch(error => {
			console.error('Error loading assessment mappings:', error);
		});
	}

	// Function to render loaded mappings
	function renderMappings(mappings) {
		const distributionTable = document.querySelector('.assessment-mapping table.distribution');
		const weekTable = document.querySelector('.assessment-mapping table.week');
		if (!distributionTable || !weekTable) return;

		// Collect all unique week labels from mappings (preserve label strings such as "1-2")
		const allWeekLabels = [];
		const seenLabels = new Set();
		mappings.forEach(mapping => {
			if (mapping.week_marks) {
				const weekMarks = typeof mapping.week_marks === 'string'
					? JSON.parse(mapping.week_marks)
					: mapping.week_marks;
				Object.keys(weekMarks).forEach(label => {
					if (label && !seenLabels.has(label)) { seenLabels.add(label); allWeekLabels.push(label); }
				});
			}
		});

		// Clear existing rows (keep header)
		const distRows = distributionTable.querySelectorAll('tr:not(:first-child)');
		const weekRows = weekTable.querySelectorAll('tr:not(:first-child)');
		distRows.forEach(row => row.remove());
		weekRows.forEach(row => row.remove());

		// Clear existing week headers (keep placeholder if exists)
		const headerRow = weekTable.querySelector('tr:first-child');
		const headers = headerRow.querySelectorAll('th.week-number');
		headers.forEach(th => th.remove());

		// Define a natural sort for labels: use starting number if present
		function labelStartNumber(label) {
			const m = /^\s*(\d+)/.exec(label);
			return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
		}

		// Sort labels by starting number, keeping non-numeric at the end
		const sortedLabels = allWeekLabels.slice().sort((a, b) => {
			const na = labelStartNumber(a);
			const nb = labelStartNumber(b);
			if (na === nb) return a.localeCompare(b); // tie-breaker by text
			return na - nb;
		});

		// Add week columns
		if (sortedLabels.length > 0) {
			sortedLabels.forEach((label, index) => {
				const newTh = document.createElement('th');
				newTh.className = 'week-number';
				const borderLeft = index > 0 ? 'border-left:1px solid #343a40;' : '';
				newTh.style.cssText = `border:none; border-bottom:1px solid #343a40; ${borderLeft} height:30px; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; color:#000; font-weight:bold; text-align:center;`;
				newTh.textContent = label;
				headerRow.appendChild(newTh);
			});
		} else {
			// Add "No weeks" placeholder
			const placeholderTh = document.createElement('th');
			placeholderTh.className = 'week-number';
			placeholderTh.style.cssText = 'border:none; border-bottom:1px solid #343a40; height:30px; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; color:#6c757d; font-weight:normal; text-align:center;';
			placeholderTh.textContent = 'No weeks';
			headerRow.appendChild(placeholderTh);
		}

		// Add rows for each mapping
		mappings.forEach((mapping, rowIndex) => {
			// Add distribution row
			const distTr = document.createElement('tr');
			const distTd = document.createElement('td');
			distTd.className = 'task';
			const borderTop = rowIndex > 0 ? 'border-top:1px solid #343a40;' : '';
			distTd.style.cssText = `border:none; ${borderTop} height:30px; padding:0; background-color:#fff;`;
			
			const distInput = document.createElement('input');
			distInput.type = 'text';
			distInput.className = 'form-control form-control-sm distribution-input';
			distInput.placeholder = '-';
			distInput.value = mapping.name || '';
			distInput.style.cssText = 'width:100%; height:22px; border:none; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; text-align:center; box-sizing:border-box;';
			
			distTd.appendChild(distInput);
			distTr.appendChild(distTd);
			distributionTable.appendChild(distTr);

			// Add week row
			const weekTr = document.createElement('tr');
			const weekMarks = typeof mapping.week_marks === 'string'
				? JSON.parse(mapping.week_marks)
				: (mapping.week_marks || {});

			if (sortedLabels.length > 0) {
				sortedLabels.forEach((label, index) => {
					const weekTd = document.createElement('td');
					weekTd.className = 'week-mapping';
					const borderLeft = index > 0 ? 'border-left:1px solid #343a40;' : '';
					weekTd.style.cssText = `border:none; ${borderTop} ${borderLeft} height:30px; padding:0.2rem 0.5rem; background-color:#fff; cursor:pointer; text-align:center;`;
					
					// Check if this week is marked
					if (weekMarks[label] === 'x') {
						weekTd.textContent = 'x';
						weekTd.style.color = '#000';
						weekTd.classList.add('marked');
					}
					
					weekTr.appendChild(weekTd);
					attachWeekCellClickHandler(weekTd);
				});
			} else {
				// Add empty cell for placeholder
				const weekTd = document.createElement('td');
				weekTd.className = 'week-mapping';
				weekTd.style.cssText = `border:none; ${borderTop} height:30px; padding:0.2rem 0.5rem; background-color:#fff; text-align:center;`;
				weekTr.appendChild(weekTd);
			}

			weekTable.appendChild(weekTr);
		});
	}

	// Sync distribution names from Assessment Tasks and adjust row count
	function syncDistributionFromAT() {
		const atTable = document.querySelector('.at-map-outer .cis-table tbody');
		if (!atTable) {
			console.log('AT table not found');
			return;
		}
		
		const distributionTable = document.querySelector('.assessment-mapping table.distribution');
		const weekTable = document.querySelector('.assessment-mapping table.week');
		if (!distributionTable || !weekTable) {
			console.log('Distribution or week table not found');
			return;
		}
		
		// Get all sub-input textareas from Assessment Tasks (readonly, populated from Criteria)
		const atSubInputs = Array.from(atTable.querySelectorAll('.at-sub-row td:nth-child(2) textarea.sub-input'));
		
		// Get current distribution and week rows
		const distRows = Array.from(distributionTable.querySelectorAll('tr:not(:first-child)'));
		const weekRows = Array.from(weekTable.querySelectorAll('tr:not(:first-child)'));
		
		const targetRowCount = atSubInputs.length;
		const currentRowCount = distRows.length;
		
		console.log('Syncing distribution from AT:', targetRowCount, 'AT rows vs', currentRowCount, 'current rows');
		
		// Add rows if needed
		if (targetRowCount > currentRowCount) {
			const toAdd = targetRowCount - currentRowCount;
			console.log(`Adding ${toAdd} rows`);
			
			for (let i = 0; i < toAdd; i++) {
				// Get current week headers to match column count
				const weekHeaders = Array.from(weekTable.querySelectorAll('tr:first-child th.week-number'));
				const weekNumbers = [];
				weekHeaders.forEach(function(header) {
					const weekText = header.textContent.trim();
					if (weekText !== 'No weeks') {
						weekNumbers.push(parseInt(weekText));
					}
				});
				
				// Add distribution row
				const newDistRow = document.createElement('tr');
				newDistRow.innerHTML = `
					<td class="task" style="border:none; border-top:1px solid #343a40; height:30px; padding:0; background-color:#fff;">
						<input type="text" class="form-control form-control-sm distribution-input" placeholder="-" style="width:100%; height:22px; border:none; padding:0.2rem 0.5rem; font-family:Georgia,serif; font-size:13px; text-align:center; box-sizing:border-box;">
					</td>
				`;
				distributionTable.appendChild(newDistRow);
				
				// Add week row with cells matching current week columns
				const newWeekRow = document.createElement('tr');
				if (weekNumbers.length > 0) {
					weekNumbers.forEach(function(weekNum, index) {
						const newTd = document.createElement('td');
						newTd.className = 'week-mapping';
						const borderLeft = index > 0 ? 'border-left:1px solid #343a40;' : '';
						newTd.style.cssText = `border:none; border-top:1px solid #343a40; ${borderLeft} height:30px; padding:0.2rem 0.5rem; background-color:#fff; cursor:pointer; text-align:center;`;
						newWeekRow.appendChild(newTd);
						attachWeekCellClickHandler(newTd);
					});
				} else {
					// Add placeholder cell
					const newTd = document.createElement('td');
					newTd.className = 'week-mapping';
					newTd.style.cssText = 'border:none; border-top:1px solid #343a40; height:30px; padding:0.2rem 0.5rem; background-color:#fff; text-align:center;';
					newWeekRow.appendChild(newTd);
				}
				weekTable.appendChild(newWeekRow);
			}
		}
		// Remove rows if needed
		else if (targetRowCount < currentRowCount) {
			const toRemove = currentRowCount - targetRowCount;
			console.log(`Removing ${toRemove} rows`);
			
			for (let i = 0; i < toRemove; i++) {
				// Only remove data rows, not header rows
				const allDistRows = Array.from(distributionTable.querySelectorAll('tr'));
				const allWeekRows = Array.from(weekTable.querySelectorAll('tr'));
				
				// Keep at least header row (first row)
				if (allDistRows.length > 1 && allWeekRows.length > 1) {
					const lastDistRow = allDistRows[allDistRows.length - 1];
					const lastWeekRow = allWeekRows[allWeekRows.length - 1];
					
					// Make sure we're not removing header rows (check if they have .distribution-header or .week-number class)
					const isDistHeader = lastDistRow.querySelector('.distribution-header');
					const isWeekHeader = lastWeekRow.querySelector('.week-number');
					
					if (!isDistHeader && lastDistRow) lastDistRow.remove();
					if (!isWeekHeader && lastWeekRow) lastWeekRow.remove();
				}
			}
		}
		
		// Now sync values
		const distInputs = Array.from(distributionTable.querySelectorAll('input.distribution-input'));
		atSubInputs.forEach((atInput, index) => {
			if (index < distInputs.length) {
				const atValue = atInput.value.trim();
				distInputs[index].value = atValue;
				console.log(`Synced row ${index}: "${atValue}"`);
			}
		});

		// After rows are added back from Assessment Tasks (e.g., via Criteria undo),
		// try to restore any cached assessment marks using the shared undo/redo cache.
		// Only attempt this when we increased the number of rows; normal text edits
		// (same row count) should not reset marks.
		if (targetRowCount > currentRowCount && window.SVHistory &&
			typeof window.SVHistory.getLastValidAssessmentMarks === 'function' &&
			typeof window.SVHistory.applyAssessmentMarksInline === 'function') {
			try {
				const cachedMarks = window.SVHistory.getLastValidAssessmentMarks() || [];
				const hasValidMarks = cachedMarks.some(m => m && m.marked && m.weekLabel && m.weekLabel !== 'No weeks');
				if (hasValidMarks) {
					console.log('[SYNC FROM AT] Re-applying cached assessment marks after row add:', cachedMarks.length);
					// Suppress undo snapshotting while we programmatically restore marks
					const prevApplying = window.globalApplying;
					window.globalApplying = true;
					try {
						window.SVHistory.applyAssessmentMarksInline(cachedMarks);
					} finally {
						window.globalApplying = prevApplying;
					}
				}
			} catch (e) {
				console.warn('[SYNC FROM AT] Failed to re-apply cached assessment marks:', e);
			}
		}
	}
	
	// Watch for changes in Assessment Tasks table (which gets updated from Criteria)
	const atTableContainer = document.querySelector('.at-map-outer');
	if (atTableContainer) {
		// Initial sync
		setTimeout(syncDistributionFromAT, 1200);
		
		// Watch for any changes in the entire AT container
		const atObserver = new MutationObserver(function(mutations) {
			clearTimeout(window.atDistSyncTimeout);
			window.atDistSyncTimeout = setTimeout(syncDistributionFromAT, 200);
		});
		
		atObserver.observe(atTableContainer, {
			childList: true,
			subtree: true,
			characterData: true,
			attributes: false
		});
	}
	
	// Also watch Criteria container directly for faster response
	const criteriaContainer = document.getElementById('criteria-sections-container');
	if (criteriaContainer) {
		criteriaContainer.addEventListener('input', function(e) {
			if (e.target && e.target.classList.contains('sub-input')) {
				clearTimeout(window.criteriaToDistSyncTimeout);
				window.criteriaToDistSyncTimeout = setTimeout(syncDistributionFromAT, 400);
			}
		});
	}

	// Load mappings on page load (after TLA sync delay)
	setTimeout(loadAssessmentMappings, 1000);

	// Expose a global reload helper for AJAX refresh after saves
	try {
		window.reloadAssessmentMappings = function(){
			loadAssessmentMappings();
		};
	} catch(e) {}

	// Function to check if Assessment Method text overflows and hide if needed
	function checkAssessmentMethodOverflow() {
		const header = document.querySelector('.assessment-method-header');
		const text = document.querySelector('.assessment-method-text');
		
		if (!header || !text) return;
		
		const headerHeight = header.offsetHeight;
		const textWidth = text.scrollWidth; // Text width becomes height when rotated
		
		// If text is longer than available height, hide it completely
		if (textWidth > headerHeight) {
			text.style.visibility = 'hidden';
		} else {
			text.style.visibility = 'visible';
		}
	}

	// Check overflow initially and whenever rows change
	setTimeout(checkAssessmentMethodOverflow, 1500);
	
	// Re-check when distribution rows are added/removed
	const originalSyncDistribution = syncDistributionFromAT;
	syncDistributionFromAT = function() {
		originalSyncDistribution();
		setTimeout(checkAssessmentMethodOverflow, 300);
	};

	// Apply an AI-generated Assessment Schedule markdown table directly to the
	// Assessment Schedule Mapping UI. The markdown is expected to contain a
	// single table whose first column is "Assessment Method" or
	// "Assessment Task" and remaining columns are "Week X" labels, with
	// "x" marks indicating scheduled weeks.
	window.applyAssessmentScheduleFromAi = function(markdown){
		try {
			const text = String(markdown || '').trim();
			if (!text) return false;

			const distributionTable = document.querySelector('.assessment-mapping table.distribution');
			const weekTable = document.querySelector('.assessment-mapping table.week');
			if (!distributionTable || !weekTable) {
				console.warn('[AI] Assessment mapping tables not found');
				return false;
			}

			// If the week header is still in the initial "No weeks" placeholder
			// state, sync week columns once from the TLA weeks. Otherwise, keep the
			// existing column order exactly as-is.
			let headerRow = weekTable.querySelector('tr:first-child');
			let headerThs = headerRow ? Array.from(headerRow.querySelectorAll('th.week-number')) : [];
			const hasOnlyPlaceholder = headerThs.length === 1 && (headerThs[0].textContent || '').trim() === 'No weeks';
			if (hasOnlyPlaceholder && window.syncWeekColumnsWithTLA && typeof window.syncWeekColumnsWithTLA === 'function') {
				try { window.syncWeekColumnsWithTLA(true); } catch(e) { /* noop */ }
				// Re-read headers after sync, since the DOM has changed
				headerRow = weekTable.querySelector('tr:first-child');
				headerThs = headerRow ? Array.from(headerRow.querySelectorAll('th.week-number')) : [];
			}

			// Very small markdown table parser
			const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
			if (lines.length < 2) return false;

			function parseRow(line){
				let s = String(line || '').trim();
				if (!s.includes('|')) return [];
				if (s.startsWith('|')) s = s.slice(1);
				if (s.endsWith('|')) s = s.slice(0, -1);
				return s.split('|').map(c => c.trim());
			}

			const headerCells = parseRow(lines[0]);
			if (headerCells.length < 2) return false;
			// First column must clearly be an assessment label column
			if (!/assessment\s+(method|task)/i.test(headerCells[0] || '')) return false;

			// Skip optional divider row if present
			let dataStart = 1;
			if (lines.length > 1 && /^\|?\s*:?-{3,}/.test(lines[1])) {
				dataStart = 2;
			}

			// Map week headers (strip "Week" prefix)
			const weekHeadersFromAi = headerCells.slice(1).map(h => {
				const m = h.match(/week\s*(.+)/i);
				return m ? m[1].trim() : h.trim();
			});

			// Parse data rows into a simple map: name -> { weekLabel -> true }
			const aiRows = [];
			for (let i = dataStart; i < lines.length; i++) {
				const cells = parseRow(lines[i]);
				if (!cells.length) continue;
				const name = (cells[0] || '').trim();
				if (!name) continue;
				const marks = {};
				for (let j = 1; j < cells.length && j - 1 < weekHeadersFromAi.length; j++) {
					const v = (cells[j] || '').trim();
					if (/^x$/i.test(v)) {
						const lbl = weekHeadersFromAi[j - 1];
						if (lbl) marks[lbl] = true;
					}
				}
				aiRows.push({ name, marks });
			}
			if (!aiRows.length) return false;

			const aiByName = new Map();
			aiRows.forEach(r => {
				aiByName.set(r.name.toLowerCase(), r);
			});

			// Current week labels from the UI (skip placeholder)
			const uiWeekLabels = [];
			headerThs.forEach(th => {
				const lbl = (th.textContent || '').trim();
				if (lbl && lbl !== 'No weeks') uiWeekLabels.push(lbl);
			});
			if (!uiWeekLabels.length) {
				// Nothing to map against
				return false;
			}
			const uiWeekIndex = new Map();
			uiWeekLabels.forEach((lbl, idx) => uiWeekIndex.set(lbl, idx));

			// Apply marks row-by-row, matching by assessment name. Before
			// applying the new mapping, clear ALL existing "x" marks so the
			// schedule always reflects only the latest AI output.
			const distRows = Array.from(distributionTable.querySelectorAll('tr:not(:first-child)'));
			const weekRows = Array.from(weekTable.querySelectorAll('tr:not(:first-child)'));
			// Clear all marks first (full overwrite semantics)
			weekRows.forEach(function(weekRow){
				Array.from(weekRow.querySelectorAll('td.week-mapping')).forEach(function(cell){
					if (!cell) return;
					if (cell.textContent.trim() || cell.classList.contains('marked')) {
						cell.textContent = '';
						cell.classList.remove('marked');
						cell.style.color = '';
						try {
							cell.dispatchEvent(new Event('change', { bubbles: true }));
						} catch(e) { /* noop */ }
					}
				});
			});
			let anyChange = false;

			distRows.forEach((distRow, rowIdx) => {
				const input = distRow.querySelector('input.distribution-input');
				const name = (input && input.value ? input.value.trim() : '');
				if (!name) return;
				const aiRow = aiByName.get(name.toLowerCase()) || null;
				const weekRow = weekRows[rowIdx];
				if (!weekRow) return;
				const cells = Array.from(weekRow.querySelectorAll('td.week-mapping'));

				uiWeekLabels.forEach((lbl, colIdx) => {
					const cell = cells[colIdx];
					if (!cell) return;
					const shouldMark = !!(aiRow && aiRow.marks && aiRow.marks[lbl]);
					const currentlyMarked = cell.textContent.trim() === 'x';
					if (shouldMark === currentlyMarked) return;
					anyChange = true;
					if (shouldMark) {
						cell.textContent = 'x';
						cell.classList.add('marked');
						cell.style.color = '#000';
					} else {
						cell.textContent = '';
						cell.classList.remove('marked');
						cell.style.color = '';
					}
					// Fire change event so undo/redo and progress tracking can capture
					try {
						cell.dispatchEvent(new Event('change', { bubbles: true }));
					} catch(e) { /* noop */ }
				});
			});

			// At this point the AI schedule was parsed successfully and applied
			// against the existing grid. Even if no individual cell changed,
			// consider this a successful application so the caller does not
			// treat a "no-op" as a failure.
			return true;
		} catch (e) {
			console.warn('[AI] Failed to apply Assessment Schedule from AI', e);
			return false;
		}
	};

});
