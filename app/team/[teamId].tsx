import React from "react";
import { useLocalSearchParams } from "expo-router";
import TeamManagementScreen from "../../features/sports/formSport/components/TeamManagement";

export default function TeamPage() {
  const { teamId } = useLocalSearchParams();
  return <TeamManagementScreen />;
}
