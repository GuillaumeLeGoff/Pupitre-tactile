import React from 'react';
import { CircleDot } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = CircleDot;
iconWithClassName(IconComponent);

export function BadmintonIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 