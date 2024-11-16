import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';

export const useFcmToken = () => {
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await messaging().getToken();
        setFcmToken(token);
        console.log('FCM Token:', token);
      } catch (error) {
        console.error('Error fetching FCM token:', error);
      }
    };

    fetchToken();
  }, []);

  return fcmToken;
};