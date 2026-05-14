export interface PersonalInfo {
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  city: string;
  address: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
}

export interface CareerInfo {
  salaryRangeFrom: number;
  salaryRangeTo: number;
  currentJobStatus: 'employed' | 'unemployed' | 'freelancer' | 'student';
  experienceYears: number;
  educationLevel: 'highSchool' | 'bachelor' | 'master' | 'phd';
  jobLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'manager';
  jobTypes: string[];
  jobRoles: string[];
  workCities: string[];
}

export interface Education {
  id: string;
  certificateType: 'highSchool' | 'bachelor' | 'master' | 'phd' | 'diploma' | 'certificate';
  university: string;
  faculty: string;
  major: string;
  majorName: string;
  grade: 'excellent' | 'veryGood' | 'good' | 'pass';
  fromDate: string; // Format: YYYY-MM
  awardedDate: string; // Format: YYYY-MM
  certificateImage?: string;
}

export interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  jobRoles: string[];
  fromDate: string; // Format: YYYY-MM
  toDate?: string; // Format: YYYY-MM
  isCurrentlyWorking: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface UserProfile {
  id: string;
  image: string;
  name: string;
  location: string;
  personalInfo: PersonalInfo;
  careerInfo: CareerInfo;
  educations: Education[];
  experiences: Experience[];
  skills: Skill[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
}
