<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('syllabus_ilo_cdio_sdg')) {
            Schema::table('syllabus_ilo_cdio_sdg', function (Blueprint $table) {
                // Drop legacy JSON columns now that values live in normalized tables
                if (Schema::hasColumn('syllabus_ilo_cdio_sdg', 'cdios')) {
                    $table->dropColumn('cdios');
                }
                if (Schema::hasColumn('syllabus_ilo_cdio_sdg', 'sdgs')) {
                    $table->dropColumn('sdgs');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('syllabus_ilo_cdio_sdg')) {
            Schema::table('syllabus_ilo_cdio_sdg', function (Blueprint $table) {
                if (! Schema::hasColumn('syllabus_ilo_cdio_sdg', 'cdios')) {
                    $table->json('cdios')->nullable()->after('ilo_text');
                }
                if (! Schema::hasColumn('syllabus_ilo_cdio_sdg', 'sdgs')) {
                    $table->json('sdgs')->nullable()->after('cdios');
                }
            });
        }
    }
};
