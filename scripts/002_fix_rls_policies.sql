-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Schools are viewable by their members" ON schools;
DROP POLICY IF EXISTS "Schools are updatable by their admins" ON schools;
DROP POLICY IF EXISTS "Schools are insertable during registration" ON schools;
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

-- ============================================
-- PROFILES POLICIES (No self-referencing!)
-- ============================================

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (id = auth.uid());

-- Allow users to view profiles in their school (using direct school_id comparison)
CREATE POLICY "Users can view same school profiles" ON profiles
  FOR SELECT
  USING (
    school_id = (
      SELECT p.school_id FROM profiles p WHERE p.id = auth.uid() LIMIT 1
    )
  );

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (id = auth.uid());

-- Allow authenticated users to insert their profile during registration
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());

-- ============================================
-- SCHOOLS POLICIES
-- ============================================

-- Allow users to view their school
CREATE POLICY "Users can view own school" ON schools
  FOR SELECT
  USING (
    id = (SELECT school_id FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

-- Allow school admins to update their school
CREATE POLICY "School admins can update school" ON schools
  FOR UPDATE
  USING (
    id = (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role = 'school_admin' 
      LIMIT 1
    )
  );

-- Allow anyone authenticated to insert schools (for registration)
CREATE POLICY "Authenticated users can create schools" ON schools
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- CLASSES POLICIES
-- ============================================

CREATE POLICY "Users can view classes in their school" ON classes
  FOR SELECT
  USING (
    school_id = (SELECT school_id FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

CREATE POLICY "School admins can manage classes" ON classes
  FOR ALL
  USING (
    school_id = (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role = 'school_admin' 
      LIMIT 1
    )
  );

-- ============================================
-- STUDENTS POLICIES
-- ============================================

CREATE POLICY "Users can view students in their school" ON students
  FOR SELECT
  USING (
    school_id = (SELECT school_id FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Admins and teachers can manage students" ON students
  FOR ALL
  USING (
    school_id = (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('school_admin', 'teacher')
      LIMIT 1
    )
  );

-- ============================================
-- ATTENDANCE RECORDS POLICIES
-- ============================================

CREATE POLICY "Users can view attendance in their school" ON attendance_records
  FOR SELECT
  USING (
    school_id = (SELECT school_id FROM profiles WHERE id = auth.uid() LIMIT 1)
  );

CREATE POLICY "Teachers and admins can manage attendance" ON attendance_records
  FOR ALL
  USING (
    school_id = (
      SELECT school_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('school_admin', 'teacher')
      LIMIT 1
    )
  );

-- ============================================
-- SAAS OWNER POLICIES (Special superuser access)
-- ============================================

-- SaaS owners can view all schools
CREATE POLICY "SaaS owners view all schools" ON schools
  FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'saas_owner'
  );

-- SaaS owners can update all schools
CREATE POLICY "SaaS owners update all schools" ON schools
  FOR UPDATE
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'saas_owner'
  );

-- SaaS owners can view all profiles
CREATE POLICY "SaaS owners view all profiles" ON profiles
  FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'saas_owner'
  );

-- SaaS owners can view all classes
CREATE POLICY "SaaS owners view all classes" ON classes
  FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'saas_owner'
  );

-- SaaS owners can view all students
CREATE POLICY "SaaS owners view all students" ON students
  FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'saas_owner'
  );

-- SaaS owners can view all attendance records
CREATE POLICY "SaaS owners view all attendance" ON attendance_records
  FOR SELECT
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1) = 'saas_owner'
  );
