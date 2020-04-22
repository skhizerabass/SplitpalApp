import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { Footer, Container, Content, Header, View, Text, Icon, Input, Thumbnail } from 'native-base';
import CustomFooter from '../../containers/footer';
import CustomHeader from '../../containers/header';
import GroupItem from '../../containers/groupItem';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import FabBtnCheck from '../../containers/fabBtnCheck';
import { PRIMARYCOLOR } from '../../constants/colorConstants';
import { Dialog } from 'react-native-simple-dialogs';
import { TextInput } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import CustomButton from '../../containers/button';
import RNPickerSelect from 'react-native-picker-select';

const data = [{
    label: 'Weekly', value: 'Weekly',
}, {
    label: 'Monthly', value: 'Monthly',
}];
export default class ForgotPassword extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        this.state = {
            email: ''
        };



    }

    setMenuRef = ref => {
        this._menu = ref;
    };


    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    headerWithoutSearch = () => (
        <Header style={{ flexDirection: 'row', height: 70, alignItems: 'center', marginHorizonta: 10 }}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />

            <View>
                <Icon onPress={() => this.props.navigation.pop()} type={'MaterialCommunityIcons'} name={'arrow-left'} style={{ fontSize: 26, color: '#000' }} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 24, marginLeft: 15 }}>
                    Forgot Password ?
            </Text>
            </View>
        </Header>
    )
    changeName = () => {
        this.setState({ dialogVisible: true, title: 'Change Name', content: 0 });
    }


    hideDialog = () => {
        this.setState({ dialogVisible: false })
    }


    getEmail = () => {
        const { email } = this.state;
        const scope = this;
        if (email) {
            this.setState({ loading: true });
            auth().sendPasswordResetEmail(email).then(() => {
                Alert.alert("Email Sent!",
                "Please check your email and follow the instructions to change your password.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                        scope.props.navigation.pop();
                    },
                  },
               
                ],
                { cancelable: false }
              );
            }).catch(e => {
                this.setState({ loading: false });

                // console.log(e.message);
                if(e.code === 'auth/invalid-email')
                   Alert.alert('Invalid email address');
                else if(e.code === 'auth/user-not-found')
                    Alert.alert('Email address not found. Please signup')
                else
                    Alert.alert('Something went wrong. Please try again later.')

            })
        } else {
            Alert.alert('Please enter your email');
        }
    }


    render() {
        const { email, loading } = this.state;
        return (
            <Container>
                {this.headerWithoutSearch()}
                <View style={{ padding: 20, flex: 1}}>
                    <Image source={require('../../assets/login.png')} style={styles.image} resizeMode={'contain'} />

                    <Text style={{ fontSize: 14, marginTop: 20, color: '#000', textAlign: 'center' }}>
                        Enter your email to get instructions  to change your password.
                    </Text>

                    <TextInput
                        style={[styles.textInput, { marginTop: 10 }]}
                        placeholder={'Enter your email here.'}
                        onChangeText={(text) => { this.setState({ email: text }) }}
                        value={email}

                    />

                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                    {loading?
                        <ActivityIndicator size={'large'} color={PRIMARYCOLOR}/>
                    :
                        <CustomButton text={'Get Email'} onPress={() => { this.getEmail() }} />
                    }
                    </View>
                </View>


            </Container>
        )
    }
}


const styles = StyleSheet.create({
    image: {
        width: 300,
        height: 200,
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

    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderColor: '#5F5F5F',
        borderWidth: 1,
        borderRadius: 20,
        color: '#5F5F5F',
        paddingHorizontal: 20,
        width: '100%',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderWidth: 1,
        color: '#5F5F5F',
        borderRadius: 8,
        color: 'black',
        width: '100%',
        borderColor: '#5F5F5F',

    },
})
