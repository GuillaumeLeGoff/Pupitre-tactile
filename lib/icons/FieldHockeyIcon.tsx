import React from 'react';
import { Sparkles } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = Sparkles;
iconWithClassName(IconComponent);

export function FieldHockeyIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 