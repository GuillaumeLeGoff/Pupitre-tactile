import React from "react";
import { ChevronDown as ChevronDownIcon } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = ChevronDownIcon;
iconWithClassName(IconComponent);

export function ChevronDown(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
}
