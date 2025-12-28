// File: resources/js/faculty/syllabus-so.js
// Description: Handles AJAX save for Student Outcomes (SO) – Syllaverse

document.addEventListener('DOMContentLoaded', () => {
  const soForm = document.querySelector('#soForm');
  if (!soForm) return;

  soForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    try {
      await window.saveSo();
      alert('✅ SOs updated successfully.');
    } catch (error) {
      console.error('SO Save Error:', error);
      alert('❌ Failed to update SOs:\n' + (error.message || 'Unknown error'));
    }
  });

  // Save button handler
  const saveBtn = document.getElementById('save-so-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', async function() {
      const originalText = this.innerHTML;
      this.disabled = true;
      this.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Saving...';
      
      try {
        await window.saveSo();
        this.innerHTML = '<i class="bi bi-check-circle me-1"></i>Saved!';
        setTimeout(() => {
          this.innerHTML = originalText;
          this.disabled = false;
        }, 2000);
      } catch (error) {
        console.error('SO Save Error:', error);
        alert('❌ Failed to save SOs:\n' + (error.message || 'Unknown error'));
        this.innerHTML = originalText;
        this.disabled = false;
      }
    });
  }
  
  // Expose an async save function so top-level syllabus Save can await SO persistence
  window.saveSo = async function() {
    const form = document.querySelector('#soForm');
    if (!form) return { message: 'No SO form present' };
    
    const list = document.getElementById('syllabus-so-sortable');
    if (!list) return { message: 'No SO list present' };

    // Ensure codes reflect current order prior to serialization
    try { renumberSOs(); } catch (e) { /* noop */ }
    
    // Build sos array from table rows (exclude placeholder)
    const rows = Array.from(list.querySelectorAll('tr')).filter(r => r.id !== 'so-placeholder');
    const sos = rows.map((row, index) => {
      const dataId = row.getAttribute('data-id') || '';
      const id = (dataId && !dataId.startsWith('new-')) ? parseInt(dataId) : null;
      const codeInput = row.querySelector('input[name="code[]"]');
      const titleTextarea = row.querySelector('textarea[name="so_titles[]"]');
      const descTextarea = row.querySelector('textarea[name="sos[]"]');
      
      return {
        id: id,
        code: codeInput ? codeInput.value : `SO${index + 1}`,
        title: titleTextarea ? titleTextarea.value : '',
        description: descTextarea ? descTextarea.value : '',
        position: index + 1
      };
    });
    
    const url = form.getAttribute('action');
    const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    const headers = { 
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (tokenMeta) headers['X-CSRF-TOKEN'] = tokenMeta.getAttribute('content');
    
    try {
      const resp = await fetch(url, { 
        method: 'PUT', 
        headers, 
        body: JSON.stringify({ sos }), 
        credentials: 'same-origin' 
      });
      
      if (!resp.ok) {
        let data = null;
        try { data = await resp.json(); } catch (e) { /* noop */ }
        throw new Error((data && data.message) ? data.message : ('Server returned ' + resp.status));
      }
      
      const result = await resp.json().catch(() => ({ message: 'SOs saved' }));
      
      // Update data-id attributes for newly created SOs and show delete buttons
      if (result.ids && Array.isArray(result.ids)) {
        rows.forEach((row, index) => {
          if (result.ids[index]) {
            row.setAttribute('data-id', result.ids[index]);
            const deleteBtn = row.querySelector('.btn-delete-so');
            if (deleteBtn) deleteBtn.style.display = '';
          }
        });
      }

      // Mark textareas as unchanged baseline after successful save
      rows.forEach((row) => {
        row.querySelectorAll('textarea.autosize').forEach((ta) => {
          ta.setAttribute('data-original', ta.value || '');
        });
      });

      // Optionally hide a top-level unsaved indicator if present
      const unsaved = document.getElementById('unsaved-sos');
      if (unsaved) unsaved.classList.add('d-none');
      
      return result;
    } catch (err) {
      throw err;
    }
  };

  // Helper function to renumber SO codes
  function renumberSOs() {
    const list = document.getElementById('syllabus-so-sortable');
    if (!list) return;
    
    const rows = Array.from(list.querySelectorAll('tr')).filter(r => r.id !== 'so-placeholder');
    rows.forEach((row, index) => {
      const newCode = `SO${index + 1}`;
      const badge = row.querySelector('.so-badge');
      if (badge) badge.textContent = newCode;
      const codeInput = row.querySelector('input[name="code[]"]');
      if (codeInput) codeInput.value = newCode;
    });
  }

  // Add SO button handler
  const addBtn = document.getElementById('so-add-header');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const list = document.getElementById('syllabus-so-sortable');
      if (!list) return;
      
      // Remove placeholder if it exists
      const placeholder = document.getElementById('so-placeholder');
      if (placeholder) placeholder.remove();
      
      const currentCount = list.querySelectorAll('tr:not(#so-placeholder)').length;
      const newCode = `SO${currentCount + 1}`;
      
      const newRow = document.createElement('tr');
      newRow.setAttribute('data-id', `new-${Date.now()}`);
      newRow.innerHTML = `
        <td class="text-center align-middle">
          <div class="so-badge fw-semibold">${newCode}</div>
        </td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="flex-grow-1 w-100">
              <textarea
                name="so_titles[]"
                class="cis-textarea cis-field autosize"
                placeholder="Title"
                rows="1"
                style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font-weight:700;"
                required></textarea>
              <textarea
                name="sos[]"
                class="cis-textarea cis-field autosize"
                placeholder="Description"
                rows="1"
                style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;"
                required></textarea>
              <input type="hidden" name="code[]" value="${newCode}">
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger btn-delete-so ms-2" title="Delete SO"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      `;
      
      list.appendChild(newRow);
      
      // Initialize autosize for new textareas if initAutosize is available
      if (window.initAutosize) {
        newRow.querySelectorAll('textarea.autosize').forEach(ta => window.initAutosize(ta));
      }
    });
  }

  const soList = document.getElementById('syllabus-so-sortable');

  // Helper function to update SO positions after delete
  async function updateSoPositions() {
    const list = document.getElementById('syllabus-so-sortable');
    if (!list) return;
    
    const syllabusId = list.dataset.syllabusId;
    if (!syllabusId) return;
    
    const rows = Array.from(list.querySelectorAll('tr'));
    const positions = rows.map((row, index) => {
      const id = row.getAttribute('data-id');
      if (!id || id.startsWith('new-')) return null;
      return {
        id: parseInt(id),
        position: index + 1
      };
    }).filter(p => p !== null);
    
    if (positions.length === 0) return;
    
    try {
      const tokenMeta = document.querySelector('meta[name="csrf-token"]');
      const headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };
      if (tokenMeta) headers['X-CSRF-TOKEN'] = tokenMeta.getAttribute('content');
      
      const response = await fetch(`/faculty/syllabi/${syllabusId}/sos/reorder`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ positions: positions })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update SO positions');
      }
    } catch (error) {
      console.error('Error updating SO positions:', error);
    }
  }

  // Delete button handler (UI-only; no immediate backend delete)
  if (soList) {
    soList.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-so');
      if (!btn) return;

      const row = btn.closest('tr');
      if (!row) return;

      // Remove row from UI only
      row.remove();

      // If no rows remain, show placeholder; otherwise renumber
      const remainingRows = soList.querySelectorAll('tr:not(#so-placeholder)');
      if (remainingRows.length === 0) {
        const placeholder = document.createElement('tr');
        placeholder.id = 'so-placeholder';
        placeholder.innerHTML = `
          <td colspan="2" class="text-center text-muted py-4">
            <p class="mb-2">No SOs added yet.</p>
            <p class="mb-0"><small>Click the <strong>+</strong> button above to add an SO or <strong>Load Predefined</strong> to import SOs.</small></p>
          </td>
        `;
        soList.appendChild(placeholder);
      } else {
        renumberSOs();
      }
    });
  }

  // Load Predefined SOs functionality
  const loadPredefinedBtn = document.getElementById('so-load-predefined');
  const loadPredefinedModal = document.getElementById('loadPredefinedSosModal');
  const confirmLoadBtn = document.getElementById('confirmLoadPredefinedSos');
  const soSelectionList = document.getElementById('soSelectionList');
  const selectAllCheckbox = document.getElementById('selectAllSos');
  let availableSos = [];

  if (loadPredefinedBtn && loadPredefinedModal) {
    loadPredefinedBtn.addEventListener('click', async function() {
      const modal = new bootstrap.Modal(loadPredefinedModal);
      modal.show();

      // Get syllabus data to filter by course and department
      const syllabusId = soList?.dataset.syllabusId;
      const courseId = soList?.dataset.courseId;
      const departmentId = soList?.dataset.departmentId;
      
      // Load available SOs from master data filtered by department and course
      try {
        const params = new URLSearchParams();
        if (departmentId) params.append('department', departmentId);
        
        const response = await fetch(`/faculty/master-data/so/filter?${params.toString()}`, {
          headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (!response.ok) throw new Error('Failed to load SOs');

        const data = await response.json();
        availableSos = data.studentOutcomes || [];

        if (availableSos.length === 0) {
          soSelectionList.innerHTML = '<div class="text-center text-muted py-3"><p class="mb-0">No predefined SOs found.</p></div>';
          confirmLoadBtn.disabled = true;
          return;
        }

        // Render checkboxes
        soSelectionList.innerHTML = availableSos.map((so, index) => `
          <div class="form-check mb-2">
            <input class="form-check-input so-checkbox" type="checkbox" value="${so.id}" id="so_${so.id}" checked>
            <label class="form-check-label" for="so_${so.id}">
              <strong>SO${index + 1}:</strong> ${so.title || 'Untitled'}
              ${so.description ? `<br><small class="text-muted">${so.description.substring(0, 80)}${so.description.length > 80 ? '...' : ''}</small>` : ''}
            </label>
          </div>
        `).join('');

        confirmLoadBtn.disabled = false;

        // Re-initialize feather icons
        if (typeof feather !== 'undefined') feather.replace();

      } catch (error) {
        console.error('Error loading SOs:', error);
        soSelectionList.innerHTML = '<div class="text-center text-danger py-3"><p class="mb-0">Failed to load SOs</p></div>';
        confirmLoadBtn.disabled = true;
      }
    });
  }

  // Select All functionality
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('.so-checkbox');
      checkboxes.forEach(cb => cb.checked = this.checked);
    });
  }

  // Update Select All when individual checkboxes change
  if (soSelectionList) {
    soSelectionList.addEventListener('change', function(e) {
      if (e.target.classList.contains('so-checkbox')) {
        const checkboxes = document.querySelectorAll('.so-checkbox');
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;
      }
    });
  }

  // Confirm button in modal
  if (confirmLoadBtn && soList) {
    confirmLoadBtn.addEventListener('click', async function() {
      const syllabusId = soList.dataset.syllabusId;
      if (!syllabusId) {
        alert('Syllabus ID not found');
        return;
      }

      // Get selected SO IDs
      const selectedCheckboxes = document.querySelectorAll('.so-checkbox:checked');
      const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.value));

      if (selectedIds.length === 0) {
        alert('Please select at least one SO to load.');
        return;
      }

      try {
        confirmLoadBtn.disabled = true;
        const response = await fetch(`/faculty/syllabi/${syllabusId}/load-predefined-sos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
          },
          body: JSON.stringify({ so_ids: selectedIds })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to load predefined SOs');
        }

        const data = await response.json();

        if (!data.sos || data.sos.length === 0) {
          alert('No predefined SOs found for this course.');
          return;
        }

        // Clear existing rows
        while (soList.firstChild) {
          soList.removeChild(soList.firstChild);
        }

        // Add new rows from predefined SOs (UI-only; treat as new unsaved rows)
        data.sos.forEach((so, index) => {
          const code = `SO${index + 1}`;
          const newRow = document.createElement('tr');
          // Always assign a client-only id so Save creates them
          newRow.setAttribute('data-id', `new-${Date.now()}-${index}`);
          newRow.innerHTML = `
            <td class="text-center align-middle">
              <div class="so-badge fw-semibold">${code}</div>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="flex-grow-1 w-100">
                  <textarea
                    name="so_titles[]"
                    class="cis-textarea cis-field autosize"
                    placeholder="Title"
                    rows="1"
                    style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;font-weight:700;"
                    required>${so.title || ''}</textarea>
                  <textarea
                    name="sos[]"
                    class="cis-textarea cis-field autosize"
                    placeholder="Description"
                    rows="1"
                    style="display:block;width:100%;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;"
                    required>${so.description || ''}</textarea>
                  <input type="hidden" name="code[]" value="${code}">
                </div>
                <button type="button" class="btn btn-sm btn-outline-danger btn-delete-so ms-2" title="Delete SO"><i class="bi bi-trash"></i></button>
              </div>
            </td>
          `;
          soList.appendChild(newRow);

          // Initialize autosize for new textareas
          if (window.initAutosize) {
            newRow.querySelectorAll('textarea.autosize').forEach(ta => window.initAutosize(ta));
          }
        });

        // Close modal
        const modalInstance = bootstrap.Modal.getInstance(loadPredefinedModal);
        if (modalInstance) modalInstance.hide();

        // Success: no overlay; optional console log
        console.log(`Loaded ${data.sos.length} predefined SO(s) for preview. Click Save to persist.`);

      } catch (error) {
        console.error('Error loading predefined SOs:', error);
        alert(error.message || 'An error occurred while loading predefined SOs');
      } finally {
        confirmLoadBtn.disabled = false;
      }
    });
  }
});
