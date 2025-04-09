import React from 'react';
import { CircleDotDashed } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = CircleDotDashed;
iconWithClassName(IconComponent);

export function NetballIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 