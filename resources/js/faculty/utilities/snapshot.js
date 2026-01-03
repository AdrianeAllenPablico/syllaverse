/**
 * Syllabus Snapshot Functions
 * Captures current state of partials for undo/redo system
 */

function simpleHash(str){
  let h = 0;
  if (!str || str.length === 0) return '0';
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h |= 0;
  }
  return String(h >>> 0);
}

export function snapshotMissionVision(){
  const v = document.getElementById('vision-text')?.value ?? document.querySelector('[name="vision"]')?.value ?? '';
  const m = document.getElementById('mission-text')?.value ?? document.querySelector('[name="mission"]')?.value ?? '';
  const sanitizeVal = (val) => { const s = String(val ?? '').trim(); return s.length ? s : '-'; };
  const vText = sanitizeVal(v);
  const mText = sanitizeVal(m);
  
  const lines = [
    'PARTIAL_BEGIN:mission_vision',
    'TITLE: Institutional Vision & Mission',
    'COLUMNS: Label | Text',
    'ROW: Vision | ' + vText,
    'ROW: Mission | ' + mText,
    'PARTIAL_END:mission_vision'
  ];
  
  const text = lines.join('\n');
  const hash = simpleHash(text);
  
  return {
    partial: 'mission_vision',
    title: 'Institutional Vision & Mission',
    rows: [
      { label: 'Vision', text: vText },
      { label: 'Mission', text: mText }
    ],
    text,
    hash,
    ts: Date.now()
  };
}

export function snapshotCourseInfo(){
  const pairs = [
    ['Course Title', 'course_title'],
    ['Course Code', 'course_code'],
    ['Course Category', 'course_category'],
    ['Pre-requisite(s)', 'course_prerequisites'],
    ['Semester', 'semester'],
    ['Year Level', 'year_level'],
    ['Credit Hours', 'credit_hours_text'],
    ['Instructor Name', 'instructor_name'],
    ['Employee No.', 'employee_code'],
    ['Reference CMO', 'reference_cmo'],
    ['Instructor Designation', 'instructor_designation'],
    ['Date Prepared', 'date_prepared'],
    ['Instructor Email', 'instructor_email'],
    ['Revision No.', 'revision_no'],
    ['Period of Study', 'academic_year'],
    ['Revision Date', 'revision_date'],
    ['Course Rationale and Description', 'course_description'],
    ['TLA Strategies', 'tla_strategies'],
    ['Contact Hours', 'contact_hours']
  ];
  
  const sanitizeVal = (val) => { const s = String(val ?? '').trim(); return s.length ? s : '-'; };
  const rows = [];
  const lines = ['PARTIAL_BEGIN:course_info', 'TITLE: Course Information', 'COLUMNS: Field | Value'];
  
  for (const [label, name] of pairs) {
    const el = document.querySelector('[name="' + name + '"]');
    const val = sanitizeVal(el ? (el.value ?? el.textContent ?? '') : '');
    rows.push({ name, label, value: val });
    lines.push('ROW: ' + label + ' | ' + val);
  }
  
  lines.push('PARTIAL_END:course_info');
  const text = lines.join('\n');
  const hash = simpleHash(text);
  
  return {
    partial: 'course_info',
    title: 'Course Information',
    rows,
    text,
    hash,
    ts: Date.now()
  };
}

