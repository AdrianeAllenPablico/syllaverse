<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Create categories table
        if (!Schema::hasTable('syllabus_criteria_categories')) {
            Schema::create('syllabus_criteria_categories', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('syllabus_id');
                $table->string('category')->nullable();
                $table->unsignedInteger('position')->default(0);
                $table->timestamps();
                $table->index(['syllabus_id']);
            });
        }

        // Create tasks table
        if (!Schema::hasTable('syllabus_criteria_tasks')) {
            Schema::create('syllabus_criteria_tasks', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('syllabus_id');
                $table->unsignedBigInteger('category_id');
                $table->string('task')->nullable();
                $table->string('percent')->nullable();
                $table->timestamps();
                $table->index(['syllabus_id']);
                $table->index(['category_id']);
            });
        }

        // Migrate data from legacy syllabus_criteria if exists
        if (Schema::hasTable('syllabus_criteria')) {
            try {
                $rows = DB::table('syllabus_criteria')->orderBy('position')->get();
                foreach ($rows as $row) {
                    $categoryId = DB::table('syllabus_criteria_categories')->insertGetId([
                        'syllabus_id' => $row->syllabus_id,
                        'category' => $row->heading ?? $row->section ?? null,
                        'position' => $row->position ?? 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);

                    $values = [];
                    if (is_array($row->value)) {
                        $values = $row->value;
                    } else {
                        $decoded = json_decode($row->value ?? '[]', true);
                        $values = is_array($decoded) ? $decoded : [];
                    }

                    foreach ($values as $val) {
                        $desc = is_array($val) ? ($val['description'] ?? '') : (string) $val;
                        $pct  = is_array($val) ? ($val['percent'] ?? '') : '';
                        if (trim((string)$desc) === '' && trim((string)$pct) === '') {
                            continue;
                        }
                        DB::table('syllabus_criteria_tasks')->insert([
                            'syllabus_id' => $row->syllabus_id,
                            'category_id' => $categoryId,
                            'task' => $desc,
                            'percent' => $pct,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            } catch (\Throwable $e) {
                // If migration of data fails, proceed without halting
            }
            // Drop legacy table
            Schema::dropIfExists('syllabus_criteria');
        }
    }

    public function down(): void
    {
        // Attempt to reverse by dropping new tables. Legacy data won't be restored.
        Schema::dropIfExists('syllabus_criteria_tasks');
        Schema::dropIfExists('syllabus_criteria_categories');
    }
};
