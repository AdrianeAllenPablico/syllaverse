<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyllabusCriteriaCategory extends Model
{
    use HasFactory;

    protected $table = 'syllabus_criteria_categories';

    protected $fillable = [
        'syllabus_id',
        'category',
        'position',
    ];

    protected $casts = [
    ];

    // Relationships
    public function syllabus()
    {
        return $this->belongsTo(Syllabus::class);
    }

    public function tasks()
    {
        return $this->hasMany(SyllabusCriteriaTask::class, 'category_id');
    }

    // Accessors to keep Blade compatibility
    public function getHeadingAttribute()
    {
        return $this->category;
    }

    public function getValueAttribute()
    {
        // Map tasks to the legacy structure [{description, percent}]
        return $this->tasks->map(function ($t) {
            return [
                'description' => $t->task,
                'percent' => $t->percent,
            ];
        })->values()->toArray();
    }
}
