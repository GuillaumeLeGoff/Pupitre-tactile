import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import FormSportScreen from "../features/sports/formSport";
import { useSportSelected } from "../features/sports/selectSport/store/sportSelected";
import { Sport } from "../features/sports/types/sportsTypes";
import { SportGrid } from "../features/sports/selectSport/components/SportGrid";

// Liste des sports disponibles (correspondant à celle dans SportGrid)
const SPORTS: Sport[] = [
  {
    id: "basketball",
    icon: require("../assets/icons/BasketBall.png"),
    name: "Basketball",
  },
  {
    id: "volleyball",
    icon: require("../assets/icons/Volley.png"),
    name: "Volleyball",
  },
  { id: "tennis", icon: require("../assets/icons/Tennis.png"), name: "Tennis" },
  {
    id: "soccer",
    icon: require("../assets/icons/Soccer.png"),
    name: "Football",
  },
  {
    id: "handball",
    icon: require("../assets/icons/HandBall.png"),
    name: "Handball",
  },
  {
    id: "badminton",
    icon: require("../assets/icons/Badminton.png"),
    name: "Badminton",
  },
  {
    id: "tableTennis",
    icon: require("../assets/icons/TableTennis.png"),
    name: "Tennis de table",
  },
  { id: "hockey", icon: require("../assets/icons/Hockey.png"), name: "Hockey" },
  {
    id: "swimming",
    icon: require("../assets/icons/Swimming.png"),
    name: "Natation",
  },
  {
    id: "waterPolo",
    icon: require("../assets/icons/WaterPolo.png"),
    name: "Water-polo",
  },
  { id: "squash", icon: require("../assets/icons/Squash.png"), name: "Squash" },
  { id: "rugby", icon: require("../assets/icons/Rubgy.png"), name: "Rugby" },
];

export default function SportPage() {
  const { sportId } = useLocalSearchParams();
  const { setSport, sport } = useSportSelected();

  useEffect(() => {
    if (sportId && typeof sportId === "string") {
      const selectedSport = SPORTS.find((s) => s.id === sportId);
      if (selectedSport) {
        setSport(selectedSport);
      }
    }
  }, [sportId, setSport]);

  // Si le sport est trouvé, afficher le formulaire, sinon afficher la grille de sélection
  if (sport && sport.id === sportId) {
    return <FormSportScreen />;
  }

  return <SportGrid />;
}
