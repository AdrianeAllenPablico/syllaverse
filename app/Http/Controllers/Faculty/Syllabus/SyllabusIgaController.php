<?php

// -------------------------------------------------------------------------------
// * File: app/Http/Controllers/Faculty/Syllabus/SyllabusIgaController.php
// * Description: Handles CRUD and ordering for master IGA items used in syllabi – Syllaverse
// -------------------------------------------------------------------------------

namespace App\Http\Controllers\Faculty\Syllabus;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SyllabusIga;
use Illuminate\Support\Facades\Auth;

class SyllabusIgaController extends Controller
{
    // Batch update IGAs (accepts array of {id, code, description, position})
    public function update(Request $request, $syllabusId)
    {
        // This endpoint is used by the frontend to persist the current list/order of IGAs.
        $request->validate([
            'igas' => 'nullable|array', // allow empty or omitted igas collection
            'igas.*.id' => 'nullable|integer|exists:syllabus_igas,id',
            'igas.*.code' => 'required|string',
            'igas.*.title' => 'nullable|string|max:255',
            'igas.*.description' => 'nullable|string|max:2000',
            'igas.*.position' => 'required|integer',
        ]);

        $payload = $request->input('igas', []);

        // If client intentionally sends no IGAs, treat as clearing the list
        if (empty($payload)) {
            SyllabusIga::where('syllabus_id', $syllabusId)->delete();
            return response()->json(['success' => true, 'message' => 'IGAs cleared.', 'ids' => []]);
        }

        $incomingIds = collect($payload)->pluck('id')->filter();
        $existingIds = SyllabusIga::where('syllabus_id', $syllabusId)->pluck('id');

        // delete removed per-syllabus IGAs
        $toDelete = $existingIds->diff($incomingIds);
        if ($toDelete->isNotEmpty()) {
            SyllabusIga::whereIn('id', $toDelete)->delete();
        }

        $createdIds = [];
        \DB::transaction(function() use (&$createdIds, $syllabusId, $payload) {
            foreach ($payload as $igaData) {
                $attrs = [
                    'syllabus_id' => $syllabusId,
                    'code' => $igaData['code'] ?? null,
                    'title' => $igaData['title'] ?? '',
                    'description' => $igaData['description'] ?? '',
                    'position' => $igaData['position'] ?? 0,
                ];

                if (!empty($igaData['id'])) {
                    SyllabusIga::where('id', $igaData['id'])->update($attrs);
                    $createdIds[] = (int)$igaData['id'];
                } else {
                    $new = SyllabusIga::create($attrs);
                    if ($new) $createdIds[] = $new->id;
                }
            }
        });

        return response()->json(['success' => true, 'message' => 'IGAs updated successfully.', 'ids' => $createdIds]);
    }

    // Delete one IGA
    public function destroy($id)
    {
    $m = SyllabusIga::findOrFail($id);
    $m->delete();
        return response()->json(['message' => 'IGA deleted.']);
    }

    // Optional reorder endpoint (accepts positions array)
    public function reorder(Request $request)
    {
        $request->validate([
            'positions' => 'required|array',
            'positions.*.id' => 'required|integer|exists:syllabus_igas,id',
            'positions.*.code' => 'required|string',
            'positions.*.position' => 'required|integer',
        ]);

        foreach ($request->positions as $item) {
            SyllabusIga::where('id', $item['id'])->update(['code' => $item['code'], 'position' => $item['position']]);
        }

        return response()->json(['message' => 'IGA order updated successfully.']);
    }

    // 📥 Load predefined IGAs from master data (UI-only preview; no DB writes)
    public function loadPredefinedIgas(Request $request, $syllabusId)
    {
        $syllabus = \App\Models\Syllabus::whereHas('facultyMembers', function($q) { $q->where('faculty_id', Auth::id())->where('can_edit', true); })->findOrFail($syllabusId);

        // Validate that iga_ids is provided and is an array
        $request->validate([
            'iga_ids' => 'required|array',
            'iga_ids.*' => 'integer|exists:igas,id',
        ]);

        $selectedIds = $request->iga_ids;

        if (empty($selectedIds)) {
            return response()->json(['message' => 'Please select at least one IGA to load.'], 400);
        }

        // Get selected predefined IGAs from master data
        $predefinedIgas = \App\Models\Iga::whereIn('id', $selectedIds)->orderBy('id')->get();

        if ($predefinedIgas->isEmpty()) {
            return response()->json(['message' => 'No predefined IGAs found.'], 404);
        }

        // Build a non-persistent preview payload for the UI
        $previewIgas = [];
        foreach ($predefinedIgas as $index => $predef) {
            $previewIgas[] = [
                // Use a computed code for display; actual persistence happens on Save
                'code' => 'IGA' . ($index + 1),
                'title' => $predef->title,
                'description' => $predef->description,
                'position' => $index + 1,
                // Provide origin info for potential client-side needs (not used for DB ops)
                'origin' => 'master',
                'origin_id' => $predef->id,
            ];
        }

        return response()->json([
            'message' => count($previewIgas) . ' IGA' . (count($previewIgas) !== 1 ? 's' : '') . ' loaded for preview. Save to persist.',
            'igas' => $previewIgas,
        ]);
    }
}
