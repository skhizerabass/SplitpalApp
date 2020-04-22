import React from 'react';
import { View, Image, StatusBar } from 'react-native';
import { BGCOLOR } from '../constants/colorConstants';
import { StackActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
saveToken=async ()=>{
    try{
        const fcmToken = await messaging().getToken();
        await AsyncStorage.setItem('TOKEN',fcmToken);
        database().ref('users').child(auth().currentUser.uid).child('tokens').set({[fcmToken]:Date.now()});
    }catch(ex){
        console.log(ex);
    }
}

const Splash=(props) => {
    setTimeout(()=>{
        if(auth().currentUser)
        {           
                saveToken();
                 props.navigation.dispatch(
                    StackActions.replace('Groups')
                );
        }else{
            props.navigation.dispatch(
                StackActions.replace('Auth')
            );
        
        }
    },1000)


    return(
        <>
            <StatusBar backgroundColor={BGCOLOR} barStyle={'dark-content'}/>
        <View style={{flex:1, backgroundColor: BGCOLOR, alignItems:'center', justifyContent:'center'}}>
            <Image source={require('../assets/Rectangle_new.png')} style={{flex:1,width:'100%',height:500}} resizeMode={'contain'}/>
        </View>
        </>
    )
}
export default Splash;