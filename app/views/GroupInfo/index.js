import React from 'react';
import { SafeAreaView, StatusBar, FlatList } from 'react-native';
import { Footer, Container, Content, Header, View, Text, Icon, Input } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import { PRIMARYDARK, PRIMARYCOLOR } from '../../constants/colorConstants';
import UserItem from '../../containers/user';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { calculateAmount, totalAmount } from '../../utils/generalFunc';


export default class GroupInformation extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        let uid = auth().currentUser.uid;
        this.state = {
            leftChecked: true,
            search: false,
            uid,
            group:this.props.route.params.group,  
        };
    }
    componentDidMount(){
        const {group} = this.props.route.params;
        const scope = this;
        this.subscribe=database().ref('groups').child(group.key)
        this.subscribe.on('value',(snapshot)=>{
            scope.setState({group:snapshot.val()});
            scope.getUsers()
        });
    }
    getUsers=async ()=>{
        let {group} = this.state;
        const users =[];
        let userPromises =[];
        if(group.members){
            Object.keys(group.members).forEach(element=>{
                userPromises.push(database().ref('users').child(element).once('value').then((snapshot)=>{
                    users.push(snapshot.val());
                }));
            })
    
        }

        userPromises.push(database().ref('users').child(group.uid).once('value').then((snapshot)=>{
            users.push(snapshot.val());
        }));
        await Promise.all(userPromises);
        this.setState({users})
    }

    componentWillUnmount(){
        this.subscribe.off('value',()=>{})
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    removeUser(){
        const{ group,uid } = this.state;

        database().ref(`groups/${group.key}`).child('members').child(uid).set(null);
        database().ref(`users/${uid}`).child('groups').child(group.key).set(null);
        this.props.navigation.pop(2);
    }

    renderMenu() {
        const{ group,uid } = this.state;
        return (
            <Menu
                ref={this.setMenuRef}
            >
            {group.uid === uid?
                <>
                <MenuItem onPress={() => {
                    this.hideMenu();
                    this.props.navigation.navigate('AddUser',{group} );
                }}>Add Users</MenuItem>
                <MenuItem onPress={() => {
                    this.hideMenu();
                    this.props.navigation.navigate('EditGroup',{group} );
                }}>Settings</MenuItem>
                </>
                :
                <MenuItem onPress={() => {
                    this.removeUser();
                }}>Leave Group</MenuItem>
             
            }
            </Menu>
        )
    }

    renderUser = ({ item }) => {
        const {group} = this.state;
        return (
            <UserItem
            item={{...item, leader:group.uid=== item.uid,member:group.members && group.members[item.uid] }}
            onPress={()=>{}}
            />
        )
    }


    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    getDate(date){
        let d = new Date(date);
        return d.getFullYear()+' / '+(d.getMonth()+1)+' / '+d.getDate();
    }

    render() {
        const {  users, group } = this.state;
        let members = group.members;
        let membersCount = members? Object.keys(members).length + 1 : 1;
     
        return (
            <Container>
                <Header style={{ backgroundColor: PRIMARYCOLOR, alignItems: 'center' }}>
                    <StatusBar backgroundColor={PRIMARYDARK} barStyle={'light-content'} />
                    <View>
                        <Icon onPress={() => this.props.navigation.pop()} type={'MaterialCommunityIcons'} name={'arrow-left'} style={{ fontSize: 26, color: '#FFF' }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#FFF', fontFamily: THEME_BOLD_FONT, fontSize: 20, marginLeft: 15 }}>
                            {group.name.toUpperCase()}
                </Text>
                        <Text style={{ color: '#FFF', fontFamily: THEME_FONT, fontSize: 12, marginLeft: 15, marginTop: 2 }}>
                            Estimated Cost <Text style={{fontSize:14, color:'white'}}>$ {group.amount?calculateAmount(group.amount,membersCount):'0'}</Text>
                </Text>
                    </View>
                    <View>
                        <Icon onPress={() => this.showMenu()} type={'MaterialCommunityIcons'} name={'dots-vertical'} style={{ fontSize: 24, color: '#FFF' }} />
                        {this.renderMenu()}
                    </View>
                </Header>
                <Content>
                    <View style={{ paddingHorizontal: 15, paddingVertical: 20, borderBottomColor: 'rgba(0, 0, 0, 0.12)', borderBottomWidth: 0.9 }}>
                        <Text style={{ fontSize: 12, color: PRIMARYCOLOR }}>
                            Subscription
                        </Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.87)', marginTop:3 }}>
                            {group.subscription}
                        </Text>

                        <Text style={{ fontSize: 12, color: PRIMARYCOLOR, marginTop: 10 }}>
                            Billing Cycle
                    </Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.87)', marginTop:3 }}>
                            {group.cycle}
                    </Text>

                        <Text style={{ fontSize: 12, color: PRIMARYCOLOR, marginTop: 10 }}>
                            Next payment
                        </Text>
                        <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.87)', marginTop:3 }}>
                        {group.date? this.getDate(group.date):'N/A'}

                        </Text>
                     {   // <Text style={{ fontSize: 12, color: PRIMARYCOLOR, marginTop: 10 }}>
                        //     Payment Method
                        // </Text>
                        // <Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.87)', marginTop:3 }}>
                        //     N/A
                        // </Text>
                    }
                        <Text style={{ fontSize: 12, color: PRIMARYCOLOR, marginTop: 10 }}>
                            Total Payment
                        </Text>
                        <Text style={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.87)', marginTop:3, fontFamily:THEME_BOLD_FONT, alignItems:'center' }}>
                            $ {group.amount? totalAmount(group.amount):'0'}
                            {group.amount?<Text style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.87)', marginTop:3, fontFamily:THEME_FONT }}>
                            {' ( $'+  group.amount + ' +  20% Service fee ) '}</Text>:''}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 12, color: PRIMARYCOLOR, marginTop: 10, padding:15 }}>
                        {group.members?Object.keys(group.members).length+1:1} members (10 max)
                    </Text>
                    <FlatList
                        data={users}
                        renderItem={this.renderUser}
                    />
                </Content>

            </Container>
        )
    }
}