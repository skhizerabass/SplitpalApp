import "react-native-gesture-handler";
import React from 'react';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import CreateAppNavigator from './app/views/screens';
import { StyleProvider } from "native-base";
import getTheme from './native-base-theme/components';
import platformT from './native-base-theme/variables/platform';
import messaging from '@react-native-firebase/messaging';

async function registerAppWithFCM() {
  await messaging().registerDeviceForRemoteMessages();
}

const ConnectedApp = () => {
    registerAppWithFCM();
    return (
        <StyleProvider style={getTheme(platformT)}>

                <CreateAppNavigator />
        
        </StyleProvider>

    )
}


AppRegistry.registerComponent(appName, () => ConnectedApp);