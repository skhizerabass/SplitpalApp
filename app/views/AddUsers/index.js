import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator, Share } from 'react-native';
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
            user: null,
            users:[],
            username:''

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

    searchUser = async (email,type) => {

        this.setState({ searching: true, user:null });
        const scope = this;
        if(email.trim().length){
        if(this.search){
           await  this.search.off('value',()=>{console.log('OFF')});
        }
        if(type === 'email'){
            this.search = database().ref('users').orderByChild('email').startAt(email);
        }
        else{
            this.search = database().ref('users').orderByChild('username').startAt(email);

        }  
         this.search.on('value',(snapshot) => {
            let users =[];
            
            if (snapshot && snapshot.val()) {
                
                snapshot.forEach((childSnapshot) => {
                    if(childSnapshot.val().email.includes(email) ||( childSnapshot.val().username && childSnapshot.val().username.includes(email) ) )
                    // console.log('wow');
                    // scope.setState({ user: childSnapshot.val(), searching: false })
                       users.push(childSnapshot.val());
                })
            }
            if(!users.length)
               scope.setState({ user: 'not', searching: false })
            scope.setState({ users, searching: false })

        })
    }
    }

    componentWillUnmount(){
        try{
            this.subscribe.off('value', () => { })
    
            this.search.off('value',()=>{})

    }catch(e){

    }
    }

    addMember(user) {
        const { email, group } = this.state;
        let date = getDateInUTCWithoutHours(new Date(group.date));
        if (group.cycle === 'Weekly') {
            date.setDate(date.getDate() - 3);
        } else {

            date.setDate(date.getDate() - 14);
        }

        if (group.uid !== user.uid) {
            if (group.members && group.members[user.uid]) {
                // console.log(group.members[user.uid].joinedAt,'  :  ',date.getTime())
                
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
                    if(user.card){

                        database().ref(`groups/${group.key}`).child('members').child(user.uid).set({ joinedAt: Date.now() });
                        database().ref(`users/${user.uid}`).child('groups').child(group.key).set({ joinedAt: Date.now() });
                    }else{
                        alert("Please! Ask user to connect a card to join this group. ");

                    }
                    // alert(user.name + ' has been added into the group.');
                }
            }
            // console.log('u mean  me?');
        }
    }
    async shareViaLink(){

            const {group} = this.props.route.params;
    
            try {
              const result = await Share.share({
                message: 'Join group on https://split.pal/?group='+group.key
                 });
        
              if (result.action === Share.sharedAction) {
                if (result.activityType) {
                  // shared with activity type of result.activityType
                } else {
                  // shared
                }
              } else if (result.action === Share.dismissedAction) {
                // dismissed
              }
            } catch (error) {
              alert(error.message);
            }
          };
    
    

    render() {
        const { searching,email, user, group, users, username } = this.state;
        return (
            <Container>
                {this.headerWithoutSearch()}

                <Content contentContainerStyle={{}}>
                <View style={[{flexDirection:'row',alignItems:'center'}, styles.textInput]}>
                    <TextInput
                        style={{flex:1}}
                        placeholder={'Search by Email...'}
                        onChangeText={(text) => { this.setState({ email: text }) }}
                        value={email}

                    />
                    <Icon
                        onPress={() => { this.searchUser(email.toLowerCase(),'email') }}
                        style={{width:40, height:40, padding:5, borderRadius:20, justifyContent:'center', backgroundColor:PRIMARYCOLOR, color:'#FFF'}}
                        name={'magnify'}
                        type={'MaterialCommunityIcons'}
                    />
                </View>

                <View style={[{flexDirection:'row',alignItems:'center', marginTop:10}, styles.textInput]}>
                <TextInput
                    style={{flex:1}}
                    placeholder={'Search by Username...'}
                    onChangeText={(text) => { this.setState({ username: text }) }}
                    value={username}

                />
                <Icon
                    onPress={() => { this.searchUser(username.toLowerCase(),'username') }}
                    style={{width:40, height:40, padding:5, borderRadius:20, justifyContent:'center', backgroundColor:PRIMARYCOLOR, color:'#FFF'}}
                    name={'magnify'}
                    type={'MaterialCommunityIcons'}
                />
            </View>
            
                <TouchableOpacity
                style={{ justifyContent:'center',alignItems: 'center', margin: 20, flex:1, flexDirection:'row',borderRadius:20, padding:20, backgroundColor:PRIMARYCOLOR }} 
                onPress={() => { this.shareViaLink() }} >
                    <Text style={{color:'white', fontSize:20}}>Share Via Link</Text>
                </TouchableOpacity>
            
            {searching?<ActivityIndicator size={'large'} color={PRIMARYCOLOR}/> :
                    user === 'not' ?
                        <Text style={{ fontSize: 16, fontFamily: THEME_FONT, marginTop: 20, textAlign: 'center', color: PRIMARYCOLOR }}>
                            User not Available
                            </Text> :
                        users.length ?
                        <FlatList
                            data={users}
                            renderItem={({item})=>{
                                const user = item;
                                return(
                            <UserItem
                                item={{ ...user, leader: group.uid === user.uid, member: group.members && group.members[user.uid] }}
                                type={'full'}
                                onPress={() => {
                                    this.addMember(user);
                                }}
                            />)}} />:null
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
        paddingHorizontal: 10,
        marginHorizontal:20,
        paddingVertical:Platform.OS==='ios'?10:5
    }
})