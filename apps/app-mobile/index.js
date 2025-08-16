import 'expo-router/entry';
import { registerPushToken } from './src/api/notifications';

registerPushToken().catch(() => {});
