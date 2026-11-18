export interface Tuition {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt: string;
}

export interface PlatformStats {
  tutors: number;
  students: number;
  tuitions: number;
  accepted: number;
}
export interface TuitionDetail extends Tuition {
  tutor: {
    name: string;
    image?: string;
    bio?: string;
    plan?: "free" | "pro";
  } | null;
}

export interface TuitionList {
  data: Tuition[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TuitionMeta {
  subjects: string[];
  classLevels: string[];
}
export interface Application {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject: string;
  monthlyFee: number;
  tutorName: string;
  tutorEmail: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  preferredSchedule: string;
  studentNote: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "student" | "tutor" | "admin";
  phone?: string;
  bio?: string;
  plan?: "free" | "pro";
  createdAt?: string;
}