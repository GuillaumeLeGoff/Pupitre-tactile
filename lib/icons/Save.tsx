import React from "react";
import { Save } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = Save; ;
iconWithClassName(IconComponent);

export function SaveIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
}
