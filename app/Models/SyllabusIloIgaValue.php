<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusIloIgaValue extends Model
{
    use HasFactory;

    protected $table = 'syllabus_ilo_iga_values';

    protected $fillable = [
        'ilo_id',
        'iga_column_id',
        'value',
    ];

    public function ilo()
    {
        return $this->belongsTo(SyllabusIloIga::class, 'ilo_id');
    }

    public function igaColumn()
    {
        return $this->belongsTo(SyllabusIloIgaColumn::class, 'iga_column_id');
    }
}
