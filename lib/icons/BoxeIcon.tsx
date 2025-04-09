import React from 'react';
import { CircleX } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = CircleX;
iconWithClassName(IconComponent);

export function BoxeIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 