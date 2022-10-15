import React, {useContext} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import {AuthContext} from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {token} = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {token ? (
            <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <React.Fragment>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{headerShown: false}}
            />
          </React.Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
