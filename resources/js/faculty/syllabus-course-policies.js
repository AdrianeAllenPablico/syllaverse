/**
 * File: resources/js/faculty/syllabus-course-policies.js
 * Description: JavaScript for Course Policies module - Load Predefined functionality
 */

document.addEventListener('DOMContentLoaded', function () {
  // Load Predefined Policy functionality
  const loadPolicyBtn = document.getElementById('policy-load-predefined');
  const loadPolicyModal = document.getElementById('loadPredefinedPolicyModal');
  const confirmLoadBtn = document.getElementById('confirmLoadPredefinedPolicy');
  const syllabusId = document.getElementById('syllabus-document')?.dataset?.syllabusId;

  let lastPreviewPolicies = null;

  if (loadPolicyBtn && loadPolicyModal && syllabusId) {
    loadPolicyBtn.addEventListener('click', async function() {
      const modal = new bootstrap.Modal(loadPolicyModal);
      const previewContent = document.getElementById('policyPreviewContent');
      
      // Show loading state
      previewContent.innerHTML = `
        <div class="text-center text-muted py-3">
          <i data-feather="loader" class="spinner"></i>
          <p class="mb-0 mt-2">Loading policies...</p>
        </div>
      `;
      feather.replace();
      
      modal.show();
      
      try {
        // Fetch all predefined policies from server
        const response = await fetch(`/faculty/syllabi/${syllabusId}/predefined-policies`);
        const data = await response.json();
        
        if (data.success && data.policies) {
          lastPreviewPolicies = data.policies;
          // Display all policies in a formatted view
          let html = '';
          const sectionLabels = {
            policy: 'Class Policy',
            exams: 'Missed Examinations',
            dishonesty: 'Academic Dishonesty',
            dropping: 'Dropping',
            other: 'Other Course Policies and Requirements'
          };
          
          Object.entries(data.policies).forEach(([section, content]) => {
            if (content) {
              html += `
                <div class="mb-3">
                  <div class="fw-semibold text-uppercase" style="font-size: 0.875rem; color: #6c757d; margin-bottom: 0.5rem;">${sectionLabels[section] || section}</div>
                  <div class="policy-content">${content}</div>
                </div>
              `;
            }
          });
          
          if (html) {
            previewContent.innerHTML = html;
          } else {
            previewContent.innerHTML = `
              <div class="text-center text-muted py-3">
                <i data-feather="alert-circle"></i>
                <p class="mb-0 mt-2">No predefined policies found.</p>
              </div>
            `;
            feather.replace();
          }
        } else {
          previewContent.innerHTML = `
            <div class="text-center text-muted py-3">
              <i data-feather="alert-circle"></i>
              <p class="mb-0 mt-2">${data.message || 'No predefined policies found.'}</p>
            </div>
          `;
          feather.replace();
        }
      } catch (error) {
        console.error('Error loading predefined policies:', error);
        previewContent.innerHTML = `
          <div class="text-center text-danger py-3">
            <i data-feather="alert-triangle"></i>
            <p class="mb-0 mt-2">Failed to load policies. Please try again.</p>
          </div>
        `;
        feather.replace();
      }
    });

    // Handle confirm load button
    if (confirmLoadBtn) {
      confirmLoadBtn.addEventListener('click', async function() {
        try {
          // Preview-only: populate fields without persisting
          // If we have last preview cached, use it; else refetch
          let policies = lastPreviewPolicies;
          if (!policies) {
            const response = await fetch(`/faculty/syllabi/${syllabusId}/predefined-policies`);
            const data = await response.json();
            if (data.success && data.policies) policies = data.policies; else throw new Error(data.message || 'No predefined policies found');
          }

          const textareas = document.querySelectorAll('.course-policies textarea[name="course_policies[]"]');
          const sections = ['policy', 'exams', 'dishonesty', 'dropping', 'other'];

          sections.forEach((section, index) => {
            if (textareas[index] && typeof policies[section] !== 'undefined') {
              textareas[index].value = policies[section] || '';
              // set baseline for unsaved tracking to loaded value
              textareas[index].setAttribute('data-original', policies[section] || '');
              if (window.autosize) { autosize.update(textareas[index]); }
              textareas[index].dispatchEvent(new Event('input', { bubbles: true }));
              textareas[index].dispatchEvent(new Event('change', { bubbles: true }));
            }
          });

          // Close modal (no DB writes)
          const instance = bootstrap.Modal.getInstance(loadPolicyModal);
          if (instance) instance.hide();
        } catch (error) {
          console.error('Error loading predefined policies for preview:', error);
          alert(error.message || 'Failed to load predefined policies');
        }
      });
    }
  }
  // Expose save for toolbar: persist course_policies[] via PUT
  window.saveCoursePolicies = async function() {
    try {
      const syllabusEl = document.getElementById('syllabus-document');
      const sid = syllabusEl?.dataset?.syllabusId;
      if (!sid) return false;
      const fields = Array.from(document.querySelectorAll('.course-policies textarea[name="course_policies[]"]'));
      const course_policies = fields.map(f => {
        const v = (f.value || '').trim();
        return v === '' ? null : v;
      });
      const res = await fetch(`/faculty/syllabi/${sid}/course-policies`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '' },
        body: JSON.stringify({ course_policies })
      });
      const data = await res.json().catch(()=>({ ok:false }));
      if (data && data.ok) {
        // mark fields as saved
        fields.forEach(f => f.setAttribute('data-original', f.value || ''));
        try { if (window.updateUnsavedCount) window.updateUnsavedCount(); } catch(e){}
        return true;
      }
      return false;
    } catch(e) {
      console.error('saveCoursePolicies error', e);
      return false;
    }
  };
});
