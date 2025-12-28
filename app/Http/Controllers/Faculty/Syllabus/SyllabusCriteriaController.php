<?php

namespace App\Http\Controllers\Faculty\Syllabus;

use App\Http\Controllers\Controller;
use App\Models\Syllabus;
use App\Models\SyllabusCriteriaCategory;
use App\Models\SyllabusCriteriaTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SyllabusCriteriaController extends Controller
{
    /**
     * Normalize and persist criteria rows coming from the main syllabus request payload.
     */
    public function syncFromRequest(Request $request, Syllabus $syllabus): void
    {
        if (! $request->has('criteria_data')) {
            return;
        }

        $raw = $request->input('criteria_data');
        Log::info('SyllabusCriteriaController::syncFromRequest raw', [
            'type' => gettype($raw),
            'criteria_data' => $raw,
            'syllabus_id' => $syllabus->id,
        ]);

        $sections = $this->normalizePayload($raw);

        $this->replaceSections($sections, $syllabus);
    }

    /**
     * Directly persist an array of already structured criteria sections.
     */
    public function sync(array $sections, Syllabus $syllabus): void
    {
        $normalized = $this->normalizeSections($sections);
        $this->replaceSections($normalized, $syllabus);
    }

    /**
     * Normalize an arbitrary payload (array or JSON string) into structured sections.
     */
    protected function normalizePayload($payload): array
    {
        $data = $payload;

        if (! is_array($data)) {
            $decoded = json_decode((string) $payload, true);
            $data = is_array($decoded) ? $decoded : [];
            Log::info('SyllabusCriteriaController::normalizePayload decoded', [
                'syllabus_payload_type' => gettype($payload),
                'decoded_type' => gettype($data),
            ]);
        }

        return $this->normalizeSections($data);
    }

    /**
     * Sanitize the criteria sections and keep only meaningful rows.
     */
    protected function normalizeSections(array $sections): array
    {
        $normalized = [];

        foreach ($sections as $index => $section) {
            if (! is_array($section)) {
                continue;
            }

            if ($this->isMarkedDeleted($section)) {
                Log::info('SyllabusCriteriaController::normalizeSections skipping deleted section', [
                    'index' => $index,
                    'section' => $section,
                ]);
                continue;
            }

            $key = $section['key'] ?? null;
            $heading = $section['heading'] ?? null;
            $values = $section['value'] ?? [];

            $entries = [];
            if (is_array($values)) {
                foreach ($values as $value) {
                    if (! is_array($value)) {
                        continue;
                    }

                    if ($this->isMarkedDeleted($value)) {
                        Log::debug('SyllabusCriteriaController::normalizeSections skipping deleted entry', [
                            'section_key' => $key,
                            'entry' => $value,
                        ]);
                        continue;
                    }

                    $description = trim((string) ($value['description'] ?? ''));
                    $percent = trim((string) ($value['percent'] ?? ''));

                    if ($description === '' && $percent === '') {
                        continue;
                    }

                    $entries[] = [
                        'description' => $description,
                        'percent' => $percent,
                    ];
                }
            }

            if ($key || $heading || count($entries) > 0) {
                $normalized[] = [
                    'key' => $key ?? ('section_' . $index),
                    'heading' => $heading,
                    'values' => $entries,
                ];
            }
        }

        return $normalized;
    }

    /**
     * Determine whether the given payload fragment is flagged for deletion.
     */
    protected function isMarkedDeleted(array $payload): bool
    {
        foreach (['deleted', '_deleted', '_destroy', 'remove', 'removed'] as $flag) {
            if (!array_key_exists($flag, $payload)) {
                continue;
            }

            $value = $payload[$flag];
            if ($value === true || $value === 1 || $value === '1' || $value === 'true') {
                return true;
            }
        }

        return false;
    }

    /**
     * Delete existing criteria rows and replace them with the provided sections.
     */
    protected function replaceSections(array $sections, Syllabus $syllabus): void
    {
        // Delete existing categories and tasks for this syllabus
        try {
            // Eager delete tasks then categories
            $existingCats = SyllabusCriteriaCategory::where('syllabus_id', $syllabus->id)->get();
            foreach ($existingCats as $cat) {
                SyllabusCriteriaTask::where('category_id', $cat->id)->delete();
            }
            SyllabusCriteriaCategory::where('syllabus_id', $syllabus->id)->delete();
        } catch (\Throwable $e) {
            Log::warning('SyllabusCriteriaController::replaceSections cleanup failed', [
                'syllabus_id' => $syllabus->id,
                'error' => $e->getMessage(),
            ]);
        }

        // Create new categories and tasks from sections
        foreach ($sections as $position => $section) {
            try {
                $category = SyllabusCriteriaCategory::create([
                    'syllabus_id' => $syllabus->id,
                    'category' => $section['heading'] ?? null,
                    'position' => $position,
                ]);

                $entries = $section['values'] ?? [];
                if (is_array($entries)) {
                    foreach ($entries as $entryIndex => $entry) {
                        try {
                            $desc = trim((string) ($entry['description'] ?? ''));
                            $pct  = trim((string) ($entry['percent'] ?? ''));
                            if ($desc === '' && $pct === '') { continue; }
                            SyllabusCriteriaTask::create([
                                'syllabus_id' => $syllabus->id,
                                'category_id' => $category->id,
                                'task' => $desc,
                                'percent' => $pct,
                                'position' => $entryIndex,
                            ]);
                        } catch (\Throwable $inner) {
                            Log::debug('SyllabusCriteriaController::replaceSections failed to create task', [
                                'syllabus_id' => $syllabus->id,
                                'error' => $inner->getMessage(),
                                'category_id' => $category->id ?? null,
                                'entry' => $entry,
                            ]);
                        }
                    }
                }
            } catch (\Throwable $e) {
                Log::warning('SyllabusCriteriaController::replaceSections failed to create category', [
                    'syllabus_id' => $syllabus->id,
                    'error' => $e->getMessage(),
                    'position' => $position,
                    'section' => $section,
                ]);
            }
        }
    }
}