export function snapshotCriteria(){
  const container = document.getElementById('criteria-sections-container');
  const sections = [];
  const lines = ['PARTIAL_BEGIN:criteria', 'TITLE: Criteria for Assessment', 'COLUMNS: Category | Tasks & Percentages'];
  
  if (container) {
    container.querySelectorAll('.section').forEach((sectionEl, idx) => {
      const key = sectionEl.dataset.sectionKey || `section_${idx + 1}`;
      const heading = (sectionEl.querySelector('.section-head .category')?.value || '').trim();
      const tasks = [];
      const sectionLines = heading ? [heading] : [];
      
      sectionEl.querySelectorAll('.sub-list .sub-line').forEach(line => {
        const desc = (line.querySelector('.sub-input')?.value || '').trim();
        const pct = (line.querySelector('.sub-percent')?.value || '').trim();
        if (desc === '' && pct === '') return;
        tasks.push({ description: desc, percent: pct });
        sectionLines.push(`  ${desc} ${pct}`.trim());
      });
      
      sections.push({ key, heading, tasks });
      if (sectionLines.length > 0) {
        lines.push('ROW: ' + sectionLines.join(' | '));
      }
    });
  }
  
  lines.push('PARTIAL_END:criteria');
  const text = lines.join('\n');
  const hash = simpleHash(text);
  
  return {
    partial: 'criteria',
    title: 'Criteria for Assessment',
    sections,
    text,
    hash,
    ts: Date.now()
  };
}

export function snapshotIlo(){
  const list = document.getElementById('syllabus-ilo-sortable');
  const ilos = [];
  const lines = ['PARTIAL_BEGIN:ilo', 'TITLE: Intended Learning Outcomes', 'COLUMNS: Code | Description | HasContent'];
  
  if (list) {
    const rows = Array.from(list.querySelectorAll('tr')).filter(r => 
      r.querySelector('textarea[name="ilos[]"]') || r.querySelector('.ilo-badge')
    );
    
    rows.forEach((row, idx) => {
      const dataId = row.getAttribute('data-id') || '';
      const id = (/^\d+$/.test(dataId)) ? Number(dataId) : null;
      const code = row.querySelector('input[name="code[]"]')?.value || `ILO${idx + 1}`;
      const ta = row.querySelector('textarea[name="ilos[]"]');
      const description = ta ? (ta.value || '').trim() : '';
      const hasContent = description.length > 0;
      
      // Capture ALL rows, even empty ones, to support full undo/redo of row additions/deletions
      ilos.push({ id, code, description, position: idx + 1, hasContent });
      
      const contentMarker = hasContent ? 'yes' : 'no';
      const descDisplay = description || '-';
      lines.push(`ROW: ${code} | ${descDisplay} | ${contentMarker}`);
    });
  }
  
  lines.push('PARTIAL_END:ilo');
  const text = lines.join('\n');
  const hash = simpleHash(text);
  
  return {
    partial: 'ilo',
    title: 'Intended Learning Outcomes',
    ilos,
    text,
    hash,
    ts: Date.now()
  };
}

