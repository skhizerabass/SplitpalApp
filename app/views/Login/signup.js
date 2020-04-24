import React from 'react';
import { SafeAreaView, Image, StyleSheet, TextInput, Text, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { Footer, Container, Content, Input, View, Switch } from 'native-base';
import CustomFooter from '../../containers/footer';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CustomButton from '../../containers/button';
import { StackActions } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import { PRIMARYCOLOR } from '../../constants/colorConstants';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginChecked: true,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            username:'',
            loading: false,
            terms:false
        }
        this.reference = database().ref('users');
    }

    onAuthChanged = (user) => {
        const {name,email, username} = this.state;
        const scope = this;
        if (user) {
            // console.log(user);
            this.reference.child(user.toJSON().uid).set({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                uid:user.toJSON().uid,
                username: username.toLowerCase().trim(),
                createdAt: Date.now()
            });
            AsyncStorage.setItem('USER',JSON.stringify({name,email,uid:user.toJSON().uid}));
            scope.props.navigation.dispatch(
                StackActions.replace('Groups')
              );
        }
    }

    componentDidMount() {
        this.subscriber = auth().onAuthStateChanged(this.onAuthChanged)
    }

    componentWillUnmount(){
        this.subscriber();
    }

    signup() {
        // this.props.navigation.dispatch(
        //     StackActions.replace('Groups')
        //   );
        const { name, email, password, confirmPassword, username } = this.state;
        if (name.length && email.length && password.length && confirmPassword.length && username.length ) {

            if (password === confirmPassword) {
                this.setState({loading:true});
                auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        console.log('User account created & signed in!');
                    })
                    .catch(error => {
                        this.setState({loading:false});
                        if (error.code === 'auth/email-already-in-use') {
                            // console.log('That email address is already in use!');
                            Alert.alert('Email Not Available!','That email address is already in use!')
                        }

                        else if (error.code === 'auth/invalid-email') {
                            console.log('That email address is invalid!');

                            Alert.alert('Invalid Email!','That email address is invalid!')
                        }else if (error.code === 'auth/weak-password'){
                            Alert.alert('Password too week!','Password should be atleast 6 characters!')

                        }

                        // console.log(error);

                    });
            }else{
                Alert.alert('Password!','Passwords should be same!');
            }
        }

    }

    render() {
        const { loginChecked, loading, terms } = this.state;
        return (
            <View style={styles.container} >
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 24, marginHorizontal: 20, marginVertical: 10, color: '#000000' }}>
                        Sign up for SplitPal
                </Text>
                </View>
                <View style={{ flex: 4, marginTop: '35%', justifyContent: 'center' }}>
                    <TextInput
                        style={styles.textInput}
                        placeholder={'Full name'}
                        keyboardType={'default'}
                        onChangeText={(text) => { this.setState({ name: text }) }}
                    />
                    <TextInput
                        style={[styles.textInput,{marginTop:20}]}
                        placeholder={'Username'}
                        keyboardType={'default'}
                        onChangeText={(text) => { this.setState({ username: text }) }}
                    />
                    <TextInput
                        style={[styles.textInput, { marginTop: 20 }]}
                        placeholder={'Email'}
                        keyboardType={'email-address'}
                        onChangeText={(text) => { this.setState({ email: text }) }}

                    />
                    <TextInput
                        style={[styles.textInput, { marginTop: 20 }]}
                        placeholder={'Password'}
                        secureTextEntry={true}
                        onChangeText={(text) => { this.setState({ password: text }) }}

                    />
                    <TextInput
                        style={[styles.textInput, { marginTop: 20 }]}
                        placeholder={'Confirm Password'}
                        secureTextEntry={true}
                        onChangeText={(text) => { this.setState({ confirmPassword: text }) }}

                    />
                    <View style={{ flexDirection:'row', marginHorizontal:20, justifyContent: 'center', alignItems: 'flex-start', marginTop: 20 }}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{this.props.navigation.navigate('TermsAndCondition')}}>
                        <Text>I have read and accept the User Agreement and Privacy Policy</Text>
                    </TouchableOpacity>
                    <Switch
                        thumbColor={PRIMARYCOLOR}
                        trackColor={PRIMARYCOLOR}
                        onTintColor={PRIMARYCOLOR}
                        onValueChange={(value)=>{
                            this.setState({terms:value})
                        }}
                        value={terms}
                    />
                    </View>


                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                    {loading?
                        <ActivityIndicator size={'large'}  color={PRIMARYCOLOR}/>:
                        <CustomButton disabled={!terms} text={'Sign up'} onPress={() => { this.signup() }} />
                    }
                    </View>
                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: 300,
        height: 300,
        alignSelf: 'center'
    },
    container: {
        flex: 1,
        padding: 25,
    },
    textInput: {
        borderColor: '#5F5F5F',
        borderWidth: 1,
        borderRadius: 20,
        color: '#5F5F5F',
        paddingHorizontal: 20,
        width: '100%',
        paddingVertical:Platform.OS==='ios'?15:10
    }
})