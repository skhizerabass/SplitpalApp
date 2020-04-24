import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Linking, Alert } from 'react-native';
import { Footer, Container, Content, Header, View, Text, Icon, Input } from 'native-base';
import CustomFooter from '../../containers/footer';
import CustomHeader from '../../containers/header';
import GroupItem from '../../containers/groupItem';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import FabBtnCheck from '../../containers/fabBtnCheck';
import { TextInput } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { PRIMARYCOLOR, PRIMARYTEXTCOLOR } from '../../constants/colorConstants';
import CardView from '../Card';
import { calculateAmount } from '../../utils/generalFunc';
import TransactionItem from '../../containers/transactionItem';
import AsyncStorage from '@react-native-community/async-storage';
import urlParse from 'url-parse';
import { requestHandler } from '../../utils/requestHandler';
import Account from '../Account';

export default class GroupView extends React.Component {
    _menu = null;
    dummyDeepLinkedUrl = null;

    constructor(props) {
        super(props);
        this.state = {
            leftChecked: 1,
            searching: true,
            groups: [],
            user:{},
            loading:true,
            transactions:[]
        };
        try{
        }catch(ex){
            
        }
    }
    getGroups= async (groupKeys)=>{
        let currentPromises =[];
        let groups = []
        
        this.setState({searching:true});
        groupKeys.forEach(element => {
           currentPromises.push(database().ref('groups').child(element).once('value').then((snapshot)=>{
               if(snapshot && snapshot.hasChildren())
                groups.push(snapshot.val());
           })
           )
           
        });
        await Promise.all(currentPromises);
        this.setState({
            groups,
            searching:false
        })
    }
    refreshGroups(){
        const {user} = this.state;
        this.setState({searching:true});   

        if(user.groups){
            this.getGroups(Object.keys(user.groups));
        }else{
            this.setState({searching:false})
        }
    }

    componentDidMount(){
        const scope = this;
        // requestHandler('test',{}).then(a=>{
        //     console.log(a);
        // }).catch(err=>{
        //     console.log(err);
        // });

        AsyncStorage.getItem('USER').then(value=>{
       let  u =JSON.parse(value);
        this.subscribe = database().ref('users').child(u.uid)
        this.subscribe.on('value',async (snapshot)=>{
            scope.setState({user: snapshot.val()})
            Linking.getInitialURL().then(url => {
                if(url && url != scope.dummyDeepLinkedUrl){
                    scope.dummyDeepLinkedUrl = url
                    scope.navigate(url);
                }
              });
              
            Linking.addEventListener('url', scope.handleOpenURL);
                if(snapshot){
                    if(snapshot.val().groups){
                        scope.getGroups(Object.keys(snapshot.val().groups));
                    
                    }else{
                        scope.setState({groups:[], searching:false})

                    }
                }else{
                    scope.setState({groups:[], searching:false})
                }

        })
    })
        this.getTransactions();
       
    
    }


    async getTransactions(){

        let transactions= [];
        this.setState({loading:true});
        const scope = this;
        let u = await AsyncStorage.getItem('USER');
        u =JSON.parse(u);
        const currentUser = u.uid;
        // console.log(currentUser);
        
        database().ref('transactions').child(currentUser).once('value').then((snapshot)=>{
            let transactionPromises=[];
            const SERVICE_CHARGES = 0.2;

            //  console.log('wow');
            snapshot.forEach(childSnapshot=>{
                let t = childSnapshot.val();
                transactionPromises.push(
                    database().ref('users').child(t.received?t.transferredFrom:t.transferredTo).once('value').then(userSnapshot=>{
                    t.user = userSnapshot.val();
                    if(!t.received){
                        transactions.push({...t,type:'subscription'});
                    }
                    transactions.push(t);

                   
                }));
             

            })
            Promise.all(transactionPromises).then(()=>{
                scope.setState({transactions, loading:false})
            })
        })

    }

    componentWillUnmount(){
        try{
        this.subscribe.off('value',()=>{});
        Linking.removeEventListener('url', this.handleOpenURL);
        }catch(ex){

        }
    }
    
    handleOpenURL=(event)=> {
        // console.log(event);
        const parsedUrl = urlParse(event.url, true);

        let {query: {group}} = parsedUrl;
        // console.log('MYGROUP',group)
            // this.getGroup(group);
            let scope = this;
            if(group){
                    this.setState({groupSearching:true});
                    database().ref('groups').child(group).once('value',async (snapshot)=>{
                        if(snapshot && snapshot.hasChildren()){
                            let group = snapshot.val();
                            let user = await AsyncStorage.getItem('USER');
                            // console.log(user);
                            user = JSON.parse(user);
                            // console.log(user);
                            if(group.uid !== user.uid){
                                if(group.members && group.members.length>8){
                                    Alert.alert('You can not join this group because limit has been reached.')
                                }else if(!group.members ||(group.members && !group.members[user.uid])){
                                    Alert.alert('Group has been joined.')
                                    database().ref(`groups/${group.key}`).child('members').child(user.uid).set({ joinedAt: Date.now() });
                                    database().ref(`users/${user.uid}`).child('groups').child(group.key).set({ joinedAt: Date.now() });
                                    
                                    scope.props.navigation.navigate('GroupChat', {group:group})
                                }else{
                                    scope.props.navigation.navigate('GroupChat', {group:group})
                                }
                            }else{
                                scope.props.navigation.navigate('GroupChat', {group:group})

                            }
                        }else{
                            // console.log('WOW');
                        }
                    })
                
            }
      }

