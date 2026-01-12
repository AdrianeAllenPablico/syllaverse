{{-- 
-------------------------------------------------------------------------------
* File: resources/views/faculty/syllabus/partials/header.blade.php
* Description: Top document heading to mirror CIS title banner
-------------------------------------------------------------------------------
--}}

@php
  $programName = $syllabus->program->name ?? null;
  $departmentName = $syllabus->program->department->name ?? null;
@endphp

<div class="text-center fw-bold mb-3" style="font-family: Georgia, serif; font-size: 16px; letter-spacing: 0.3px;">
  @if($departmentName)
    <div class="mb-2" style="font-size: 14px;">{{ $departmentName }}</div>
  @endif
  @if($programName)
    <div class="mb-3" style="font-size: 14px;">{{ strtoupper($programName) }}</div>
  @endif
  <div class="mb-2">COURSE INFORMATION SYLLABUS (CIS)</div>
  <hr class="my-2"/>
  {{-- Thin rule to visually separate the title from the grid, like CIS --}}
</div>
