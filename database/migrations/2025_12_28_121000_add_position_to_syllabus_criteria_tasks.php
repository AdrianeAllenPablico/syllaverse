<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('syllabus_criteria_tasks') && !Schema::hasColumn('syllabus_criteria_tasks', 'position')) {
            Schema::table('syllabus_criteria_tasks', function (Blueprint $table) {
                $table->unsignedInteger('position')->default(0)->after('percent');
                $table->index(['position']);
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('syllabus_criteria_tasks') && Schema::hasColumn('syllabus_criteria_tasks', 'position')) {
            Schema::table('syllabus_criteria_tasks', function (Blueprint $table) {
                $table->dropColumn('position');
            });
        }
    }
};
