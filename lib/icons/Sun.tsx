import React from 'react';
import { Sun as SunIcon } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = SunIcon;
iconWithClassName(IconComponent);

export function Sun(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
}
