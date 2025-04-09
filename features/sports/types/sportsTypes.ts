export interface Sport {
  id: string;
  name: string;
  icon: string;
}

export type SportsState = {
  sports: Sport[];
  selectedSport: Sport | null;
  loading: boolean;
  error: string | null;
}; 