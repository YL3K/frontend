import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'
import HomeScreen from '../screens/HomeScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import LogoHeader from '../components/header/LogoHeader';
import HomeHeader from '../components/header/HomeHeader';
import RecordNavigator from '../navigation/Stack/RecordNavigator';

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 66,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          color: '#495057',
        },
        header: () => <LogoHeader />  // 전체 탭에 대해 상단바를 숨김
      }}
    >
      <Tab.Screen
        name="홈"
        component={HomeScreen}
        options={{
          header: () => <HomeHeader />,
          tabBarIcon: ({ color, size}) => (
            <Icon name="home" color='#495057' size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="금융상품"
        component={RecordNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="work" color='#495057' size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="자산관리"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="bar-chart" color='#495057' size={size} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen
        name="혜택"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="redeem" color='#495057' size={size} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
      <Tab.Screen
        name="상담데이터"
        component={AnalysisScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="analytics" color='#495057' size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});

export default MainTabNavigator;
