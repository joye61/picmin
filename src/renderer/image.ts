import { AllowTypes } from "@/functions";

export function getSupportExtensionsAsString() {
  return Object.keys(AllowTypes).join("/");
}
