import { create } from 'zustand';
import { Sport, SportsState } from '../types/sportsTypes';

export const useSportsStore = create<SportsState>((set) => ({
  sports: [
    { id: 'badminton', name: 'Badminton', icon: 'BadmintonIcon' },
    { id: 'basketball', name: 'Basketball', icon: 'BasketballIcon' },
    { id: 'boxe', name: 'Boxe', icon: 'BoxeIcon' },
    { id: 'field-hockey', name: 'Field Hockey', icon: 'FieldHockeyIcon' },
    { id: 'futbal', name: 'Futbal', icon: 'FutbalIcon' },
    { id: 'floorball', name: 'Floorball', icon: 'FloorballIcon' },
    { id: 'foot', name: 'Foot', icon: 'FootIcon' },
    { id: 'netball', name: 'Netball', icon: 'NetballIcon' },
    { id: 'volley', name: 'Volley', icon: 'VolleyIcon' },
  ],
  selectedSport: null,
  loading: false,
  error: null,

  selectSport: (sport: Sport) => set({ selectedSport: sport }),
  clearSelection: () => set({ selectedSport: null }),
})); 