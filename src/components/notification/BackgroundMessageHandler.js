import notifee from '@notifee/react-native';

export const backgroundMessageHandler = (message) => {
  console.log("message", message);
  const { collapseKey, data, from, messageId, notification, originalPriority, priority, sentTime, ttl } = message;
  console.log("notification: ", notification.title, notification.body);

  return notifee.displayNotification({
    title: notification.title,
    body: notification.body,
  });
};