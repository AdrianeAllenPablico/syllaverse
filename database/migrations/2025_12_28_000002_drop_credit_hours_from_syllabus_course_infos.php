<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('syllabus_course_infos') && Schema::hasColumn('syllabus_course_infos', 'credit_hours')) {
            Schema::table('syllabus_course_infos', function (Blueprint $table) {
                $table->dropColumn('credit_hours');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('syllabus_course_infos') && !Schema::hasColumn('syllabus_course_infos', 'credit_hours')) {
            Schema::table('syllabus_course_infos', function (Blueprint $table) {
                $table->unsignedTinyInteger('credit_hours')->nullable()->after('year_level');
            });
        }
    }
};
