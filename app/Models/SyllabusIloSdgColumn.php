<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusIloSdgColumn extends Model
{
    use HasFactory;

    protected $table = 'syllabus_ilo_sdg_columns';

    protected $fillable = [
        'syllabus_id',
        'label',
        'position',
    ];

    public function syllabus()
    {
        return $this->belongsTo(Syllabus::class, 'syllabus_id');
    }

    public function values()
    {
        return $this->hasMany(SyllabusIloSdgValue::class, 'sdg_column_id');
    }
}
