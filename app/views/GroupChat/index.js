import React from 'react';
import { SafeAreaView, StatusBar, FlatList, Share } from 'react-native';
import { Footer, Container, Content, Header, View, Text, Icon, Input } from 'native-base';
import CustomFooter from '../../containers/footer';
import CustomHeader from '../../containers/header';
import GroupItem from '../../containers/groupItem';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import FabBtnCheck from '../../containers/fabBtnCheck';
import { TextInput } from 'react-native-gesture-handler';
import { PRIMARYDARK, PRIMARYCOLOR } from '../../constants/colorConstants';
import ChatItem from '../../containers/chat';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { calculateAmount } from '../../utils/generalFunc';

export default class GroupChat extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        const {group} = this.props.route.params;

        this.state = {
            leftChecked: true,
            search: false,
            group,
            uid: auth().currentUser.uid,
            chat: [
               
            ],
            users:[]
        };

    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    renderMenu() {
        return (
            <Menu
                ref={this.setMenuRef}
            >
                <MenuItem onPress={() => {
                    this.hideMenu();
                    this.props.navigation.navigate('GroupInformation',  {group:this.props.route.params.group}
                    );
                }}>Group Information</MenuItem>
                <MenuItem onPress={() => {
                    this.hideMenu();
                    this.onShare();
                }}>Share</MenuItem>
            </Menu>
        )
    }

    onShare = async () => {
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

    componentDidMount(){
        const {group} = this.props.route.params;
        const scope = this;
        this.subscribe=database().ref('groups').child(group.key)
        this.subscribe.on('value',(snapshot)=>{
            // console.log('Nop');

            scope.setState({group:snapshot.val()});
            scope.getUsers()
        });
        this.subscribeChat=database().ref('chat').child(group.key).orderByChild('createdAt')
        this.subscribeChat.on('value',(snapshot)=>{
                let chat = [];
                snapshot.forEach(childSnapshot=>{
                    chat.push(childSnapshot.val());
                    // console.log(childSnapshot.val());
                    scope.getUser(childSnapshot.val().from);
                    //  chat.sort((a,b)=>b<a);
                })
                chat.sort((a,b)=>a>b);
                scope.setState({chat:chat});

            // scope.getUsers()
        });
    }

    getUser=async (uid)=>{
        const {users} = this.state;
        const scope = this;
        console.log(uid);
        if(!users[uid]){
            // database().ref('users').child(uid).once('value').then((snapshot)=>{
            //     users[snapshot.val().uid] = snapshot.val();
            //     scope.setState({users:JSON.parse(JSON.stringify(users))})
            // })
        }
    }

    getUsers=async ()=>{
        let {group} = this.state;
        const users ={};
        let userPromises =[];
        // console.log('mustBe Called Once');
        if(group.members){
            Object.keys(group.members).forEach(element=>{
                
                userPromises.push(database().ref('users').child(element).once('value').then((snapshot)=>{
                    users[snapshot.val().uid] = snapshot.val();
                }));
            })
    
        }

        userPromises.push(database().ref('users').child(group.uid).once('value').then((snapshot)=>{
            users[snapshot.val().uid] = snapshot.val();
        }));
        await Promise.all(userPromises);
        this.setState({users})
    }

    componentWillUnmount(){
        this.subscribe.off('value',()=>{})
        this.subscribeChat.off('value',()=>{})

    }


    renderChat = ({ item, index }) => {
        let {chat} = this.state
        let repeat = false;
        let {users} = this.state;
        if(index>0 && chat[index-1].from === item.from)
            repeat = true;
        let showUserInfo = true;
        if(index > 0 && chat.length-1 > index && chat[index+1].from === item.from)
            showUserInfo = false
        let user= users[item.from];

        let sent = this.state.uid=== item.from;
        // console.log(user);
        return (
            <ChatItem
                item={{...item, repeat, 
                    user:user?user.name : 'N/A',
                    sent}
                }

                user={user}
                showUserInfo ={showUserInfo}

            />
        )
    }


    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    sendMessage=()=>{
        const { message, group, uid } = this.state;
        if(message.trim().length){
            let key = database().ref('chat').child(group.key).push().key;
            let chatMessage = {
                key,
                message:message.trim(),
                from: uid,
                createdAt:Date.now()
            }
            database().ref('chat').child(group.key).child(key).set(chatMessage);
            this.setState({message:''});
        }
    }

    render() {
        const { leftChecked, chat, message, group } = this.state;
        let members = group.members;
        let membersCount = members? Object.keys(members).length + 1 : 1;
    
        return (
            <Container>
                <Header style={{ backgroundColor: PRIMARYCOLOR, alignItems:'center' }}>
                    <StatusBar backgroundColor={PRIMARYDARK} barStyle={'light-content'} />
                    <View>
                        <Icon onPress={() => this.props.navigation.pop()} type={'MaterialCommunityIcons'} name={'arrow-left'} style={{ fontSize: 26, color: '#FFF' }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#FFF', fontFamily: THEME_BOLD_FONT, fontSize: 20, marginLeft: 15 }}>
                            {group.name.toUpperCase()}
                </Text>
                        <Text style={{ color: '#FFF', fontFamily: THEME_FONT, fontSize: 12, marginLeft: 15, marginTop:2 }}>
                        Estimated Cost <Text style={{fontSize:14, color:'white'}}>$ {group.amount?calculateAmount(group.amount,membersCount):'0'}</Text>
                    </Text>
                    </View>
                    <View>
                    <Icon onPress={() => this.showMenu()} type={'MaterialCommunityIcons'} name={'dots-vertical'} style={{ fontSize: 24, color: '#FFF' }} />
                    {this.renderMenu()}
                    </View>
                </Header>
                <View style={{flex:1, justifyContent:'flex-end'}}>
                    <FlatList
                    inverted={true}
                        data={chat}                        
                        renderItem={this.renderChat}
                    />
                    </View>
                <Footer style={{borderWidth:0,  borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: 'white', elevation:0}}>
                    <View style={{ borderTopLeftRadius: 25, borderTopRightRadius: 25, backgroundColor: 'white', flexDirection: 'row', alignItems:'center', paddingHorizontal:20, flex: 1, elevation: 10 }}>
                        <TextInput
                            placeholder={'Send a message'}
                            style={{ flex: 1, fontSize: 16, color: '#000000', fontFamily: THEME_FONT, marginHorizontal:5 }}
                            onChangeText={(value) => {
                                this.setState({message:value});
                            }}
                            value={message}
                            />

                        <Icon onPress={
                            this.sendMessage
                        } name={'send'} type={'MaterialCommunityIcons'} style={{fontSize:28, color:PRIMARYCOLOR}}/>
                    </View>
                </Footer>

            </Container>
        )
    }
}