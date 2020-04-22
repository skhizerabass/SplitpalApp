import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Footer, Container, Content, Header, View, Text, Icon, Input, Thumbnail } from 'native-base';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import { PRIMARYCOLOR } from '../../constants/colorConstants';
import { Dialog } from 'react-native-simple-dialogs';
import { TextInput } from 'react-native-gesture-handler';
import auth, { firebase } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'Gallery', title: 'Choose Photo' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    quality:0.4
  };

export default class Account extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        this.state = {
            uploading:false,
            user:{},
            loading:true,
            newPassword:'',
            oldPassword:''
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

    reauthenticate = (currentPassword) => {
        var user = auth().currentUser;
        var cred = auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }


    componentDidMount(){
        const scope = this;

        AsyncStorage.getItem('USER').then(value=>{
            console.log(value);
            this.setState({user:JSON.parse(value),loading:false});
            this.subscribe = database().ref('users').child(JSON.parse(value).uid)
            this.subscribe.on('value',(snapshot)=>{
                AsyncStorage.setItem('USER',JSON.stringify(snapshot.val()));
                scope.setState({ user:snapshot.val(), loading:false, name: snapshot.val().name });
            });
        })
     
    }
    componentWillUnmount(){
        this.subscribe.off('value',()=>{});
    }

  

