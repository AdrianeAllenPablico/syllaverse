import './bootstrap';
// Include syllabus ILO→SO→CPA mapping helper so window.saveIloSoCpa is exported
import './faculty/syllabus-ilo-so-cpa';
// Include syllabus ILO→IGA mapping helper so window.saveIloIga is exported
import './faculty/syllabus-ilo-iga';
// Include syllabus ILO→CDIO→SDG mapping helper so window.saveIloCdioSdg is exported
import './faculty/syllabus-ilo-cdio-sdg';

// Load core ILO behaviors (add/delete/renumber + autosize)
import './faculty/syllabus-ilo';

// Wire snapshot manager (ILO and mappings snapshots live here)
import './faculty/ai/snapshot';
// Undo/Redo utilities removed per request

// Optional: ILO insert utilities (emit insert:done events)
// Optional ILO insert utilities were removed; no-op import
