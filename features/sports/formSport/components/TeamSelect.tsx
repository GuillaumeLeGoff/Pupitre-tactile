import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '~/components/ui/select';
import { Team } from '../../types/sportsTypes';
import { Card, CardTitle, CardHeader, CardContent } from '~/components/ui/card';
import { Check } from '~/lib/icons/Check';
import { useTeamSelection } from '../store/teamSelection';

interface CustomSelectItemProps {
  label: string;
  value: string;
  children?: React.ReactNode;
  onPress?: () => void;
}

const TEAMS: Team[] = [
  { id: 'team1', name: 'Équipe 1', number: 1 },
  { id: 'team2', name: 'Équipe 2', number: 2 },
  { id: 'team3', name: 'Équipe 3', number: 3 },
];

export function TeamSelect() {
  const { homeTeam, setHomeTeam } = useTeamSelection();

  const handleTeamSelect = (teamId: string) => {
    if (teamId === 'add') {
      // Logique pour ajouter une nouvelle équipe
      console.log('Ajouter une nouvelle équipe');
    } else {
      const selectedTeam = TEAMS.find(team => team.id === teamId);
      setHomeTeam(selectedTeam || null);
    }
  };

  return (
    <Card style={{ height: "100%" }} className="flex-1">
      <CardHeader>
        <CardTitle>Equipe</CardTitle>
      </CardHeader>
      <CardContent>
        <View style={{ flexDirection: 'row', alignItems: 'center' , justifyContent: 'space-around'}}>
          <Select style={{ width: '40%' }}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez la 1ère équipe" />
            </SelectTrigger>
            <SelectContent>
              {TEAMS.map((team) => (
                <SelectItem
                  key={team.id}
                  label={team.name}
                  value={team.id}
                  onPress={() => handleTeamSelect(team.id)}
                />
              ))}
              <SelectItem
                label="Ajouter une nouvelle équipe"
                value="add"
                onPress={() => handleTeamSelect("add")}
              />
            </SelectContent>
          </Select>
          <Select style={{ width: '40%' }}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez la 2ème équipe" />
            </SelectTrigger>
            <SelectContent>
              {TEAMS.map((team) => (
                <SelectItem
                  key={team.id}
                  label={team.name}
                  value={team.id}
                  onPress={() => handleTeamSelect(team.id)}
                />
              ))}
              <SelectItem
                label="Ajouter une nouvelle équipe"
                value="add"
                onPress={() => handleTeamSelect("add")}
              />
            </SelectContent>
          </Select>
        </View>
      </CardContent>
    </Card>
  );
} 