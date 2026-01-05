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
        if (! Schema::hasTable('syllabus_ilo_sdg_values')) {
            Schema::create('syllabus_ilo_sdg_values', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('ilo_id')->index()->comment('Foreign key to syllabus_ilo_cdio_sdg');
                $table->unsignedBigInteger('sdg_column_id')->index()->comment('Foreign key to syllabus_ilo_sdg_columns');
                $table->longText('value')->nullable()->comment('Textarea value for this SDG cell');
                $table->timestamps();

                $table->foreign('ilo_id')
                    ->references('id')
                    ->on('syllabus_ilo_cdio_sdg')
                    ->onDelete('cascade');

                $table->foreign('sdg_column_id')
                    ->references('id')
                    ->on('syllabus_ilo_sdg_columns')
                    ->onDelete('cascade');

                $table->unique(['ilo_id', 'sdg_column_id']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('syllabus_ilo_sdg_values');
    }
};