    navigate = (url) => { // E
        const { navigate } = this.props.navigation;
        if (url) {
            const parsedUrl = urlParse(url, true);
            // console.log(parsedUrl);
            const {query: {group}} = parsedUrl;
            // console.log(group);
            this.getGroup(group);
            // // if user id query param exists, lets load that user's profile
            // // if (userId) {
            // //     this._loadUserProfile(userId);
            // // }

        }
                    // const route = url.replace(/.*?:\/\//g, '');
        // const id = route.match(/\/([^\/]+)\/?$/)[1];
        // const routeName = route.split('/')[0];
        // console.log('LetsCheck',routeName)

        // if (routeName === 'people') {
        // //   navigate('People', { id, name: 'chris' })
        // };
    }

    getGroup=(groupID)=>{
        const{user} = this.state;
        const scope = this;
        if(groupID){
            this.setState({groupSearching:true});
            database().ref('groups').child(groupID).once('value',(snapshot)=>{
                if(snapshot && snapshot.hasChildren()){
                    let group = snapshot.val();
                    if(group.uid !== user.uid){
                        if(group.members && group.members.length>8){
                            Alert.alert('You can not join this group because limit has been reached.')
                        }else if(!group.members ||(group.members && !group.members[user.uid])){
                            Alert.alert('Group has been joined.')
                            database().ref(`groups/${group.key}`).child('members').child(user.uid).set({ joinedAt: Date.now() });
                            database().ref(`users/${user.uid}`).child('groups').child(group.key).set({ joinedAt: Date.now() });
                            
                            scope.props.navigation.navigate('GroupChat', {group:group})
                        }else{
                            scope.props.navigation.navigate('GroupChat', {group:group})
                        }
                    }else{
                        scope.props.navigation.navigate('GroupChat', {group:group})

                    }
                }else{
                    // console.log('WOW');
                }
            })
        }
    }

    setMenuRef = ref => {
        this._menu = ref;
    };

    renderMenu() {
        return (
            <Menu
                ref={this.setMenuRef}
            >
             {  
                //   <MenuItem onPress={()=>{this.hideMenu(); 
                //     this.props.navigation.navigate('AccountInformation');
                // }}>Account</MenuItem>
                }
                <MenuItem onPress={()=>{this.hideMenu(); 
                    this.props.navigation.navigate('CreateGroup');
                }}>Create Group</MenuItem>
            </Menu>
        )
    }

    renderGroup = ({ item }) => {
        let members = item.members;
        let membersCount = members? Object.keys(members).length + 1 : 1;
        return (
            <GroupItem
                title={`${item.name}`.toUpperCase()}
                date={new Date(item.createdAt).toLocaleString()}
                detail={item.subscription}
                price={calculateAmount( item.amount,membersCount)}
                onPress={()=>{this.props.navigation.navigate('GroupChat', {group:item})}}
                img={item.image ? { uri: item.image } : require('../../assets/groupImg.png')}
            />
        )
    }


    hideMenu = () => {
        this._menu.hide();
    };

    showMenu = () => {
        this._menu.show();
    };

