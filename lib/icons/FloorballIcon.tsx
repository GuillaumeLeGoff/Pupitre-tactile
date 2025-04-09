import React from 'react';
import { FlameKindling } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = FlameKindling;
iconWithClassName(IconComponent);

export function FloorballIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 