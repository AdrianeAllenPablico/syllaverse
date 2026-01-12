<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class MasterDataController extends Controller
{
    /**
     * Display the Master Data page (SO, ILO, SDG, IGA, CDIO tabs).
     */
    public function index(): View
    {
        $user = Auth::guard('faculty')->user();
        // Active appointments for scoping
        $appointments = method_exists($user, 'appointments') ? $user->appointments()->active()->get() : collect();

        // Institution-wide roles (see all departments & courses)
        $hasInstitutionWideOnly = $appointments->isNotEmpty() && $appointments->every(function($a){
            return in_array($a->role, ['VCAA','ASSOC_VCAA']);
        });

        // Determine a single department scope from department-scoped roles
        $deptScopedRoles = [
            \App\Models\Appointment::ROLE_DEPT,
            \App\Models\Appointment::ROLE_DEPT_HEAD,
            \App\Models\Appointment::ROLE_PROG,
            \App\Models\Appointment::ROLE_DEAN,
            \App\Models\Appointment::ROLE_ASSOC_DEAN,
            \App\Models\Appointment::ROLE_FACULTY,
        ];
        $deptAppt = $appointments->first(function($a) use ($deptScopedRoles){
            return in_array($a->role, $deptScopedRoles, true) && $a->scope_type === \App\Models\Appointment::SCOPE_DEPT && !empty($a->scope_id);
        });
        $departmentId = $deptAppt?->scope_id;

        // Departments list (all if no scoped department, else just scoped department)
        if ($departmentId) {
            $departments = Department::where('id', (int) $departmentId)->get();
        } else {
            $departments = Department::orderBy('name')->get();
        }

        // Courses filtered by user's department when available; otherwise all courses
        if ($departmentId) {
            $courses = Course::active()
                ->where('department_id', (int) $departmentId)
                ->orderBy('title')
                ->get();
        } else {
            $courses = Course::active()
                ->orderBy('title')
                ->get();
        }

        // Show department filter only if institution-wide (can switch among departments)
        $showDepartmentFilter = $hasInstitutionWideOnly;

        return view('faculty.master-data.index', [
            'departments' => $departments, // Pre-filtered department collection
            'showDepartmentFilter' => $showDepartmentFilter,
            'showCdioTab' => true,
            'courses' => $courses, // Pre-filtered courses collection
            'scoped_department_id' => $departmentId ? (int)$departmentId : null,
        ]);
    }
}