export function snapshotAssessmentTasks(){
  const tbody = document.getElementById('at-tbody');
  const iloList = document.getElementById('syllabus-ilo-sortable');
  const sections = [];
  const lines = ['PARTIAL_BEGIN:assessment_tasks', 'TITLE: Assessment Method and Distribution Map', 'COLUMNS: Section | MainCode | SubRow | Code | I/R/D | ILO Columns (by code) | C/P/A'];
  
  // Get current ILO codes for smart mapping (code-based instead of index-based)
  const iloCodeMap = {}; // Map: column_index -> ilo_code
  if (iloList) {
    const iloRows = Array.from(iloList.querySelectorAll('tr')).filter(r => 
      r.querySelector('textarea[name="ilos[]"]') || r.querySelector('.ilo-badge')
    );
    iloRows.forEach((row, idx) => {
      const code = row.querySelector('input[name="code[]"]')?.value || `ILO${idx + 1}`;
      iloCodeMap[idx] = code;
    });
  }
  
  if (tbody) {
    const allMainRows = tbody.querySelectorAll('.at-main-row');
    
    allMainRows.forEach((mainRow) => {
      const sectionNum = mainRow.dataset.section;
      const mainCells = Array.from(mainRow.children);
      
      // Get main row code value (1st column, index 0)
      const mainCodeTa = mainCells[0]?.querySelector('textarea');
      const mainCodeValue = mainCodeTa ? (mainCodeTa.value || '').trim() : '';
      
      const subRows = tbody.querySelectorAll(`.at-sub-row[data-section="${sectionNum}"]`);
      
      const sectionData = {
        section_num: sectionNum,
        main_code: mainCodeValue,
        sub_rows: []
      };
      
      subRows.forEach((subRow, subIndex) => {
        const cells = Array.from(subRow.children);
        
        // Get code value (1st column, index 0)
        const codeTa = cells[0]?.querySelector('textarea');
        const codeValue = codeTa ? (codeTa.value || '').trim() : '';
        
        // Skip task name column (2nd column, index 1) - it's auto-synced from Criteria
        
        // Get I/R/D value (3rd column, index 2)
        const irdTa = cells[2]?.querySelector('textarea');
        const irdValue = irdTa ? (irdTa.value || '').trim() : '';
        
        // Skip percent column (4th column, index 3) - it's auto-synced from Criteria
        
        // Get ILO columns with smart mapping by ILO code (starting from column 4, before last 3 C/P/A columns)
        const totalCols = cells.length;
        const iloStartIdx = 4;
        const iloEndIdx = totalCols - 3;
        const iloColumnsByCode = {}; // Map: ilo_code -> value
        
        for (let i = iloStartIdx; i < iloEndIdx; i++) {
          const ta = cells[i]?.querySelector('textarea');
          const val = ta ? (ta.value || '').trim() : '';
          const iloCode = iloCodeMap[i - iloStartIdx] || `ILO${i - iloStartIdx + 1}`;
          // Only store non-empty values to reduce snapshot size and improve performance
          if (val) {
            iloColumnsByCode[iloCode] = val;
          }
        }
        
        // Get C/P/A columns (last 3 columns)
        const cTa = cells[totalCols - 3]?.querySelector('textarea');
        const pTa = cells[totalCols - 2]?.querySelector('textarea');
        const aTa = cells[totalCols - 1]?.querySelector('textarea');
        
        const cValue = cTa ? (cTa.value || '').trim() : '';
        const pValue = pTa ? (pTa.value || '').trim() : '';
        const aValue = aTa ? (aTa.value || '').trim() : '';
        
        const subRowData = {
          sub_index: subIndex,
          code: codeValue,
          ird: irdValue,
          ilo_columns_by_code: iloColumnsByCode, // Smart map by ILO code instead of index
          cpa_columns: [cValue, pValue, aValue]
        };
        
        sectionData.sub_rows.push(subRowData);
        
        // Add to text representation
        const iloStr = Object.entries(iloColumnsByCode).map(([code, val]) => `${code}:${val}`).join(',') || '-';
        const cpaStr = `${cValue},${pValue},${aValue}`;
        lines.push(`ROW: ${sectionNum} | ${mainCodeValue} | ${subIndex} | ${codeValue} | ${irdValue} | ${iloStr} | ${cpaStr}`);
      });
      
      sections.push(sectionData);
    });
  }
  
  lines.push('PARTIAL_END:assessment_tasks');
  const text = lines.join('\n');
  const hash = simpleHash(text);
  
  return {
    partial: 'assessment_tasks',
    title: 'Assessment Method and Distribution Map',
    sections,
    iloCodeMap, // Include current ILO codes for reference
    text,
    hash,
    ts: Date.now()
  };
}

