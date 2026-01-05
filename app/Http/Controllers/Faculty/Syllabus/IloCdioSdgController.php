<?php

// -------------------------------------------------------------------------------
// * File: app/Http/Controllers/Faculty/Syllabus/IloCdioSdgController.php
// * Description: Handles ILO-CDIO-SDG mapping save operations – Syllaverse
// -------------------------------------------------------------------------------
// 📜 Log:
// [2025-11-26] Initial creation – controller for ILO-CDIO-SDG mapping CRUD.
// -------------------------------------------------------------------------------

namespace App\Http\Controllers\Faculty\Syllabus;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Syllabus;
use App\Models\SyllabusIloCdioSdg;
use App\Models\SyllabusIloCdioColumn;
use App\Models\SyllabusIloCdioValue;
use App\Models\SyllabusIloSdgColumn;
use App\Models\SyllabusIloSdgValue;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class IloCdioSdgController extends Controller
{
    /**
     * Save ILO-CDIO-SDG mappings for a syllabus
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function save(Request $request)
    {
        try {
            // Validate incoming data - allow empty arrays for deletion
            $validated = $request->validate([
                'syllabus_id' => 'required|integer',
                'cdio_columns' => 'nullable|array',
                'cdio_columns.*' => 'nullable|string',
                'sdg_columns' => 'nullable|array',
                'sdg_columns.*' => 'nullable|string',
                'mappings' => 'nullable|array',
                'mappings.*.ilo_text' => 'nullable|string',
                'mappings.*.cdios' => 'nullable|array',
                'mappings.*.sdgs' => 'nullable|array',
                'mappings.*.position' => 'nullable|integer',
            ]);

            $syllabusId = $validated['syllabus_id'];

            // Find syllabus and verify ownership
            $syllabus = Syllabus::whereHas('facultyMembers', function($q) { $q->where('faculty_id', Auth::id())->where('can_edit', true); })->findOrFail($syllabusId);

            DB::beginTransaction();

            $mappings = $validated['mappings'] ?? [];

            // Normalized column label arrays (optional, like SO columns in ILO-SO-CPA)
            $cdioColumnLabels = $validated['cdio_columns'] ?? [];
            $sdgColumnLabels = $validated['sdg_columns'] ?? [];

            // --- Step 1: Rebuild CDIO/SDG column definitions for this syllabus ---
            // This will cascade-delete existing values via FK on *_values tables
            SyllabusIloCdioColumn::where('syllabus_id', $syllabusId)->delete();
            SyllabusIloSdgColumn::where('syllabus_id', $syllabusId)->delete();

            // Prefer explicit column label arrays when provided; fall back to
            // deriving max column counts from mapping keys for backward compatibility.
            $maxCdioCols = is_array($cdioColumnLabels) && count($cdioColumnLabels) > 0
                ? count($cdioColumnLabels)
                : 0;
            $maxSdgCols = is_array($sdgColumnLabels) && count($sdgColumnLabels) > 0
                ? count($sdgColumnLabels)
                : 0;

            if ($maxCdioCols === 0 || $maxSdgCols === 0) {
                foreach ($mappings as $mapping) {
                    $cdios = $mapping['cdios'] ?? [];
                    if (! empty($cdios)) {
                        $maxCdioCols = max($maxCdioCols, max(array_map('intval', array_keys($cdios))));
                    }

                    $sdgs = $mapping['sdgs'] ?? [];
                    if (! empty($sdgs)) {
                        $maxSdgCols = max($maxSdgCols, max(array_map('intval', array_keys($sdgs))));
                    }
                }
            }

            $cdioColumns = [];
            for ($i = 0; $i < $maxCdioCols; $i++) {
                $cdioColumns[$i] = SyllabusIloCdioColumn::create([
                    'syllabus_id' => $syllabusId,
                    'label' => $cdioColumnLabels[$i] ?? null,
                    'position' => $i,
                ]);
            }

            $sdgColumns = [];
            for ($i = 0; $i < $maxSdgCols; $i++) {
                $sdgColumns[$i] = SyllabusIloSdgColumn::create([
                    'syllabus_id' => $syllabusId,
                    'label' => $sdgColumnLabels[$i] ?? null,
                    'position' => $i,
                ]);
            }

            // --- Step 2: Reset base ILO-CDIO-SDG row mappings for this syllabus ---
            // This will also cascade-delete values via FK on *_values tables
            SyllabusIloCdioSdg::where('syllabus_id', $syllabusId)->delete();

            // Insert new mappings and normalized cell values
            if (!empty($mappings)) {
                foreach ($mappings as $mapping) {
                    $ilo = SyllabusIloCdioSdg::create([
                        'syllabus_id' => $syllabusId,
                        'ilo_text' => $mapping['ilo_text'] ?? '',
                        'position' => $mapping['position'] ?? 0,
                    ]);

                    $cdios = $mapping['cdios'] ?? [];
                    for ($i = 0; $i < $maxCdioCols; $i++) {
                        if (! isset($cdioColumns[$i])) {
                            continue;
                        }

                        $key = (string) ($i + 1);
                        if (! array_key_exists($key, $cdios)) {
                            continue;
                        }

                        $cellValue = $cdios[$key] ?? null;

                        // Always persist a row when the key exists, even if value is null,
                        // so blank cells are represented explicitly like in ILO-SO-CPA.
                        SyllabusIloCdioValue::create([
                            'ilo_id' => $ilo->id,
                            'cdio_column_id' => $cdioColumns[$i]->id,
                            'value' => $cellValue,
                        ]);
                    }

                    $sdgs = $mapping['sdgs'] ?? [];
                    for ($i = 0; $i < $maxSdgCols; $i++) {
                        if (! isset($sdgColumns[$i])) {
                            continue;
                        }

                        $key = (string) ($i + 1);
                        if (! array_key_exists($key, $sdgs)) {
                            continue;
                        }

                        $cellValue = $sdgs[$key] ?? null;

                        // Always persist a row when the key exists, even if value is null.
                        SyllabusIloSdgValue::create([
                            'ilo_id' => $ilo->id,
                            'sdg_column_id' => $sdgColumns[$i]->id,
                            'value' => $cellValue,
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'ILO-CDIO-SDG mappings saved successfully.',
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
            \Log::error('Failed to save ILO-CDIO-SDG mappings', [
                'syllabus_id' => $request->input('syllabus_id'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save ILO-CDIO-SDG mappings: ' . $e->getMessage(),
            ], 500);
        }
    }
}
