<?php

namespace App\Http\Controllers\Faculty\Syllabus;

use App\Http\Controllers\Controller;
use App\Models\SyllabusIloSoCpa;
use App\Models\SyllabusIloSoCpaColumn;
use App\Models\SyllabusIloSoCpaValue;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class IloSoCpaController extends Controller
{
    /**
     * Save ILO-SO-CPA mapping for a syllabus
     */
    public function save(Request $request)
    {
        try {
            $request->validate([
                'syllabus_id' => 'required|exists:syllabi,id',
                'so_columns' => 'nullable|array',
                'so_columns.*' => 'string',
                'mappings' => 'array', // Allow empty array to delete all
                'mappings.*.ilo_text' => 'nullable|string',
                'mappings.*.sos' => 'nullable|array', // sos will have position as keys
                'mappings.*.c' => 'nullable|string',
                'mappings.*.p' => 'nullable|string',
                'mappings.*.a' => 'nullable|string',
                'mappings.*.position' => 'required|integer',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('ILO-SO-CPA validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed: ' . json_encode($e->errors())
            ], 422);
        }

        try {
            DB::beginTransaction();

            $syllabusId = $request->syllabus_id;

            // Step 1: Delete existing SO columns and their values (cascade will handle values)
            SyllabusIloSoCpaColumn::where('syllabus_id', $syllabusId)->delete();

            // Step 2: Save SO column labels
            $soColumns = $request->so_columns ?? [];
            foreach ($soColumns as $index => $label) {
                SyllabusIloSoCpaColumn::create([
                    'syllabus_id' => $syllabusId,
                    'label' => $label,
                    'position' => $index,
                ]);
            }

            // Step 3: Delete existing ILO rows and their values (cascade will handle values)
            SyllabusIloSoCpa::where('syllabus_id', $syllabusId)->delete();

            // Step 4: Save ILO rows and their SO values
            foreach ($request->mappings as $mapping) {
                $ilo = SyllabusIloSoCpa::create([
                    'syllabus_id' => $syllabusId,
                    'ilo_text' => $mapping['ilo_text'],
                    'c' => $mapping['c'] ?? null,
                    'p' => $mapping['p'] ?? null,
                    'a' => $mapping['a'] ?? null,
                    'position' => $mapping['position'],
                ]);

                // Save SO values using column position as key
                $sos = $mapping['sos'] ?? [];
                foreach ($sos as $soIndex => $soValue) {
                    $soColumn = SyllabusIloSoCpaColumn::where('syllabus_id', $syllabusId)
                        ->where('position', (int)$soIndex)
                        ->first();

                    if ($soColumn) {
                        SyllabusIloSoCpaValue::create([
                            'ilo_id' => $ilo->id,
                            'so_column_id' => $soColumn->id,
                            'value' => $soValue,
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'ILO-SO-CPA mapping saved successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error saving ILO-SO-CPA mapping: ' . $e->getMessage(), [
                'exception' => $e,
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save mapping: ' . $e->getMessage()
            ], 500);
        }
    }
}
