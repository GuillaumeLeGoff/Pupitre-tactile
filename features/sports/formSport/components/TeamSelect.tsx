import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList, SafeAreaView } from "react-native";
import { Card, CardTitle, CardHeader, CardContent } from "~/components/ui/card";
import { useTeamSelection } from "../store/teamStore";
import { useSportSelected } from "../../selectSport/store/sportSelected";
import { Button } from "~/components/ui/button";
import { useTeams } from "../hooks/useTeams";
import { PenIcon } from "~/lib/icons/Pen";
import { PlusIcon } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";

export function TeamSelect() {
  const { homeTeam, awayTeam } = useTeamSelection();
  const { sport } = useSportSelected();
  const { teams, handleTeamSelect, openTeamManagement } = useTeams(sport);
  
  const [homeModalVisible, setHomeModalVisible] = useState(false);
  const [awayModalVisible, setAwayModalVisible] = useState(false);
  
  const openHomeTeamSelector = () => setHomeModalVisible(true);
  const closeHomeTeamSelector = () => setHomeModalVisible(false);
  
  const openAwayTeamSelector = () => setAwayModalVisible(true);
  const closeAwayTeamSelector = () => setAwayModalVisible(false);
  
  const selectHomeTeam = (value) => {
    handleTeamSelect(value, true);
    closeHomeTeamSelector();
  };
  
  const selectAwayTeam = (value) => {
    handleTeamSelect(value, false);
    closeAwayTeamSelector();
  };
  
  return (
    <Card style={{ height: "100%" }} className="flex-1">
      <CardHeader>
        <CardTitle>Équipes</CardTitle>
      </CardHeader>
      <CardContent>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <View style={{ width: "40%" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={openHomeTeamSelector}
                >
                  <Text style={styles.selectText}>
                    {homeTeam ? homeTeam.name : "Sélectionnez la 1ère équipe"}
                  </Text>
                </TouchableOpacity>
                
                <Modal
                  visible={homeModalVisible}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={closeHomeTeamSelector}
                >
                  <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Sélectionnez une équipe</Text>
                      
                      <FlatList
                        data={teams}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.teamItem}
                            onPress={() => selectHomeTeam(item.id)}
                          >
                            <Text style={styles.teamName}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={() => (
                          <>
                            <View style={styles.separator} />
                            <TouchableOpacity
                              style={styles.addTeamItem}
                              onPress={() => selectHomeTeam("add")}
                            >
                              <PlusIcon size={16} color="#000" />
                              <Text style={styles.addTeamText}>Ajouter une nouvelle équipe</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      />
                      
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeHomeTeamSelector}
                      >
                        <Text style={styles.closeButtonText}>Fermer</Text>
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>
                </Modal>
              </View>
              {homeTeam && (
                <Button
                  variant="ghost"
                  onPress={() => openTeamManagement(homeTeam.id)}
                  className="ml-2"
                >
                  <PenIcon />
                </Button>
              )}
            </View>
          </View>
          
          <View style={{ width: "40%" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={openAwayTeamSelector}
                >
                  <Text style={styles.selectText}>
                    {awayTeam ? awayTeam.name : "Sélectionnez la 2ème équipe"}
                  </Text>
                </TouchableOpacity>
                
                <Modal
                  visible={awayModalVisible}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={closeAwayTeamSelector}
                >
                  <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalTitle}>Sélectionnez une équipe</Text>
                      
                      <FlatList
                        data={teams}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.teamItem}
                            onPress={() => selectAwayTeam(item.id)}
                          >
                            <Text style={styles.teamName}>{item.name}</Text>
                          </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={() => (
                          <>
                            <View style={styles.separator} />
                            <TouchableOpacity
                              style={styles.addTeamItem}
                              onPress={() => selectAwayTeam("add")}
                            >
                              <PlusIcon size={16} color="#000" />
                              <Text style={styles.addTeamText}>Ajouter une nouvelle équipe</Text>
                            </TouchableOpacity>
                          </>
                        )}
                      />
                      
                      <TouchableOpacity
                        style={styles.closeButton}
                        onPress={closeAwayTeamSelector}
                      >
                        <Text style={styles.closeButtonText}>Fermer</Text>
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>
                </Modal>
              </View>
              {awayTeam && (
                <Button
                  variant="ghost"
                  onPress={() => openTeamManagement(awayTeam.id)}
                  className="ml-2"
                >
                  <PenIcon />
                </Button>
              )}
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "white",
    minHeight: 48,
    justifyContent: "center",
  },
  selectText: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    maxHeight: "70%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  teamItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  teamName: {
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
  addTeamItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  addTeamText: {
    fontSize: 16,
    marginLeft: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