// Institutional Graduate Attributes
export function snapshotIga(){
  const list = document.getElementById('syllabus-iga-sortable');
  const rows = [];
  const lines = ['PARTIAL_BEGIN:iga', 'TITLE: Institutional Graduate Attributes', 'COLUMNS: Code | Title | Description | HasContent'];

  if (list) {
    const igaRows = Array.from(list.querySelectorAll('tr.iga-row'));
    igaRows.forEach((row, idx) => {
      const dataId = row.getAttribute('data-id') || '';
      const id = (/^\d+$/.test(dataId)) ? Number(dataId) : null;
      const codeInput = row.querySelector('input[name="code[]"]');
      const code = codeInput ? (codeInput.value || `IGA${idx + 1}`) : `IGA${idx + 1}`;
      const titleTa = row.querySelector('textarea[name="iga_titles[]"]');
      const descTa = row.querySelector('textarea[name="igas[]"]');
      const title = titleTa ? (titleTa.value || '').trim() : '';
      const description = descTa ? (descTa.value || '').trim() : '';
      const hasContent = !!(title || description);

      rows.push({ id, code, title, description, position: idx + 1, hasContent });
      const descDisplay = description || '-';
      lines.push(`ROW: ${code} | ${title || '-'} | ${descDisplay} | ${hasContent ? 'yes' : 'no'}`);
    });
  }

  lines.push('PARTIAL_END:iga');
  const text = lines.join('\n');
  const hash = simpleHash(text);

  return {
    partial: 'iga',
    title: 'Institutional Graduate Attributes',
    rows,
    text,
    hash,
    ts: Date.now()
  };
}

// CDIO Framework Skills
export function snapshotCdio(){
  const list = document.getElementById('syllabus-cdio-sortable');
  const rows = [];
  const lines = ['PARTIAL_BEGIN:cdio', 'TITLE: CDIO Framework Skills', 'COLUMNS: Code | Title | Description | HasContent'];

  if (list) {
    const cdioRows = Array.from(list.querySelectorAll('tr')).filter(r => r.id !== 'cdio-placeholder');
    cdioRows.forEach((row, idx) => {
      const dataId = row.getAttribute('data-id') || '';
      const id = (/^\d+$/.test(dataId)) ? Number(dataId) : null;
      const codeInput = row.querySelector('input[name="code[]"]');
      const code = codeInput ? (codeInput.value || `CDIO${idx + 1}`) : `CDIO${idx + 1}`;
      const titleTa = row.querySelector('textarea[name="cdio_titles[]"]');
      const descTa = row.querySelector('textarea[name="cdios[]"]');
      const title = titleTa ? (titleTa.value || '').trim() : '';
      const description = descTa ? (descTa.value || '').trim() : '';
      const hasContent = !!(title || description);

      rows.push({ id, code, title, description, position: idx + 1, hasContent });
      const descDisplay = description || '-';
      lines.push(`ROW: ${code} | ${title || '-'} | ${descDisplay} | ${hasContent ? 'yes' : 'no'}`);
    });
  }

  lines.push('PARTIAL_END:cdio');
  const text = lines.join('\n');
  const hash = simpleHash(text);

  return {
    partial: 'cdio',
    title: 'CDIO Framework Skills',
    rows,
    text,
    hash,
    ts: Date.now()
  };
}

// Sustainable Development Goals
export function snapshotSdg(){
  const list = document.getElementById('syllabus-sdg-sortable');
  const rows = [];
  const lines = ['PARTIAL_BEGIN:sdg', 'TITLE: Sustainable Development Goals', 'COLUMNS: Code | Title | Description | HasContent'];

  if (list) {
    const sdgRows = Array.from(list.querySelectorAll('tr')).filter(r => r.id !== 'sdg-placeholder');
    sdgRows.forEach((row, idx) => {
      const dataId = row.getAttribute('data-id') || '';
      const id = (/^\d+$/.test(dataId)) ? Number(dataId) : null;
      const codeInput = row.querySelector('input[name="code[]"]');
      const code = codeInput ? (codeInput.value || `SDG${idx + 1}`) : `SDG${idx + 1}`;
      const titleTa = row.querySelector('textarea[name="sdg_titles[]"]');
      const descTa = row.querySelector('textarea[name="sdgs[]"]');
      const title = titleTa ? (titleTa.value || '').trim() : '';
      const description = descTa ? (descTa.value || '').trim() : '';
      const hasContent = !!(title || description);

      rows.push({ id, code, title, description, position: idx + 1, hasContent });
      const descDisplay = description || '-';
      lines.push(`ROW: ${code} | ${title || '-'} | ${descDisplay} | ${hasContent ? 'yes' : 'no'}`);
    });
  }

  lines.push('PARTIAL_END:sdg');
  const text = lines.join('\n');
  const hash = simpleHash(text);

  return {
    partial: 'sdg',
    title: 'Sustainable Development Goals',
    rows,
    text,
    hash,
    ts: Date.now()
  };
}

