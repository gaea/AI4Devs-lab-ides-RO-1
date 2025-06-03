export interface WorkExperience {
  id?: number;
  company: string;
  position: string;
  description: string;
  startDate: string; // Using string for form handling, will be converted to Date when sending to API
  endDate: string; // Using string for form handling, will be converted to Date when sending to API
}
