import { Alert } from 'react-native';

export const foregroundMessageHandler = (message) => {
  console.log("message", message);
  const { collapseKey, data, from, messageId, notification, originalPriority, priority, sentTime, ttl } = message;
  console.log("notification: ", notification.title, notification.body);

  return Alert.alert(notification.title, notification.body);
};