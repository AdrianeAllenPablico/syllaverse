<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('syllabus_ilo_so_cpa_values')) {
            Schema::create('syllabus_ilo_so_cpa_values', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('ilo_id')->index()->comment('Foreign key to syllabus_ilo_so_cpa');
                $table->unsignedBigInteger('so_column_id')->index()->comment('Foreign key to syllabus_ilo_so_cpa_columns');
                $table->longText('value')->nullable()->comment('Textarea value for this SO cell');
                $table->timestamps();

                $table->foreign('ilo_id')->references('id')->on('syllabus_ilo_so_cpa')->onDelete('cascade');
                $table->foreign('so_column_id')->references('id')->on('syllabus_ilo_so_cpa_columns')->onDelete('cascade');
                $table->unique(['ilo_id', 'so_column_id']);
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('syllabus_ilo_so_cpa_values');
    }
};
