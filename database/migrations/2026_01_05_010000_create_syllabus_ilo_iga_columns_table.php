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
        if (! Schema::hasTable('syllabus_ilo_iga_columns')) {
            Schema::create('syllabus_ilo_iga_columns', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('syllabus_id')->index();
                $table->string('label')->nullable()->comment('IGA column label (can be duplicate)');
                $table->integer('position')->default(0)->comment('Column position order');
                $table->timestamps();

                $table->foreign('syllabus_id')
                    ->references('id')
                    ->on('syllabi')
                    ->onDelete('cascade');

                $table->unique(['syllabus_id', 'position']);
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('syllabus_ilo_iga_columns');
    }
};
