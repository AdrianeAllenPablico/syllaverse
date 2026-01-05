<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusIloSdgValue extends Model
{
    use HasFactory;

    protected $table = 'syllabus_ilo_sdg_values';

    protected $fillable = [
        'ilo_id',
        'sdg_column_id',
        'value',
    ];

    public function ilo()
    {
        return $this->belongsTo(SyllabusIloCdioSdg::class, 'ilo_id');
    }

    public function sdgColumn()
    {
        return $this->belongsTo(SyllabusIloSdgColumn::class, 'sdg_column_id');
    }
}
