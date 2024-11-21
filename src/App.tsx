import 'react-native-gesture-handler'; // 최상단에 추가
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MemberNavigator from './navigation/Stack/MemberNavigator.js';
import { Provider } from 'react-redux';
import store from './store/store.js';
import messaging from '@react-native-firebase/messaging';
import ReusableModal from './components/modal/ReusableModal.js';


const Stack = createStackNavigator();

function App() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [notificationData, setNotificationData] = React.useState({
    title: '',
    content: '',
  });

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log("Foreground notification received");
      if (remoteMessage.notification?.title && remoteMessage.notification?.body) {
        setNotificationData({ title: remoteMessage.notification.title, content: remoteMessage.notification.body });
        setIsModalVisible(true);
      }
    });

    return unsubscribe;
  }, []);

  const onCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Provider store={store}>
      <NavigationContainer>
        <MemberNavigator />
        <ReusableModal
          isVisible={isModalVisible}
          onClose={onCloseModal}
          title={notificationData.title}
          content={notificationData.content}
        />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
