import { useRouter } from "expo-router";
import { useSportSelected } from "../store/sportSelected";
import { Sport } from "../../types/sportsTypes";

const useSportHooks = () => {
  const router = useRouter();
  const { setSport } = useSportSelected();

 
  const handleSportSelected = (sport: Sport) => {
    setSport(sport);
  };

  return { handleSportSelected };
};

export default useSportHooks;