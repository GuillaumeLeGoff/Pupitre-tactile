import React from "react";
import { Plus } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = Plus; ;
iconWithClassName(IconComponent);

export function PlusIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
}
