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
  const lines = ['PARTIAL_BEGIN:ilo', 'TITLE: Intended Learning Outcomes', 'COLUMNS: Code | Description'];
  
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
      
      ilos.push({ id, code, description, position: idx + 1 });
      
      if (description) {
        lines.push(`ROW: ${code} | ${description}`);
      }
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

// Global window exposure for debugging/inspection (optional)
if (typeof window !== 'undefined') {
  window.SVSnapshot = {
    snapshotMissionVision,
    snapshotCourseInfo,
    snapshotCriteria,
    snapshotIlo
  };
}
