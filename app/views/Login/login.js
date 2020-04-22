import React from 'react';
import { SafeAreaView, Image, StyleSheet, TextInput, Text, Alert, ActivityIndicator } from 'react-native';
import { Footer, Container, Content, Input, View } from 'native-base';
import CustomFooter from '../../containers/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomButton from '../../containers/button';
import { StackActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import { PRIMARYCOLOR } from '../../constants/colorConstants';

export default class Login extends React.Component {
    constructor(props){
        super(props);
        this.state={
            loginChecked:true,
            email:'',
            password:'',
            loading:false
        }
        this.reference = database().ref('users');

    }
    onAuthChanged = (user) => {
        const scope = this;
        if (user) {
            // console.log(user);
            // this.reference.child(user.toJSON().uid).set({
            //     name,
            //     email,
            //     uid:user.toJSON().uid,
            //     createdAt: Date.now()
            // });

            scope.reference.child(user.toJSON().uid).once('value').then((snapshot)=>{
                // console.log(snapshot.val());
                AsyncStorage.setItem('USER',JSON.stringify(snapshot.val()));
                scope.props.navigation.dispatch(
                    StackActions.replace('Groups')
                );
            })
        }
    }

    componentDidMount() {
        this.subscriber = auth().onAuthStateChanged(this.onAuthChanged)
    }

    componentWillUnmount(){
        this.subscriber();
    }


    login(){
        // console.log('i am here',this.props.navigation);
        // this.props.navigation.navigate('Groups');
        // this.props.navigation.dispatch(
        //     StackActions.replace('Groups', {
        //       user: 'jane',
        //     })
        //   );
        const{ email, password}= this.state;
        if(email && email.length && password && password.length){
            this.setState({loading:true});
            auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log('User account created & signed in!');
            })
            .catch(error => {
                this.setState({loading:false});
                if (error.code === 'auth/wrong-password') {
                Alert.alert('The password is invalid.!');
                }else if (error.code === 'auth/user-not-found'){
                    Alert.alert('User doesnt exist');
                }else{
                    Alert.alert('Please! try again later');
                    
                }
                console.log(error);
            });
        }else{
            Alert.alert('Please! fill all the fields.');

        }
    }
    
    render() {
        const {email, password, loading } = this.state;
        return (
            <View style={styles.container} >
                
                <Image source={require('../../assets/login.png')} style={styles.image} resizeMode={'contain'} />
                    <TextInput
                    style={styles.textInput}
                    placeholder={'Email'}
                    keyboardType={'email-address'}
                    onChangeText={(value)=>{
                        this.setState({email:value});
                    }}
                    value={email}
                    />
                    <TextInput
                    style={[styles.textInput, {marginTop:20}]}
                    placeholder={'Password'}
                    secureTextEntry={true}
                    onChangeText={(value)=>{
                        this.setState({password:value});
                    }}
                    value={password}

                    />

                    <TouchableOpacity style={{marginTop:15}} onPress={()=>{this.props.navigation.navigate('ForgotPassword')}}>
                    <Text style={{color:'#5F5F5F'}}>
                    Forgot your password?
                    </Text>
                    </TouchableOpacity>
                    <View style={{justifyContent:'center', alignItems:'center', marginTop:60}}>
                    {!loading?
                          <CustomButton text={'Login'} onPress={()=>{this.login()}}/>
                          :
                          <ActivityIndicator size={'large'} color={PRIMARYCOLOR}/>
                    }
                    </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    image:{
        width:200,
        height:200,
        alignSelf:'center'
    },
    container:{
        flex:1,
        justifyContent:'center',
        padding:25,
    },
    textInput:{
        borderColor:'#5F5F5F',
        borderWidth:1,
        borderRadius:20,
        color:'#5F5F5F',
        paddingHorizontal:20,

    }
})