<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusCriteriaTask extends Model
{
    use HasFactory;

    protected $table = 'syllabus_criteria_tasks';

    protected $fillable = [
        'syllabus_id',
        'category_id',
        'task',
        'percent',
        'position',
    ];

    public function syllabus()
    {
        return $this->belongsTo(Syllabus::class);
    }

    public function category()
    {
        return $this->belongsTo(SyllabusCriteriaCategory::class, 'category_id');
    }
}
