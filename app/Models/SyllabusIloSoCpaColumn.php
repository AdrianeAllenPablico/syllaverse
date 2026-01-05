<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusIloSoCpaColumn extends Model
{
    use HasFactory;

    protected $table = 'syllabus_ilo_so_cpa_columns';

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
        return $this->hasMany(SyllabusIloSoCpaValue::class, 'so_column_id');
    }
}
