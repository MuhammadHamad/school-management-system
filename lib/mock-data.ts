// Mock data for demonstration purposes

export interface Student {
  id: string
  name: string
  rollNumber: string
  classId: string
  email?: string
  phone?: string
}

export interface Teacher {
  id: string
  name: string
  email: string
  phone?: string
  schoolId: string
  assignedClasses: string[]
}

export interface Class {
  id: string
  name: string
  grade: string
  section: string
  schoolId: string
  teacherId?: string
  studentCount: number
}

export interface AttendanceRecord {
  id: string
  studentId: string
  classId: string
  date: string
  status: "present" | "absent" | "late" | "excused"
  markedBy: string
  markedAt: string
  notes?: string
}

export interface School {
  id: string
  name: string
  adminName: string
  email: string
  phone?: string
  plan: string
  createdAt: string
  studentCount: number
  teacherCount: number
  classCount: number
}

// Initialize demo data
export function initializeDemoData() {
  if (typeof window === "undefined") return

  // Check if demo data already exists
  if (localStorage.getItem("demo_initialized")) return

  const demoSchool: School = {
    id: "demo-school",
    name: "Springfield High School",
    adminName: "Admin User",
    email: "admin@demo.com",
    phone: "+1 (555) 123-4567",
    plan: "professional",
    createdAt: new Date().toISOString(),
    studentCount: 150,
    teacherCount: 12,
    classCount: 8,
  }

  const demoClasses: Class[] = [
    {
      id: "class-1",
      name: "Mathematics",
      grade: "10",
      section: "A",
      schoolId: "demo-school",
      teacherId: "teacher-1",
      studentCount: 25,
    },
    {
      id: "class-2",
      name: "Science",
      grade: "10",
      section: "A",
      schoolId: "demo-school",
      teacherId: "teacher-1",
      studentCount: 25,
    },
    {
      id: "class-3",
      name: "English",
      grade: "10",
      section: "B",
      schoolId: "demo-school",
      teacherId: "teacher-2",
      studentCount: 22,
    },
    {
      id: "class-4",
      name: "History",
      grade: "11",
      section: "A",
      schoolId: "demo-school",
      teacherId: "teacher-2",
      studentCount: 28,
    },
    {
      id: "class-5",
      name: "Physics",
      grade: "11",
      section: "B",
      schoolId: "demo-school",
      teacherId: "teacher-3",
      studentCount: 20,
    },
    {
      id: "class-6",
      name: "Chemistry",
      grade: "12",
      section: "A",
      schoolId: "demo-school",
      teacherId: "teacher-3",
      studentCount: 18,
    },
  ]

  const demoTeachers: Teacher[] = [
    {
      id: "teacher-1",
      name: "Teacher User",
      email: "teacher@demo.com",
      phone: "+1 (555) 234-5678",
      schoolId: "demo-school",
      assignedClasses: ["class-1", "class-2"],
    },
    {
      id: "teacher-2",
      name: "Sarah Johnson",
      email: "sarah.j@demo.com",
      phone: "+1 (555) 345-6789",
      schoolId: "demo-school",
      assignedClasses: ["class-3", "class-4"],
    },
    {
      id: "teacher-3",
      name: "Michael Chen",
      email: "michael.c@demo.com",
      phone: "+1 (555) 456-7890",
      schoolId: "demo-school",
      assignedClasses: ["class-5", "class-6"],
    },
  ]

  const demoStudents: Student[] = []
  const studentNames = [
    "Emma Wilson",
    "Liam Brown",
    "Olivia Davis",
    "Noah Miller",
    "Ava Garcia",
    "Ethan Martinez",
    "Sophia Rodriguez",
    "Mason Anderson",
    "Isabella Taylor",
    "William Thomas",
    "Mia Jackson",
    "James White",
    "Charlotte Harris",
    "Benjamin Martin",
    "Amelia Thompson",
    "Lucas Garcia",
    "Harper Lee",
    "Henry Walker",
    "Evelyn Hall",
    "Alexander Allen",
  ]

  demoClasses.forEach((cls, classIndex) => {
    for (let i = 0; i < Math.min(20, cls.studentCount); i++) {
      const studentIndex = (classIndex * 20 + i) % studentNames.length
      demoStudents.push({
        id: `student-${classIndex}-${i}`,
        name: studentNames[studentIndex],
        rollNumber: `${cls.grade}${cls.section}${String(i + 1).padStart(3, "0")}`,
        classId: cls.id,
        email: `${studentNames[studentIndex].toLowerCase().replace(" ", ".")}@student.demo.com`,
      })
    }
  })

  // Generate attendance records for the last 7 days
  const demoAttendance: AttendanceRecord[] = []
  const today = new Date()

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today)
    date.setDate(date.getDate() - dayOffset)
    const dateString = date.toISOString().split("T")[0]

    demoStudents.forEach((student) => {
      const random = Math.random()
      let status: AttendanceRecord["status"] = "present"

      if (random < 0.05) status = "absent"
      else if (random < 0.08) status = "late"
      else if (random < 0.1) status = "excused"

      demoAttendance.push({
        id: `attendance-${student.id}-${dateString}`,
        studentId: student.id,
        classId: student.classId,
        date: dateString,
        status,
        markedBy: "teacher-1",
        markedAt: `${dateString}T09:00:00Z`,
      })
    })
  }

  // Store all demo data
  localStorage.setItem("school_demo-school", JSON.stringify(demoSchool))
  localStorage.setItem("classes", JSON.stringify(demoClasses))
  localStorage.setItem("teachers", JSON.stringify(demoTeachers))
  localStorage.setItem("students", JSON.stringify(demoStudents))
  localStorage.setItem("attendance", JSON.stringify(demoAttendance))
  localStorage.setItem("demo_initialized", "true")
}

