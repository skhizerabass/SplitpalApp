import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Footer, Container, Content, Header, View, Text, Icon, Input, Thumbnail, DatePicker } from 'native-base';
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
   label:'Weekly', value: 'Weekly',
}, {
   label:'Monthly', value: 'Monthly',
}];
export default class CreateGroup extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            subscription: '',
            amount: 0,
            billingCycle: 'Monthly',
            chosenDate: new Date() };
        this.setDate = this.setDate.bind(this);
      }
      setDate(newDate) {
        this.setState({ chosenDate: newDate });
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
        <Header style={{ flexDirection: 'row', height: 70, alignItems: 'center', marginHorizontal: 10 }}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />

            <View>
                <Icon onPress={() => this.props.navigation.pop()} type={'MaterialCommunityIcons'} name={'arrow-left'} style={{ fontSize: 26, color: '#000' }} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 24, marginLeft: 15 }}>
                    Create New Group
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

    saveGroup = () => {
        let scope = this;
        const ref = database().ref('Group');
        const { name, subscription, amount,date, billingCycle } = this.state;
        if(name.length && subscription.length && amount.length){
            let key = ref.push().key;
            let uid = auth().currentUser.uid;
            let updates = {};
            let group = { name: name.toLowerCase().trim(), subscription: subscription.toLowerCase().trim(), amount, key, uid, createdAt: Date.now(),
                date:new Date(this.state.chosenDate).getTime(),
                cycle:billingCycle
                
            };

            updates[`users/${uid}/groups/${key}`] = { createdAt: Date.now(), joinedAt: Date.now(), leader: true };
            updates[`groups/${key}`] = group;
            database().ref().update(updates).then(() => {
                scope.props.navigation.pop();
                scope.props.navigation.navigate('AddUser', { group });
            })
        }else{
            Alert.alert('Please fill all the fields');
        }
    }
    getDate(){
       const {billingCycle} = this.state;
       let date = new Date();
        if (billingCycle === 'Monthly') {
            date.setMonth(date.getMonth() + 1);

        }
        else if (billingCycle === 'Weekly') {
            date.setDate(date.getDate() + 7);

        }
        return date;
    }

    render() {
        const { name, subscription, amount, billingCycle } = this.state;
        let date = this.getDate()
        return (
            <Container>
                {this.headerWithoutSearch()}

                <Content contentContainerStyle={{ padding: 20 }}>
                    <TextInput
                        style={[styles.textInput, { marginTop: 20 }]}
                        placeholder={'Group Name'}
                        onChangeText={(text) => { this.setState({ name: text }) }}
                        value={name}

                    />

                    <TextInput
                        style={[styles.textInput, { marginTop: 20 }]}
                        placeholder={'Subscription'}
                        onChangeText={(text) => { this.setState({ subscription: text }) }}
                        value={subscription}

                    />

                    <TextInput
                        style={[styles.textInput, { marginTop: 20 }]}
                        placeholder={'Amount'}
                        keyboardType={'decimal-pad'}
                        onChangeText={(text) => { this.setState({ amount: text }) }}
                        value={amount}
                    />
                    <View onPress={()=>{}} style={[{flex:1, marginTop:20 }]}>
                    <DatePicker
                    defaultDate={new Date()}
                    minimumDate={new Date()}
                    locale={"en"}
                    timeZoneOffsetInMinutes={undefined}
                    modalTransparent={false}
                    animationType={"fade"}
                    androidMode={"default"}
                    
                    placeHolderText="Select Subscription Date"
                    textStyle={[styles.textInput,{ color: PRIMARYCOLOR, paddingVertical:15 }]}
                    placeHolderTextStyle={[styles.textInput,{ color: PRIMARYCOLOR, paddingVertical:15 }]}
                    onDateChange={this.setDate}
                    disabled={false}
                    />
                    
                    </View>
                    <View style={[{ marginTop: 10, marginBottom:20, marginHorizontal:10 }]}>
                    <Text style={{marginBottom:Platform.OS === 'ios'?5:0}}>Billing Cycle:</Text>
                    <RNPickerSelect
                        onValueChange={(value) => this.setState({ billingCycle: value })}
                        items={data}
                        style={{
                            ...pickerSelectStyles,
                            iconContainer: {
                              top: 20,
                              right: 10,
                            },
                            placeholder: {
                              fontSize: 12,
                              fontWeight: 'bold',
                            },
                          }}
                          value={billingCycle}

                    />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <CustomButton text={'Create'} onPress={() => { this.saveGroup() }} />
                    </View>

                </Content>
              
            </Container>
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
        paddingVertical:Platform.OS === 'android'?10:15


    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderColor: '#5F5F5F',
        borderWidth: 1,
        borderRadius: 20,
        marginBottom:5,
        color: '#5F5F5F',
        paddingHorizontal: 20,
        width: '100%',
      },
      inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 20,
        borderWidth: 1,
        color: '#5F5F5F',
        borderRadius: 8,
        color: 'black',
        width: '100%',
        borderColor: '#5F5F5F',

      },
})

const pickerSelectStyles = StyleSheet.create({
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
        paddingVertical: 12,
        borderWidth: 2,
        color: '#5F5F5F',
        borderRadius: 8,

        color: 'black',
        width: '100%',
        borderColor: '#5F5F5F',

      },
  });
  