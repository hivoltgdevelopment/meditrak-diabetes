import { Platform } from "react-native";
import { supabase } from "./supabase";

/**
 * Request permissions from Apple HealthKit or Google Fit and wire up
 * listeners for basic metrics. Data is persisted to Supabase so that it
 * can be consumed by other parts of the app. This implementation relies on
 * native modules or Expo plugins being added at build time. The modules are
 * dynamically imported so TypeScript type declarations are not required in
 * this repository.
 */
export async function initHealth(): Promise<boolean> {
  try {
    if (Platform.OS === "ios") {
      // @ts-ignore - provided by the Expo/React Native HealthKit plugin
      const HealthKit = (await import("react-native-health")).default as any;

      const permissions = {
        permissions: {
          read: ["StepCount", "BloodGlucose"],
        },
      };

      // initialise HealthKit and request the declared permissions
      await new Promise<void>((resolve, reject) => {
        HealthKit.initHealthKit(permissions, (error: unknown) => {
          if (error) reject(error);
          else resolve();
        });
      });

      // subscribe to step count updates
      HealthKit.observeSteps((err: unknown, result: any) => {
        if (!err && result?.value) {
          saveActivity(result.value, result.startDate);
        }
      });

      // subscribe to blood glucose changes
      if (HealthKit.observeBloodGlucose) {
        HealthKit.observeBloodGlucose((err: unknown, result: any) => {
          if (!err && result?.value) {
            saveGlucose(result.value, result.startDate);
          }
        });
      }
    } else if (Platform.OS === "android") {
      // @ts-ignore - provided by the Expo/React Native Google Fit plugin
      const GoogleFit = await import("react-native-google-fit");

      const options = {
        scopes: [
          // Activity and step count
          "https://www.googleapis.com/auth/fitness.activity.read",
          // Blood glucose readings
          "https://www.googleapis.com/auth/fitness.blood_glucose.read",
        ],
      };

      const authResult = await GoogleFit.authorize(options);
      if (!authResult.success) {
        return false;
      }

      // step count listener
      if (GoogleFit.startRecording) {
        GoogleFit.startRecording((result: any) => {
          if (result?.steps) {
            saveActivity(result.steps, new Date().toISOString());
          }
        });
      }

      // glucose listener (library support varies)
      if (GoogleFit.observeBloodGlucose) {
        GoogleFit.observeBloodGlucose((result: any) => {
          if (result?.value) {
            saveGlucose(result.value, result.startDate);
          }
        });
      }
    }

    return true;
  } catch (error) {
    console.warn("Health initialisation failed", error);
    return false;
  }
}

type Reading = {
  value: number;
  timestamp: string;
};

async function saveGlucose(value: number, timestamp: string): Promise<void> {
  await insert("glucose", { value, timestamp });
}

async function saveActivity(steps: number, timestamp: string): Promise<void> {
  await insert("activity", { value: steps, timestamp });
}

async function insert(table: string, reading: Reading): Promise<void> {
  try {
    const { error } = await supabase.from(table).insert(reading);
    if (error) {
      console.error("Supabase insert error", error);
    }
  } catch (e) {
    console.error("Supabase insert failed", e);
  }
}
