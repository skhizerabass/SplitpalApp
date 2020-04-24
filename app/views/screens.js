import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from './Splash';
import Auth from './Login';
import GroupView from './Group';
import Account from './Account';
import GroupChat from './GroupChat';
import GroupInformation from './GroupInfo';
import AddUser from './AddUsers';
import CreateGroup from './CreateGroup';
import AddCard from './AddCard';
import ForgotPassword from './ForgetPassword';
import EditGroup from './EditGroup';
import TermsAndCondition from './Login/TermsAndCondition';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash"  screenOptions={{headerShown:false}}>

      <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Auth" component={Auth} />
        <Stack.Screen name="Groups" component={GroupView} />
        <Stack.Screen name="AccountInformation" component={Account} />
        <Stack.Screen name='GroupChat' component={GroupChat}/>
        <Stack.Screen name='GroupInformation' component={GroupInformation}/>
        <Stack.Screen name='CreateGroup' component={CreateGroup}/>
        <Stack.Screen name='AddUser' component={AddUser}/>
        <Stack.Screen name='AddCard' component={AddCard}/>
        <Stack.Screen name='ForgotPassword' component={ForgotPassword}/>
        <Stack.Screen name='EditGroup' component={EditGroup}/>
        <Stack.Screen name='TermsAndCondition' component={TermsAndCondition}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;