    headerWithoutSearch = () => (
        <Header style={{ flexDirection: 'row', height: 70, alignItems: 'center', marginHorizontal: 10 }}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />

            <View>
                <Icon onPress={() => this.props.navigation.pop()} type={'MaterialCommunityIcons'} name={'arrow-left'} style={{ fontSize: 26, color: '#000' }} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 24, marginLeft: 15 }}>
                    Account Information
            </Text>
            </View>
        </Header>
    )
    changeName=()=>{
        this.setState({dialogVisible:true,title:'Change Name',content:0});
    }

    changePassword=()=>{
        this.setState({dialogVisible:true,title:'Change Password',content:1});
    }

    signout=async()=>{
        let token =await AsyncStorage.getItem('TOKEN');
        await this.subscribe.off('value',()=>{});

        await database().ref('users').child(auth().currentUser.uid).child('tokens').child(token).set(null);

        await auth().signOut();
        await AsyncStorage.clear();
        this.props.navigation.dispatch(
            StackActions.replace('Auth')
        );
    }

    saveName=()=>{
        const {name,user} = this.state;
        database().ref('users').child(user.uid).child('name').set(name);
        this.hideDialog();
    }

    getContent=()=>{
        const {content,name, oldPassword,newPassword,changingPassword} = this.state;
        if(content=== 0){
            return(<View>
                    <TextInput placeholder={'Enter your name'} value={name} style={{borderBottomColor:PRIMARYCOLOR, borderBottomWidth:1}} onChangeText={(value)=>{this.setState({name:value})}}/>
                

                    <View style={{flexDirection:'row', alignItems:'flex-end',justifyContent:'flex-end', marginTop:50}}>
                        <TouchableOpacity onPress={()=>{this.hideDialog()}}>
                            <Text style={{color:PRIMARYCOLOR, fontSize:14, fontFamily: THEME_BOLD_FONT}}>CANCEL</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={{marginLeft:30}} onPress={()=>{this.saveName()}}>
                        <Text style={{color:PRIMARYCOLOR, fontSize:14, fontFamily: THEME_BOLD_FONT}}>CHANGE</Text>
                    </TouchableOpacity>
                    </View>
                    </View>
                
                )
        }
        else if(content=== 1){
            return(<View>
                    <TextInput placeholder={'Enter old password'} value={oldPassword} secureTextEntry={true} style={{borderBottomColor:PRIMARYCOLOR, borderBottomWidth:1}} onChangeText={(value)=>{this.setState({oldPassword:value})}}/>
                    <TextInput placeholder={'Enter new password'} value={newPassword} secureTextEntry={true} style={{borderBottomColor:PRIMARYCOLOR, borderBottomWidth:1}} onChangeText={(value)=>{this.setState({newPassword:value})}}/>
                    {changingPassword?
                        <View style={{flexDirection:'row', alignItems:'flex-end',justifyContent:'flex-end', marginTop:50}}>
                            <ActivityIndicator color={PRIMARYCOLOR} size={'small'}/>
                        </View>:
                        <View style={{flexDirection:'row', alignItems:'flex-end',justifyContent:'flex-end', marginTop:50}}>
                            <TouchableOpacity onPress={()=>{this.hideDialog()}}>
                                <Text style={{color:PRIMARYCOLOR, fontSize:14, fontFamily: THEME_BOLD_FONT}}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:30}} onPress={()=>{this.savePassword()}}>
                                <Text style={{color:PRIMARYCOLOR, fontSize:14, fontFamily: THEME_BOLD_FONT}}>CHANGE</Text>
                            </TouchableOpacity>
                        </View>

                    }
                    </View>
                
                )
        }

    }
    
    savePassword=()=>{
        const{oldPassword, newPassword}= this.state;
        const scope = this;
        if(oldPassword.length && newPassword.length){
            if(newPassword.length>=6){
                scope.setState({changingPassword:true});

                scope.reauthenticate(oldPassword).then(() => {
                    var user =    auth().currentUser;
                user.updatePassword(newPassword).then(() => {
                    scope.setState({changingPassword:false});
                    scope.hideDialog();
                }).catch(err=>{
                    Alert.alert(err.message);
                });
            }).catch((err)=>{
                // Alert.alert(err.message);
                if(err.code === 'auth/wrong-password'){
                    Alert.alert('Password is invalid.')
                }
                scope.setState({changingPassword:false})
            });
            }
            else{
                Alert.alert('Password should have atleast 6 characters.');
            }
        }
    }

    hideDialog=()=>{
        this.setState({dialogVisible: false})
    }

    uploadImage=()=>{
        const { user} = this.state;
        const scope = this;
        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);
           
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const source = { uri: response.uri };
           
              // You can also display the image using data:
              // const source = { uri: 'data:image/jpeg;base64,' + response.data };
           
              this.setState({
                avatarSource: source,
                uploading:true
              }); 
                    
              this.refStorage = storage().ref('images').child(user.uid+'.png')
              this.refStorage.putFile(response.uri).then(async()=>{
                  console.log('Image uploaded to bucket');
                  const url = await this.refStorage.getDownloadURL();

                  database().ref('users').child(user.uid).child('image').set(url);
                  scope.setState({uploading:false})
              }).catch(err=>{console.log('UploadError',err)})
            }
          });
          
    }

    
    
    render() {
        const {dialogVisible, title, uploading, user} = this.state;
        return (
            <Container>
                {this.headerWithoutSearch()}

                <Content>
                    <View style={{ height: 150, width: 150, alignSelf: 'center', alignItems: 'center' }}>
                        <Thumbnail circular style={{ backgroundColor: '#C4C4C4', borderRadius: 75, height: 150, width: 150 }} source={user.image?{uri:user.image}:this.state.avatarSource} />
                        <TouchableOpacity onPress={() => {this.uploadImage() }} style={{ width: 40, height: 40, elevation: 10, backgroundColor: PRIMARYCOLOR, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 0, borderRadius: 20 }}>
                        {uploading?
                            <ActivityIndicator size={"small"} color={'white'}/>:
                           <Icon name='pencil' type={'MaterialCommunityIcons'} style={{ fontSize: 24, color: 'white' }} />
                        }
                        </TouchableOpacity>
                    </View>

                    <View style={{ borderBottomColor: 'rgba(0, 0, 0, 0.12)', borderBottomWidth: 1, marginTop: 40 }} />
                    <View style={{ marginLeft: 30 }}>
                        <TouchableOpacity onPress={()=>{this.changeName()}} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Icon name={'account'} type={'MaterialCommunityIcons'} style={{ color: '#5F5F5F', fontSize: 24 }} />
                            <Text style={{ color: '#5F5F5F', paddingVertical: 15, flex: 1, marginLeft: 15, fontSize: 16, borderBottomColor: 'rgba(0, 0, 0, 0.12)', borderBottomWidth: 1, }} >{user.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Icon name={'email'} type={'MaterialCommunityIcons'} style={{ color: '#5F5F5F', fontSize: 24 }} />
                            <Text style={{ color: '#5F5F5F', paddingVertical: 15, flex: 1, marginLeft: 15, fontSize: 16, borderBottomColor: 'rgba(0, 0, 0, 0.12)', borderBottomWidth: 1, }} >{user.email}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{this.changePassword()}} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <Icon name={'lock'} type={'MaterialCommunityIcons'} style={{ color: '#5F5F5F', fontSize: 24 }} />
                            <Text style={{ color: '#5F5F5F', paddingVertical: 15, flex: 1, marginLeft: 15, fontSize: 16, borderBottomColor: 'rgba(0, 0, 0, 0.12)', borderBottomWidth: 1, }} >Change password</Text>
                        </TouchableOpacity>
                        {
                        //     <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        //     <Icon name={'credit-card-settings'} type={'MaterialCommunityIcons'} style={{ color: '#5F5F5F', fontSize: 24 }} />
                        //     <Text style={{ color: '#5F5F5F', paddingVertical: 15, flex: 1, marginLeft: 15, fontSize: 16, borderBottomColor: 'rgba(0, 0, 0, 0.12)', borderBottomWidth: 1, }} >Manage payment options</Text>
                        // </TouchableOpacity>
                    
                    }
                        <TouchableOpacity onPress={()=>{this.signout()}} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Icon name={'logout'} type={'MaterialCommunityIcons'} style={{ color: '#5F5F5F', fontSize: 24 }} />
                        <Text style={{ color: '#5F5F5F', paddingVertical: 15, flex: 1, marginLeft: 15, fontSize: 16, borderBottomColor: 'rgba(0, 0, 0, 0.12)', borderBottomWidth: 1, }} >Logout</Text>
                    </TouchableOpacity>
                    </View>
                </Content>

                <Dialog
                visible={this.state.dialogVisible}
                title={title}
                onTouchOutside={() => this.hideDialog()} >
                <View>
                        {this.getContent()}
                </View>
            </Dialog>

            </Container>
        )
    }
}