// Helper functions to get data
export function getSchool(schoolId: string): School | null {
  if (typeof window === "undefined") return null
  const data = localStorage.getItem(`school_${schoolId}`)
  return data ? JSON.parse(data) : null
}

export function getClasses(schoolId?: string): Class[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("classes")
  const classes = data ? JSON.parse(data) : []
  return schoolId ? classes.filter((c: Class) => c.schoolId === schoolId) : classes
}

export function getTeachers(schoolId?: string): Teacher[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("teachers")
  const teachers = data ? JSON.parse(data) : []
  return schoolId ? teachers.filter((t: Teacher) => t.schoolId === schoolId) : teachers
}

export function getStudents(classId?: string): Student[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("students")
  const students = data ? JSON.parse(data) : []
  return classId ? students.filter((s: Student) => s.classId === classId) : students
}

export function getAttendance(filters?: { classId?: string; date?: string; studentId?: string }): AttendanceRecord[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("attendance")
  let attendance = data ? JSON.parse(data) : []

  if (filters?.classId) {
    attendance = attendance.filter((a: AttendanceRecord) => a.classId === filters.classId)
  }
  if (filters?.date) {
    attendance = attendance.filter((a: AttendanceRecord) => a.date === filters.date)
  }
  if (filters?.studentId) {
    attendance = attendance.filter((a: AttendanceRecord) => a.studentId === filters.studentId)
  }

  return attendance
}

export function saveAttendance(records: AttendanceRecord[]) {
  if (typeof window === "undefined") return
  const existing = getAttendance()

  // Update or add new records
  records.forEach((newRecord) => {
    const index = existing.findIndex((r) => r.studentId === newRecord.studentId && r.date === newRecord.date)
    if (index >= 0) {
      existing[index] = newRecord
    } else {
      existing.push(newRecord)
    }
  })

  localStorage.setItem("attendance", JSON.stringify(existing))
}

const schools: School[] = [
  {
    id: "demo-school",
    name: "Springfield High School",
    adminName: "Admin User",
    email: "admin@demo.com",
    phone: "+1 (555) 123-4567",
    plan: "professional",
    createdAt: new Date().toISOString(),
    studentCount: 150,
    teacherCount: 12,
    classCount: 8,
  },
]

export function getAllSchools(): School[] {
  return schools
}
