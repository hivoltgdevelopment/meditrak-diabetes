import { Alert } from "react-native";
export const toast = {
  success: (m:string) => Alert.alert("Success", m),
  error:   (m:string) => Alert.alert("Error", m),
  info:    (m:string) => Alert.alert("Info", m),
};
