interface Job {
  id: string;
  displayId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  createdAt: string;
  roles: string[];
  types: string[];
  levels: string[];
  experience: string;
  location: string;
}

export type {
    Job
}