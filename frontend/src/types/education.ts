export interface Education {
  id?: number;
  institution: string;
  title: string;
  startDate: string; // Using string for form handling, will be converted to Date when sending to API
  endDate?: string; // Optional end date for ongoing education
}
