<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (! Schema::hasTable('syllabus_ilo_so_cpa_columns')) {
            Schema::create('syllabus_ilo_so_cpa_columns', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('syllabus_id')->index();
                $table->string('label')->nullable()->comment('SO column label (can be duplicate)');
                $table->integer('position')->default(0)->comment('Column position order');
                $table->timestamps();

                $table->foreign('syllabus_id')->references('id')->on('syllabi')->onDelete('cascade');
                $table->unique(['syllabus_id', 'position']);
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('syllabus_ilo_so_cpa_columns');
    }
};
