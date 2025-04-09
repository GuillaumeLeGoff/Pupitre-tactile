import type { LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";

export function iconWithClassName(icon: LucideIcon) {
  if (!icon) {
    console.warn("Icon is undefined in iconWithClassName");
    return;
  }
  
  try {
    cssInterop(icon, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: true,
          opacity: true,
        },
      },
    });
  } catch (error) {
    console.error("Error in iconWithClassName:", error);
  }
}
