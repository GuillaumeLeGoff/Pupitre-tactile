import { create } from "zustand";

export type GameMode = "classic" | "quick" | "training" | "tournament" | null;

interface GameSettingsState {
  selectedMode: GameMode;
  periodCount: string;
  periodDuration: string;
  mainBreak: string;
  secondaryBreak: string;
  overtimeBreak: string;
  preMatchTimer: string;
  overtimeTimer: string;
  chronosEnabled: boolean;
  chronosCountdown: boolean;
  chronosDuration1: string;
  chronosDuration2: string;
  timeoutsCount: string;
  showRedSquare: boolean;

  setSelectedMode: (mode: GameMode) => void;
  setPeriodCount: (count: string) => void;
  setPeriodDuration: (duration: string) => void;
  setMainBreak: (duration: string) => void;
  setSecondaryBreak: (duration: string) => void;
  setOvertimeBreak: (duration: string) => void;
  setPreMatchTimer: (duration: string) => void;
  setOvertimeTimer: (duration: string) => void;
  setChronosEnabled: (enabled: boolean) => void;
  setChronosCountdown: (countdown: boolean) => void;
  setChronosDuration1: (duration: string) => void;
  setChronosDuration2: (duration: string) => void;
  setTimeoutsCount: (count: string) => void;
  setShowRedSquare: (show: boolean) => void;
}

export const useGameSettings = create<GameSettingsState>((set) => ({
  selectedMode: null,
  periodCount: "4",
  periodDuration: "10:00",
  mainBreak: "15:00",
  secondaryBreak: "02:00",
  overtimeBreak: "02:00",
  preMatchTimer: "00:20",
  overtimeTimer: "05:00",
  chronosEnabled: false,
  chronosCountdown: false,
  chronosDuration1: "24",
  chronosDuration2: "14",
  timeoutsCount: "2",
  showRedSquare: false,

  setSelectedMode: (mode) => set({ selectedMode: mode }),
  setPeriodCount: (count) => set({ periodCount: count }),
  setPeriodDuration: (duration) => set({ periodDuration: duration }),
  setMainBreak: (duration) => set({ mainBreak: duration }),
  setSecondaryBreak: (duration) => set({ secondaryBreak: duration }),
  setOvertimeBreak: (duration) => set({ overtimeBreak: duration }),
  setPreMatchTimer: (duration) => set({ preMatchTimer: duration }),
  setOvertimeTimer: (duration) => set({ overtimeTimer: duration }),
  setChronosEnabled: (enabled) => set({ chronosEnabled: enabled }),
  setChronosCountdown: (countdown) => set({ chronosCountdown: countdown }),
  setChronosDuration1: (duration) => set({ chronosDuration1: duration }),
  setChronosDuration2: (duration) => set({ chronosDuration2: duration }),
  setTimeoutsCount: (count) => set({ timeoutsCount: count }),
  setShowRedSquare: (show) => set({ showRedSquare: show }),
}));
