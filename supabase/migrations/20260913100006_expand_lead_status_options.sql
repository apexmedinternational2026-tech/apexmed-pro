-- Widens leads.current_status to the client brief's actual Contact page
-- role list. The original 5-value set (medical_student, doctor_general,
-- doctor_specialist, resident, other) couldn't represent a consultant,
-- researcher, FCPS trainee, or postgraduate doctor at all — a real visitor
-- in one of those roles had no correct option to pick. doctor_general and
-- doctor_specialist collapse into the brief's plain "doctor" rather than
-- carrying over a distinction the brief doesn't make.
--
-- Postgres auto-names an inline `check (...)` constraint
-- `<table>_<column>_check` when no name is given (see
-- 20260912100008_business.sql's original create table) — that's the name
-- being dropped here.

-- Must run before the constraint swap below — any existing row still
-- carrying one of the two retired values would otherwise violate the new
-- constraint the moment it's added.
update leads
set current_status = 'doctor'
where current_status in ('doctor_general', 'doctor_specialist');

alter table leads
  drop constraint leads_current_status_check;

alter table leads
  add constraint leads_current_status_check
  check (
    current_status in (
      'medical_student',
      'medical_graduate',
      'doctor',
      'fcps_trainee',
      'postgraduate_doctor',
      'resident',
      'consultant',
      'researcher',
      'healthcare_professional',
      'other'
    )
  );
