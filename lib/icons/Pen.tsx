import React from "react";
import { Pen } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = Pen;
iconWithClassName(IconComponent);

export function PenIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
}
