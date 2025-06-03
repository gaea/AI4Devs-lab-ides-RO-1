export interface Education {
  id?: number;
  institution: string;
  title: string;
  startDate: Date;
  endDate?: Date; // Optional end date for ongoing education
}