    headerWithoutSearch = () => {
        const {leftChecked} = this.state;
        if(leftChecked === 2){
            return(
            <Header style={{ flexDirection: 'row', minHeight: 50,   alignItems: 'center', marginTop: leftChecked ===2?10:0  }}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 20, marginLeft: 10 }}>Hi <Text style={{fontSize:24,color:PRIMARYCOLOR}}>{this.state.user.name.toUpperCase()}</Text> here are your transactions.
            </Text>
            </View>
            <View>
                <Icon onPress={() => this.showMenu()} type={'MaterialCommunityIcons'} name={'dots-vertical'} style={{ fontSize: 24, color: '#000' }} />
                {this.renderMenu()}
            </View>
        </Header>
        )
        }else{
        return(
        <Header style={{ flexDirection: 'row', minHeight: 50,   alignItems: 'center', marginTop: leftChecked ===2?10:0  }}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 24, marginLeft: 10 }}>
                    {this.state.searching?'Searching....':leftChecked===1?'Groups':leftChecked ===2 ?'Hi '+this.state.user.name.toUpperCase()+' here are your transactions. ':leftChecked ===3 ?'Fundings':leftChecked ===4?'Account Settings':null}
            </Text>
            </View>
            <View>
                <Icon onPress={() => this.showMenu()} type={'MaterialCommunityIcons'} name={'dots-vertical'} style={{ fontSize: 24, color: '#000' }} />
                {this.renderMenu()}
            </View>
        </Header>
        )}
    }


    renderTransaction=({item})=>{
        return(
            <TransactionItem
                item={item}
                name={this.state.user.name}
            />
        )
    }

    openCreateGroup=()=>{
        const {user} = this.state;
        if(user.payout){
            this.props.navigation.navigate('CreateGroup');
        }else{
            Alert.alert('You need to connect your PayPal account for group creation.')
            this.setState({leftChecked:3})
        }
    }
    


    headerWithSearch = () => (
        <Header style={{ flexDirection: 'row', height: 70,  alignItems: 'center' }}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />
            <TextInput style={{
                flex: 1,
                color: '#000000',
                fontFamily: THEME_FONT,
                padding:0,
                fontSize: 24,
                marginLeft: 10
            }}
                placeholderTextColor='#000000'
                placeholder={'Search for groups'}
            />

            <View style={{ flexDirection: 'row' }}>
                <Icon onPress={() => this.setState({ search: false })} type={'MaterialCommunityIcons'} name={'magnify'} style={{ fontSize: 24, marginRight:15,color: '#000' }} />

                <Icon onPress={() => this.showMenu()} type={'MaterialCommunityIcons'} name={'dots-vertical'} style={{ fontSize: 24, color: '#000' }} />
                {this.renderMenu()}
            </View>
        </Header>
    )
    render() {
        const { leftChecked, groups, search,searching,transactions, loading } = this.state;
        return (
            <Container>
            {
                !search ?
                    this.headerWithoutSearch() :
                    this.headerWithSearch()
            }
                <Content>
                {leftChecked===1?
                    <FlatList
                        data={groups}
                        renderItem={this.renderGroup}
                        refreshControl={
                            <RefreshControl colors={[PRIMARYCOLOR]}
                            refreshing={searching}
                            onRefresh={()=>{this.refreshGroups()}}
                            />
                        }
                    />: leftChecked ===2?
                    loading?
                        <ActivityIndicator size={'large'} color={PRIMARYCOLOR}/>
                    :
                        <FlatList
                            data={transactions}
                            renderItem={this.renderTransaction}
                            refreshControl={
                                <RefreshControl colors={[PRIMARYCOLOR]}
                                refreshing={loading}
                                onRefresh={()=>{this.getTransactions()}}
                                />
                            }
                        />:
                                    leftChecked ===3 ?
                    <CardView navigation = {this.props.navigation} user={this.state.user}/>:
                    leftChecked===4?
                    <Account navigation = {this.props.navigation}/>:null
                    
                }
                </Content>
             
                <Footer style={{borderTopRightRadius:25, borderTopLeftRadius:25, elevation:10, backgroundColor:'transparent'}} >
            
            
                <View style={{borderTopLeftRadius:25, borderTopRightRadius:25, backgroundColor:'white', flexDirection:'row', flex:1, elevation:10}}>
                      <TouchableOpacity style={{flex:1}} onPress={()=>{this.setState({leftChecked:1})}} style={{borderBottomColor: PRIMARYCOLOR, justifyContent:'center', alignItems:'center', borderRadius:2,borderBottomWidth: leftChecked===1?2:0, flex:1}}>
                    {
                        <Icon name={'home'} type={'MaterialCommunityIcons'} style={{color:leftChecked===1?PRIMARYCOLOR:'black', fontSize:28}}/>
                    }
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1}} onPress={()=>{this.setState({leftChecked:2})}} style={{borderBottomColor: PRIMARYCOLOR,  justifyContent:'center', alignItems:'center', borderBottomWidth: leftChecked===2?2:0, flex:1}}>
                          <Icon name={'newspaper'} type={'MaterialCommunityIcons'} style={{color:leftChecked===2?PRIMARYCOLOR:'black', fontSize:28}}/>

                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1}} onPress={()=>{this.setState({leftChecked:3})}} style={{borderBottomColor: PRIMARYCOLOR,  justifyContent:'center', alignItems:'center', borderBottomWidth: leftChecked===3?2:0, flex:1}}>
                        <Icon name={'credit-card-multiple'} type={'MaterialCommunityIcons'} style={{color:leftChecked===3?PRIMARYCOLOR:'black', fontSize:28}}/>

                      </TouchableOpacity>
                            <TouchableOpacity style={{flex:1}} onPress={()=>{this.setState({leftChecked:4})}} style={{borderBottomColor: PRIMARYCOLOR,  justifyContent:'center', alignItems:'center', borderBottomWidth: leftChecked===4?2:0, flex:1}}>
                            <Icon name={'account-circle'} type={'MaterialIcons'} style={{color:leftChecked===4?PRIMARYCOLOR:'black', fontSize:30}}/>

                    </TouchableOpacity>
                </View>
              </Footer>
              <View style={{ position: 'absolute', bottom: 50, width: '100%', elevation:10, alignItems: 'center' }}>
              <FabBtnCheck onPress={() => {  this.openCreateGroup();
          }} />
          </View>
            </Container>
        )
    }
}