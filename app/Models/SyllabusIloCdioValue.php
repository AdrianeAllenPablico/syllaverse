<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusIloCdioValue extends Model
{
    use HasFactory;

    protected $table = 'syllabus_ilo_cdio_values';

    protected $fillable = [
        'ilo_id',
        'cdio_column_id',
        'value',
    ];

    public function ilo()
    {
        return $this->belongsTo(SyllabusIloCdioSdg::class, 'ilo_id');
    }

    public function cdioColumn()
    {
        return $this->belongsTo(SyllabusIloCdioColumn::class, 'cdio_column_id');
    }
}
