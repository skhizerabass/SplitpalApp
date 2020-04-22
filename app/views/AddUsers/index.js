import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
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
import UserItem from '../../containers/user';
import {getDateInUTCWithoutHours} from '../../utils/generalFunc'
export default class AddUser extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            group: this.props.route.params.group,
            searching: false,
            user: null

        };

    }

    componentDidMount() {
        const { group } = this.props.route.params;
        const scope = this;
        this.subscribe = database().ref('groups').child(group.key)
        this.subscribe.on('value', (snapshot) => {
            scope.setState({ group: snapshot.val() })
        })
    }

    componentWillUnmount() {
        this.subscribe.off('value', () => { })
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
                    {this.props.searching ? 'Searching for user..' : 'Add users to group'}
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

    searchUser = () => {
        const { email } = this.state;
        this.setState({ searching: true });
        console.log('called me?');
        const scope = this;
        database().ref('users').orderByChild('email').equalTo(email).once('value').then((snapshot) => {
            if (snapshot && snapshot.val()) {
                snapshot.forEach((childSnapshot) => {
                    scope.setState({ user: childSnapshot.val(), searching: false })
                })
            } else {
                scope.setState({ user: 'not', searching: false })
            }
        })
    }

    addMember() {
        const { email, user, group } = this.state;
        let date = getDateInUTCWithoutHours(new Date(group.date));
        if (group.cycle === 'Weekly') {
            date.setDate(date.getDate() - 3);
        } else {

            date.setDate(date.getDate() - 14);
        }

        if (group.uid !== user.uid) {
            if (group.members && group.members[user.uid]) {
                console.log(group.members[user.uid].joinedAt,'  :  ',date.getTime())

                if(group.members[user.uid].joinedAt<date.getTime()){
                    alert('User has been removed from the group.');
                    database().ref(`groups/${group.key}`).child('members').child(user.uid).set(null);
                    database().ref(`users/${user.uid}`).child('groups').child(group.key).set(null);
                }else{
                    Alert.alert(
                        "Confirmation!",
                        "If you press yes. this user will not be charged for monthly subscription",
                        [
                          {
                            text: "No",
                            onPress: () => {
                                // database().ref(`groups/${group.key}`).child('members').child(user.uid).set(null);
                                // database().ref(`users/${user.uid}`).child('groups').child(group.key).set(null);
                         
                            },
                          },
                          { text: "Yes", onPress: () =>{
                          database().ref(`groups/${group.key}`).child('members').child(user.uid).set(null);
                          database().ref(`users/${user.uid}`).child('groups').child(group.key).set(null);
                        }
                      },
                        ],
                        { cancelable: false }
                      );
                  
                }

            } else {
                // console.log('wow');
                if (group.members && Object.keys(group.members).length + 1 >= 10) {

                    alert('Limit has been reached');
                } else {

                    database().ref(`groups/${group.key}`).child('members').child(user.uid).set({ joinedAt: Date.now() });
                    database().ref(`users/${user.uid}`).child('groups').child(group.key).set({ joinedAt: Date.now() });
                    alert(user.name + ' has been added into the group.');
                }
            }
            // console.log('u mean  me?');
        }
    }

    render() {
        const { email, user, group } = this.state;
        return (
            <Container>
                {this.headerWithoutSearch()}

                <Content contentContainerStyle={{}}>
                    <TextInput
                        style={[styles.textInput, { marginTop: 20, marginBottom: 20, marginLeft: 20, marginRight: 20 }]}
                        placeholder={'Email'}
                        onChangeText={(text) => { this.setState({ email: text }) }}
                        value={email}

                    />

                    <View style={{ alignItems: 'center', margin: 20 }}>
                        <CustomButton text={'Search'} onPress={() => { this.searchUser() }} />
                    </View>
                    {user === 'not' ?
                        <Text style={{ fontSize: 16, fontFamily: THEME_FONT, marginTop: 20, textAlign: 'center', color: PRIMARYCOLOR }}>
                            User not Available
                            </Text> :
                        user ?
                            <UserItem
                                item={{ ...user, leader: group.uid === user.uid, member: group.members && group.members[user.uid] }}
                                onPress={() => {
                                    this.addMember();
                                }}
                            /> : null
                    }
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

        paddingVertical:Platform.OS==='ios'?15:10
    }
})