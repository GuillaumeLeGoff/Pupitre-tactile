import React from 'react';
import { MoonStar as MoonStarIcon } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = MoonStarIcon;
iconWithClassName(IconComponent);

export function MoonStar(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
}
