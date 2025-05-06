import React from 'react';
import { ArrowBigLeft } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = ArrowBigLeft; ;
iconWithClassName(IconComponent);

export function ArrowBigLeftIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 