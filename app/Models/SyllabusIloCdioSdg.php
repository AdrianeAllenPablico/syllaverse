<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SyllabusIloCdioSdg extends Model
{
    protected $table = 'syllabus_ilo_cdio_sdg';

    protected $fillable = [
        'syllabus_id',
        'ilo_text',
        'position',
    ];

    public function syllabus()
    {
        return $this->belongsTo(Syllabus::class);
    }

    public function cdioValues()
    {
        return $this->hasMany(SyllabusIloCdioValue::class, 'ilo_id');
    }

    public function sdgValues()
    {
        return $this->hasMany(SyllabusIloSdgValue::class, 'ilo_id');
    }
}
