import React from "react";
import { ChevronUp as ChevronUpIcon } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = ChevronUpIcon;
iconWithClassName(IconComponent);

export function ChevronUp(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
}
