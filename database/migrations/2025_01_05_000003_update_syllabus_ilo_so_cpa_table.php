<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (Schema::hasTable('syllabus_ilo_so_cpa')) {
            Schema::table('syllabus_ilo_so_cpa', function (Blueprint $table) {
                // Drop sos JSON column since we're moving SO values to separate table
                if (Schema::hasColumn('syllabus_ilo_so_cpa', 'sos')) {
                    $table->dropColumn('sos');
                }
            });
        }
    }

    public function down()
    {
        if (Schema::hasTable('syllabus_ilo_so_cpa')) {
            Schema::table('syllabus_ilo_so_cpa', function (Blueprint $table) {
                if (!Schema::hasColumn('syllabus_ilo_so_cpa', 'sos')) {
                    $table->json('sos')->nullable()->after('ilo_text');
                }
            });
        }
    }
};