// Course Policies
export function snapshotCoursePolicies(){
  const sections = ['policy', 'exams', 'dishonesty', 'dropping', 'other'];
  const labels = ['Class Policy', 'Missed Examinations', 'Academic Dishonesty', 'Dropping', 'Other Policies'];
  const textareas = document.querySelectorAll('.course-policies textarea[name="course_policies[]"]');
  const policies = {};
  const lines = ['PARTIAL_BEGIN:course_policies', 'TITLE: Course Policies', 'COLUMNS: Section | Content'];

  sections.forEach((section, idx) => {
    const ta = textareas[idx];
    const content = ta ? (ta.value || '').trim() : '';
    policies[section] = content;
    const display = content || '-';
    lines.push(`ROW: ${labels[idx]} | ${display}`);
  });

  lines.push('PARTIAL_END:course_policies');
  const text = lines.join('\n');
  const hash = simpleHash(text);

  return {
    partial: 'course_policies',
    title: 'Course Policies',
    policies,
    text,
    hash,
    ts: Date.now()
  };
}

// Student Outcomes
export function snapshotSo(){
  const list = document.getElementById('syllabus-so-sortable');
  const rows = [];
  const lines = ['PARTIAL_BEGIN:so', 'TITLE: Student Outcomes', 'COLUMNS: Code | Title | Description | HasContent'];

  if (list) {
    const soRows = Array.from(list.querySelectorAll('tr')).filter(r => r.id !== 'so-placeholder');
    soRows.forEach((row, idx) => {
      const dataId = row.getAttribute('data-id') || '';
      const id = (/^\d+$/.test(dataId)) ? Number(dataId) : null;
      const codeInput = row.querySelector('input[name="code[]"]');
      const code = codeInput ? (codeInput.value || `SO${idx + 1}`) : `SO${idx + 1}`;
      const titleTa = row.querySelector('textarea[name="so_titles[]"]');
      const descTa = row.querySelector('textarea[name="sos[]"]');
      const title = titleTa ? (titleTa.value || '').trim() : '';
      const description = descTa ? (descTa.value || '').trim() : '';
      const hasContent = !!(title || description);

      rows.push({ id, code, title, description, position: idx + 1, hasContent });
      const descDisplay = description || '-';
      lines.push(`ROW: ${code} | ${title || '-'} | ${descDisplay} | ${hasContent ? 'yes' : 'no'}`);
    });
  }

  lines.push('PARTIAL_END:so');
  const text = lines.join('\n');
  const hash = simpleHash(text);

  return {
    partial: 'so',
    title: 'Student Outcomes',
    rows,
    text,
    hash,
    ts: Date.now()
  };
}

// Global window exposure for debugging/inspection (optional)
if (typeof window !== 'undefined') {
  window.SVSnapshot = {
    snapshotMissionVision,
    snapshotCourseInfo,
    snapshotCriteria,
    snapshotIlo,
    snapshotAssessmentTasks,
    snapshotIga,
    snapshotSo,
    snapshotCdio,
    snapshotSdg,
    snapshotCoursePolicies
  };
  // Also expose directly on window for easy access
  window.snapshotMissionVision = snapshotMissionVision;
  window.snapshotCourseInfo = snapshotCourseInfo;
  window.snapshotCriteria = snapshotCriteria;
  window.snapshotIlo = snapshotIlo;
  window.snapshotAssessmentTasks = snapshotAssessmentTasks;
  window.snapshotIga = snapshotIga;
  window.snapshotSo = snapshotSo;
  window.snapshotCdio = snapshotCdio;
  window.snapshotSdg = snapshotSdg;
  window.snapshotCoursePolicies = snapshotCoursePolicies;
}
