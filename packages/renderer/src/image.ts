import { AllowTypes } from "../../common/const";

export function getSupportExtensionsAsString() {
  return Object.keys(AllowTypes).join("/");
}
