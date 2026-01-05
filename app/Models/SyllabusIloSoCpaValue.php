<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusIloSoCpaValue extends Model
{
    use HasFactory;

    protected $table = 'syllabus_ilo_so_cpa_values';

    protected $fillable = [
        'ilo_id',
        'so_column_id',
        'value',
    ];

    public function ilo()
    {
        return $this->belongsTo(SyllabusIloSoCpa::class, 'ilo_id');
    }

    public function soColumn()
    {
        return $this->belongsTo(SyllabusIloSoCpaColumn::class, 'so_column_id');
    }
}
