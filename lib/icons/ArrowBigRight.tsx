import React from 'react';
import { ArrowBigRight } from "lucide-react-native";
import { iconWithClassName } from "./iconWithClassName";

const IconComponent = ArrowBigRight; ;
iconWithClassName(IconComponent);

export function ArrowBigRightIcon(props: React.ComponentProps<typeof IconComponent>) {
  return <IconComponent {...props} />;
} 