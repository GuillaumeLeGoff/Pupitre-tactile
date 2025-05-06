import React from "react";
import { View, Image, TouchableOpacity, Dimensions, Text } from "react-native";
import { useRouter } from "expo-router";
import { Sport } from "../../types/sportsTypes";
import useSportHooks from "../hooks/sportHooks";

const SPORTS: Sport[] = [
  {
    id: "basketball",
    icon: require("../../../../assets/icons/BasketBall.png"),
    name: "Basketball",
  },
  {
    id: "badminton",
    icon: require("../../../../assets/icons/Badminton.png"),
    name: "Badminton",
  },
  {
    id: "boxe",
    icon: require("../../../../assets/icons/Boxe.png"),
    name: "Boxe",
  },
  {
    id: "fieldHockey",
    icon: require("../../../../assets/icons/FieldHockey.png"),
    name: "Field Hockey",
  },
  {
    id: "floorball",
    icon: require("../../../../assets/icons/FloorBall.png"),
    name: "Floorball",
  },
  {
    id: "volleyball",
    icon: require("../../../../assets/icons/Volley.png"),
    name: "Volleyball",
  },
  {
    id: "tennis",
    icon: require("../../../../assets/icons/Tennis.png"),
    name: "Tennis",
  },
  {
    id: "soccer",
    icon: require("../../../../assets/icons/Soccer.png"),
    name: "Football",
  },
  {
    id: "handball",
    icon: require("../../../../assets/icons/HandBall.png"),
    name: "Handball",
  },

  {
    id: "tableTennis",
    icon: require("../../../../assets/icons/TableTennis.png"),
    name: "Tennis de table",
  },
  {
    id: "hockey",
    icon: require("../../../../assets/icons/Hockey.png"),
    name: "Hockey",
  },
  {
    id: "swimming",
    icon: require("../../../../assets/icons/Swimming.png"),
    name: "Natation",
  },
  {
    id: "waterPolo",
    icon: require("../../../../assets/icons/WaterPolo.png"),
    name: "Water-polo",
  },
  {
    id: "squash",
    icon: require("../../../../assets/icons/Squash.png"),
    name: "Squash",
  },
  {
    id: "rugby",
    icon: require("../../../../assets/icons/Rubgy.png"),
    name: "Rugby",
  },
];

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 4;
const SPACING = 100;
const GRID_ITEM_SIZE = ((NUM_COLUMNS + 1) * SPACING) / NUM_COLUMNS;
const ICON_RATIO = 0.6;

export const SportGrid = () => {
  const { handleSportSelected } = useSportHooks();
  return (
    <View className="p-6  ">
      <View
        style={{
          flexWrap: "wrap",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: -SPACING / 2,
        }}
      >
        {SPORTS.map((sport) => (
          <TouchableOpacity
            key={sport.id}
            onPress={() => handleSportSelected(sport)}
            style={{
      
              marginVertical: SPACING / 4,
            }}
          >
            <View
              className="bg-card rounded-lg border border-border items-center justify-center"
              style={{
                width: GRID_ITEM_SIZE,
                height: GRID_ITEM_SIZE,
                marginHorizontal: SPACING / 2,
             
              }}
            >
              <Image
                source={sport.icon}
                style={{
                  width: (GRID_ITEM_SIZE * ICON_RATIO) / 2,
                  height: (GRID_ITEM_SIZE * ICON_RATIO) / 2,
                }}
                resizeMode="contain"
              />
            </View>
            <Text
              style={{ marginTop: 12 }}
              className="mt-4 text-lg font-bold text-foreground text-center"
            >
              {sport.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
