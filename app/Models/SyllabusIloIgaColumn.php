<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusIloIgaColumn extends Model
{
    use HasFactory;

    protected $table = 'syllabus_ilo_iga_columns';

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
        return $this->hasMany(SyllabusIloIgaValue::class, 'iga_column_id');
    }
}
