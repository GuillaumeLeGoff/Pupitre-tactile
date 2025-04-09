import React from 'react';
import { Footprints } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = Footprints;
iconWithClassName(IconComponent);

export function FootIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 