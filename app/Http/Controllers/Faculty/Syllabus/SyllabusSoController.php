<?php

// -------------------------------------------------------------------------------
// * File: app/Http/Controllers/Faculty/Syllabus/SyllabusSoController.php
// * Description: Handles AJAX-based updates, reordering, and deletion of syllabus-specific SOs – Syllaverse
// -------------------------------------------------------------------------------
// 📜 Log:
// [2025-07-29] Added reorder() and destroy() methods; update() now saves code[] and position.
// -------------------------------------------------------------------------------


namespace App\Http\Controllers\Faculty\Syllabus;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Syllabus;
use App\Models\SyllabusSo;

class SyllabusSoController extends Controller
{
    // Batch update SOs (accepts array of {id, code, title, description, position})
    public function update(Request $request, $syllabusId)
    {
        $request->validate([
            'sos' => 'nullable|array',
            'sos.*.id' => 'nullable|integer|exists:syllabus_sos,id',
            'sos.*.code' => 'required|string',
            'sos.*.title' => 'nullable|string|max:255',
            'sos.*.description' => 'nullable|string|max:2000',
            'sos.*.position' => 'required|integer',
        ]);

        $payload = $request->input('sos', []);

        // If client intentionally sends no SOs, treat as clearing the list
        if (empty($payload)) {
            SyllabusSo::where('syllabus_id', $syllabusId)->delete();
            return response()->json(['success' => true, 'message' => 'SOs cleared.', 'ids' => []]);
        }

        $incomingIds = collect($payload)->pluck('id')->filter();
        $existingIds = SyllabusSo::where('syllabus_id', $syllabusId)->pluck('id');

        // Delete removed SOs
        $toDelete = $existingIds->diff($incomingIds);
        if ($toDelete->isNotEmpty()) {
            SyllabusSo::whereIn('id', $toDelete)->delete();
        }

        $createdIds = [];
        \DB::transaction(function() use (&$createdIds, $syllabusId, $payload) {
            foreach ($payload as $soData) {
                $attrs = [
                    'syllabus_id' => $syllabusId,
                    'code' => $soData['code'] ?? null,
                    'title' => $soData['title'] ?? '',
                    'description' => $soData['description'] ?? '',
                    'position' => $soData['position'] ?? 0,
                ];

                if (!empty($soData['id'])) {
                    SyllabusSo::where('id', $soData['id'])->update($attrs);
                    $createdIds[] = (int)$soData['id'];
                } else {
                    $new = SyllabusSo::create($attrs);
                    if ($new) $createdIds[] = $new->id;
                }
            }
        });

        return response()->json(['success' => true, 'message' => 'SOs updated successfully.', 'ids' => $createdIds]);
    }

    // ✅ Save reordered SOs via drag-and-drop
    public function reorder(Request $request, $syllabusId)
{
    $request->validate([
        'positions' => 'required|array',
        'positions.*.id' => 'required|integer|exists:syllabus_sos,id',
        'positions.*.position' => 'required|integer',
    ]);

    foreach ($request->positions as $item) {
        $code = 'SO' . $item['position']; // 👈 auto-regenerate code from position
        SyllabusSo::where('id', $item['id'])
            ->where('syllabus_id', $syllabusId)
            ->update([
                'position' => $item['position'],
                'code' => $code,
            ]);
    }

    return response()->json(['message' => 'SO order and codes saved successfully.']);
}


    // ✅ Delete a single SO via AJAX
    public function destroy($id)
    {
        $so = SyllabusSo::findOrFail($id);

        // Only allow delete if owned by current faculty
        if (!$so->syllabus->canBeEditedBy(Auth::id())) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $so->delete();

        return response()->json(['message' => 'SO deleted successfully.']);
    }

    // 📥 Load predefined SOs from master data (UI-only preview; no DB writes)
    public function loadPredefinedSos(Request $request, $syllabus)
    {
        // Authorization check - faculty only
        $syllabus = Syllabus::whereHas('facultyMembers', function($q) { $q->where('faculty_id', Auth::id())->where('can_edit', true); })->findOrFail($syllabus);

        // Validate that so_ids is provided and is an array
        $request->validate([
            'so_ids' => 'required|array',
            'so_ids.*' => 'integer|exists:student_outcomes,id',
        ]);

        $selectedIds = $request->so_ids;

        if (empty($selectedIds)) {
            return response()->json(['message' => 'Please select at least one SO to load.'], 400);
        }

        // Get selected predefined SOs from master data
        $predefinedSos = \App\Models\StudentOutcome::whereIn('id', $selectedIds)->orderBy('id')->get();

        if ($predefinedSos->isEmpty()) {
            return response()->json(['message' => 'No predefined SOs found.'], 404);
        }

        // Build a non-persistent preview payload for the UI
        $previewSos = [];
        foreach ($predefinedSos as $index => $predef) {
            $previewSos[] = [
                'code' => 'SO' . ($index + 1),
                'title' => $predef->title,
                'description' => $predef->description,
                'position' => $index + 1,
                'origin' => 'master',
                'origin_id' => $predef->id,
            ];
        }

        return response()->json([
            'message' => count($previewSos) . ' SO' . (count($previewSos) !== 1 ? 's' : '') . ' loaded for preview. Save to persist.',
            'sos' => $previewSos,
        ]);
    }

    protected function getSyllabusForAction($syllabusId)
    {
        return Syllabus::whereHas('facultyMembers', function($q) { $q->where('faculty_id', Auth::id())->where('can_edit', true); })->findOrFail($syllabusId);
    }
}

