import React from "react";
import { Check as CheckIcon } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = CheckIcon;
iconWithClassName(IconComponent);

export function Check(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
}
