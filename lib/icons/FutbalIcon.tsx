import React from 'react';
import { Hexagon } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = Hexagon;
iconWithClassName(IconComponent);

export function FutbalIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 