import React from 'react';
import { Volleyball } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = Volleyball;
iconWithClassName(IconComponent);

export function BasketballIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 