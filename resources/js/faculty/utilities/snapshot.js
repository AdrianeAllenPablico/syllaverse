(function(){
  function sanitize(val){
    if (val == null) return '-';
    const s = String(val).trim();
    return s.length ? s : '-';
  }
  function readEl(id, name){
    const byId = document.getElementById(id);
    if (byId) return byId.value || '';
    const byName = document.querySelector('[name="'+name+'"]');
    return byName ? (byName.value || '') : '';
  }
  function buildMissionVisionText(){
    const v = sanitize(readEl('vision-text','vision'));
    const m = sanitize(readEl('mission-text','mission'));
    const lines = [];
    lines.push('PARTIAL_BEGIN:mission_vision');
    lines.push('TITLE: Institutional Vision & Mission');
    lines.push('COLUMNS: Label | Text');
    lines.push('ROW: Vision | ' + v);
    lines.push('ROW: Mission | ' + m);
    lines.push('PARTIAL_END:mission_vision');
    return lines.join('\n');
  }
  function simpleHash(str){
    let h = 0, i, chr;
    if (!str || str.length === 0) return '0';
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      h = ((h << 5) - h) + chr;
      h |= 0;
    }
    return String(h >>> 0);
  }
  function snapshotMissionVision(){
    const text = buildMissionVisionText();
    return {
      partial: 'mission_vision',
      title: 'Institutional Vision & Mission',
      rows: [
        { label: 'Vision', text: sanitize(readEl('vision-text','vision')) },
        { label: 'Mission', text: sanitize(readEl('mission-text','mission')) }
      ],
      text,
      hash: simpleHash(text),
      ts: Date.now()
    };
  }
  // Course Info snapshot: capture key fields with names and labels
  function snapshotCourseInfo(){
    const fields = [
      ['Course Title','course_title'],
      ['Course Code','course_code'],
      ['Course Category','course_category'],
      ['Pre-requisite(s)','course_prerequisites'],
      ['Semester','semester'],
      ['Year Level','year_level'],
      ['Credit Hours','credit_hours_text'],
      ['Instructor Name','instructor_name'],
      ['Employee No.','employee_code'],
      ['Reference CMO','reference_cmo'],
      ['Instructor Designation','instructor_designation'],
      ['Date Prepared','date_prepared'],
      ['Instructor Email','instructor_email'],
      ['Revision No.','revision_no'],
      ['Period of Study','academic_year'],
      ['Revision Date','revision_date'],
      ['Course Rationale and Description','course_description'],
      ['Contact Hours','contact_hours']
    ];
    const lines = [];
    const rows = [];
    lines.push('PARTIAL_BEGIN:course_info');
    lines.push('TITLE: Course Information');
    lines.push('COLUMNS: Field | Value');
    for (const [label, name] of fields){
      const val = sanitize(readEl('', name));
      rows.push({ name, label, value: val });
      lines.push('ROW: ' + label + ' | ' + val);
    }
    lines.push('PARTIAL_END:course_info');
    const text = lines.join('\n');
    return { partial: 'course_info', title: 'Course Information', rows, text, hash: simpleHash(text), ts: Date.now() };
  }
  try { window.SVSnapshot = window.SVSnapshot || {}; window.SVSnapshot.snapshotMissionVision = snapshotMissionVision; } catch(e) {}
  try { window.SVSnapshot = window.SVSnapshot || {}; window.SVSnapshot.snapshotCourseInfo = snapshotCourseInfo; } catch(e) {}
  try { if (typeof module !== 'undefined') { module.exports = { snapshotMissionVision }; } } catch(e) {}
  try { if (typeof module !== 'undefined') { module.exports = { ...(module.exports||{}), snapshotCourseInfo }; } } catch(e) {}
  try { if (typeof window !== 'undefined') { window.snapshotMissionVision = snapshotMissionVision; } } catch(e) {}
  try { if (typeof window !== 'undefined') { window.snapshotCourseInfo = snapshotCourseInfo; } } catch(e) {}
})();

export function snapshotMissionVision(){
  const v = document.getElementById('vision-text')?.value ?? document.querySelector('[name="vision"]')?.value ?? '';
  const m = document.getElementById('mission-text')?.value ?? document.querySelector('[name="mission"]')?.value ?? '';
  const sanitizeVal = (val) => { const s = String(val ?? '').trim(); return s.length ? s : '-'; };
  const lines = [
    'PARTIAL_BEGIN:mission_vision',
    'TITLE: Institutional Vision & Mission',
    'COLUMNS: Label | Text',
    'ROW: Vision | ' + sanitizeVal(v),
    'ROW: Mission | ' + sanitizeVal(m),
    'PARTIAL_END:mission_vision'
  ];
  const text = lines.join('\n');
  const hash = (() => { let h=0; for (let i=0;i<text.length;i++){ h=((h<<5)-h)+text.charCodeAt(i); h|=0; } return String(h>>>0); })();
  return { partial:'mission_vision', title:'Institutional Vision & Mission', rows:[{label:'Vision',text:sanitizeVal(v)},{label:'Mission',text:sanitizeVal(m)}], text, hash, ts: Date.now() };
}

export function snapshotCourseInfo(){
  const pairs = [
    ['Course Title','course_title'],
    ['Course Code','course_code'],
    ['Course Category','course_category'],
    ['Pre-requisite(s)','course_prerequisites'],
    ['Semester','semester'],
    ['Year Level','year_level'],
    ['Credit Hours','credit_hours_text'],
    ['Instructor Name','instructor_name'],
    ['Employee No.','employee_code'],
    ['Reference CMO','reference_cmo'],
    ['Instructor Designation','instructor_designation'],
    ['Date Prepared','date_prepared'],
    ['Instructor Email','instructor_email'],
    ['Revision No.','revision_no'],
    ['Period of Study','academic_year'],
    ['Revision Date','revision_date'],
    ['Course Rationale and Description','course_description'],
    ['Contact Hours','contact_hours']
  ];
  const sanitizeVal = (val) => { const s = String(val ?? '').trim(); return s.length ? s : '-'; };
  const rows = [];
  const lines = [ 'PARTIAL_BEGIN:course_info', 'TITLE: Course Information', 'COLUMNS: Field | Value' ];
  for (const [label, name] of pairs){
    const el = document.querySelector('[name="'+name+'"]');
    const val = sanitizeVal(el ? (el.value ?? el.textContent ?? '') : '');
    rows.push({ name, label, value: val });
    lines.push('ROW: ' + label + ' | ' + val);
  }
  lines.push('PARTIAL_END:course_info');
  const text = lines.join('\n');
  const hash = (() => { let h=0; for (let i=0;i<text.length;i++){ h=((h<<5)-h)+text.charCodeAt(i); h|=0; } return String(h>>>0); })();
  return { partial:'course_info', title:'Course Information', rows, text, hash, ts: Date.now() };
}
