<?php

// -------------------------------------------------------------------------------
// * File: app/Http/Controllers/Faculty/Syllabus/IloIgaController.php
// * Description: Handles ILO-IGA mapping save operations – Syllaverse
// -------------------------------------------------------------------------------
// 📜 Log:
// [2025-11-25] Initial creation – controller for ILO-IGA mapping CRUD.
// -------------------------------------------------------------------------------

namespace App\Http\Controllers\Faculty\Syllabus;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Syllabus;
use App\Models\SyllabusIloIga;
use App\Models\SyllabusIloIgaColumn;
use App\Models\SyllabusIloIgaValue;
use App\Models\SyllabusIga;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class IloIgaController extends Controller
{
    /**
     * Save ILO-IGA mappings for a syllabus (new format from partial)
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveMapping(Request $request)
    {
        try {
            // Validate incoming data - allow empty arrays for deletion
            $validated = $request->validate([
                'syllabus_id' => 'required|integer',
                'iga_labels' => 'nullable|array',
                'iga_labels.*' => 'nullable|string',
                'mappings' => 'nullable|array',
                'mappings.*.ilo_text' => 'nullable|string',
                'mappings.*.igas' => 'nullable|array',
                'mappings.*.position' => 'nullable|integer',
            ]);

            $syllabusId = $validated['syllabus_id'];

            // Find syllabus and verify ownership
            $syllabus = Syllabus::whereHas('facultyMembers', function($q) { $q->where('faculty_id', Auth::id())->where('can_edit', true); })->findOrFail($syllabusId);

            DB::beginTransaction();

            // Note: We do NOT delete SyllabusIga records here.
            // The IGAs are managed separately in the IGA partial.
            // The mapping only manages ILO→IGA links.
            // Deleting IGA columns from the mapping does NOT delete the actual IGAs.

            // --- Step 1: Reset IGA column definitions for this syllabus ---
            // This will cascade-delete existing values via FK on syllabus_ilo_iga_values
            SyllabusIloIgaColumn::where('syllabus_id', $syllabusId)->delete();

            $igaLabels = $validated['iga_labels'] ?? [];

            foreach ($igaLabels as $index => $label) {
                SyllabusIloIgaColumn::create([
                    'syllabus_id' => $syllabusId,
                    'label' => $label,
                    'position' => $index,
                ]);
            }

            // --- Step 2: Reset ILO-IGA row mappings for this syllabus ---
            // This will also cascade-delete values via FK on syllabus_ilo_iga_values
            SyllabusIloIga::where('syllabus_id', $syllabusId)->delete();

            $mappings = $validated['mappings'] ?? [];

            if (!empty($mappings)) {
                foreach ($mappings as $mapping) {
                    // Persist base row (keep JSON igas for backward compatibility)
                    $ilo = SyllabusIloIga::create([
                        'syllabus_id' => $syllabusId,
                        'ilo_text' => $mapping['ilo_text'] ?? '',
                        'igas' => $mapping['igas'] ?? [],
                        'position' => $mapping['position'] ?? 0,
                    ]);

                    // Persist per-cell values into normalized table using column position
                    $igas = $mapping['igas'] ?? [];

                    foreach ($igaLabels as $position => $label) {
                        // Skip placeholder label "No IGA" just in case, allow empty labels
                        if ($label === 'No IGA') {
                            continue;
                        }

                        // Frontend currently keys IGA values by label
                        $cellValue = array_key_exists($label ?? '', $igas)
                            ? $igas[$label ?? '']
                            : null;

                        // Save even empty strings so explicit blanks are preserved
                        if ($cellValue === null) {
                            continue;
                        }

                        $column = SyllabusIloIgaColumn::where('syllabus_id', $syllabusId)
                            ->where('position', (int) $position)
                            ->first();

                        if ($column) {
                            SyllabusIloIgaValue::create([
                                'ilo_id' => $ilo->id,
                                'iga_column_id' => $column->id,
                                'value' => $cellValue,
                            ]);
                        }
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'ILO-IGA mappings saved successfully.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . implode(', ', $e->validator->errors()->all()),
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Syllabus not found or you do not have permission to edit it.',
            ], 404);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to save ILO-IGA mappings', [
                'syllabus_id' => $request->input('syllabus_id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save ILO-IGA mappings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Save ILO-IGA mappings for a syllabus
     * 
     * @param Request $request
     * @param int $syllabusId
     * @return \Illuminate\Http\JsonResponse
     */
    public function save(Request $request, $syllabusId)
    {
        // Find syllabus and verify ownership
        $syllabus = Syllabus::whereHas('facultyMembers', function($q) { $q->where('faculty_id', Auth::id())->where('can_edit', true); })->findOrFail($syllabusId);

        // Validate incoming data
        $request->validate([
            'iga_headers' => 'required|array',
            'iga_headers.*.code' => 'required|string',
            'iga_headers.*.title' => 'required|string',
            'iga_headers.*.description' => 'nullable|string',
            'iga_headers.*.position' => 'required|integer',
            'mappings' => 'required|array',
            'mappings.*.ilo_text' => 'nullable|string',
            'mappings.*.igas' => 'required|array',
            'mappings.*.position' => 'required|integer',
        ]);

        try {
            DB::beginTransaction();

            // Note: We do NOT delete SyllabusIga records here.
            // The IGAs are managed separately in the IGA partial.
            // The mapping only manages SyllabusIloIga records.
            // Deleting IGA columns from the mapping does NOT delete the actual IGAs.

            // Delete existing ILO-IGA mappings for this syllabus
            SyllabusIloIga::where('syllabus_id', $syllabusId)->delete();

            // Insert new mappings
            foreach ($request->mappings as $mapping) {
                SyllabusIloIga::create([
                    'syllabus_id' => $syllabusId,
                    'ilo_text' => $mapping['ilo_text'],
                    'igas' => $mapping['igas'],
                    'position' => $mapping['position'],
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'ILO-IGA mappings saved successfully.',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to save ILO-IGA mappings', [
                'syllabus_id' => $syllabusId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save ILO-IGA mappings: ' . $e->getMessage(),
            ], 500);
        }
    }
}
