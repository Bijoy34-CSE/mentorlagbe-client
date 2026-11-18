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