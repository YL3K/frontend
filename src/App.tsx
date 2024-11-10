import 'react-native-gesture-handler'; // 최상단에 추가
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainStackNavigator from './navigation/MainStackNavigator.js';
import { Provider } from 'react-redux';
import store from './store/store.js';

const Stack = createStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
