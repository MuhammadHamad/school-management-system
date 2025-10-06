-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Schools are viewable by their members" ON schools;
DROP POLICY IF EXISTS "Schools are updatable by their admins" ON schools;
DROP POLICY IF EXISTS "SaaS owners can view all schools" ON schools;
DROP POLICY IF EXISTS "SaaS owners can update all schools" ON schools;

DROP POLICY IF EXISTS "Profiles are viewable by same school members" ON profiles;
DROP POLICY IF EXISTS "Profiles are updatable by user themselves" ON profiles;
DROP POLICY IF EXISTS "Profiles are insertable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "SaaS owners can view all profiles" ON profiles;

DROP POLICY IF EXISTS "Classes are viewable by same school members" ON classes;
DROP POLICY IF EXISTS "Classes are manageable by school admins" ON classes;
DROP POLICY IF EXISTS "SaaS owners can view all classes" ON classes;

DROP POLICY IF EXISTS "Students are viewable by same school members" ON students;
DROP POLICY IF EXISTS "Students are manageable by school admins and teachers" ON students;
DROP POLICY IF EXISTS "SaaS owners can view all students" ON students;

DROP POLICY IF EXISTS "Attendance records are viewable by same school members" ON attendance_records;
DROP POLICY IF EXISTS "Attendance records are manageable by teachers and admins" ON attendance_records;
DROP POLICY IF EXISTS "SaaS owners can view all attendance records" ON attendance_records;

-- Schools policies
CREATE POLICY "Schools are viewable by their members" ON schools
  FOR SELECT
  USING (
    id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Schools are updatable by their admins" ON schools
  FOR UPDATE
  USING (
    id IN (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role = 'school_admin'
    )
  );

CREATE POLICY "Schools are insertable during registration" ON schools
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "SaaS owners can view all schools" ON schools
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'saas_owner'
    )
  );

CREATE POLICY "SaaS owners can update all schools" ON schools
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'saas_owner'
    )
  );

-- Profiles policies
CREATE POLICY "Profiles are viewable by same school members" ON profiles
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid()
    )
    OR id = auth.uid()
  );

CREATE POLICY "Profiles are updatable by user themselves" ON profiles
  FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Profiles are insertable by authenticated users" ON profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "SaaS owners can view all profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'saas_owner'
    )
  );

-- Classes policies
CREATE POLICY "Classes are viewable by same school members" ON classes
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Classes are manageable by school admins" ON classes
  FOR ALL
  USING (
    school_id IN (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role = 'school_admin'
    )
  );

CREATE POLICY "SaaS owners can view all classes" ON classes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'saas_owner'
    )
  );

-- Students policies
CREATE POLICY "Students are viewable by same school members" ON students
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Students are manageable by school admins and teachers" ON students
  FOR ALL
  USING (
    school_id IN (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('school_admin', 'teacher')
    )
  );

CREATE POLICY "SaaS owners can view all students" ON students
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'saas_owner'
    )
  );

-- Attendance records policies
CREATE POLICY "Attendance records are viewable by same school members" ON attendance_records
  FOR SELECT
  USING (
    school_id IN (
      SELECT school_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Attendance records are manageable by teachers and admins" ON attendance_records
  FOR ALL
  USING (
    school_id IN (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('school_admin', 'teacher')
    )
  );

CREATE POLICY "SaaS owners can view all attendance records" ON attendance_records
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'saas_owner'
    )
  );
