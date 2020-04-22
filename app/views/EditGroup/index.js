import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
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
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'Gallery', title: 'Choose Photo' }],
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    quality:0.4
  };

const data = [{
   label:'Weekly', value: 'Weekly',
}, {
   label:'Monthly', value: 'Monthly',
}];
export default class EditGroup extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            subscription: '',
            amount: 0,
            billingCycle: 'Monthly',
            group: this.props.route.params.group
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

    componentDidMount(){
        const {group} = this.props.route.params;
        const scope = this;
        this.subscribe=database().ref('groups').child(group.key)
        this.subscribe.on('value',(snapshot)=>{
            scope.setState({group:snapshot.val(),name: snapshot.val().name, subscription: snapshot.val().subscription, avatar: snapshot.val().image});
        });
    }
    componentWillUnmount(){
        this.subscribe.off('value',()=>{});
    }

    headerWithoutSearch = () => (
        <Header style={{ flexDirection: 'row', height: 70, alignItems: 'center', marginHorizonta: 10 }}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />

            <View>
                <Icon onPress={() => this.props.navigation.pop()} type={'MaterialCommunityIcons'} name={'arrow-left'} style={{ fontSize: 26, color: '#000' }} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 24, marginLeft: 15 }}>
                    Edit Group
            </Text>
            </View>
        </Header>
    )

    saveGroup = () => {
        let scope = this;
        // const ref = database().ref('Group');
        const { name, subscription, group } = this.state;
        if(name.length && subscription.length){
            database().ref('groups').child(group.key).child('name').set(name);
            database().ref('groups').child(group.key).child('subscription').set(subscription);
            
            // let key = ref.push().key;
            // let uid = auth().currentUser.uid;
            // let updates = {};
            // let group = { name: name.toLowerCase().trim(), subscription: subscription.toLowerCase().trim(), amount, key, uid, createdAt: Date.now(),
            //     date:this.getDate().getTime(),
            //     cycle:billingCycle
                
            // };

            // updates[`users/${uid}/groups/${key}`] = { createdAt: Date.now(), joinAt: Date.now(), leader: true };
            // updates[`groups/${key}`] = group;
            // database().ref().update(updates).then(() => {
            //     scope.props.navigation.pop();
            //     scope.props.navigation.navigate('AddUser', { group });
            // })
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


    uploadImage=()=>{
        const { group } = this.state;
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
                    
              this.refStorage = storage().ref('images').child(group.key+'.png')
              this.refStorage.putFile(response.uri).then(async()=>{
                  console.log('Image uploaded to bucket');
                  const url = await this.refStorage.getDownloadURL();

                  database().ref('groups').child(group.key).child('image').set(url);
                  scope.setState({uploading:false})
              }).catch(err=>{console.log('UploadError',err)})
            }
          });
          
    }


    render() {
        const { name, subscription,  uploading,group } = this.state;
        let date = this.getDate()
        return (
            <Container>
                {this.headerWithoutSearch()}

                <Content contentContainerStyle={{ padding: 20 }}>
                <View style={{ height: 150, width: 150, alignSelf: 'center', alignItems: 'center' }}>
                <Thumbnail circular style={{ backgroundColor: '#C4C4C4', borderRadius: 75, height: 150, width: 150 }} source={group.image?{uri:group.image}:this.state.avatarSource} />
                <TouchableOpacity onPress={() => {this.uploadImage() }} style={{ width: 40, height: 40, elevation: 10, backgroundColor: PRIMARYCOLOR, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 0, borderRadius: 20 }}>
                {uploading?
                    <ActivityIndicator size={"small"} color={'white'}/>:
                   <Icon name='pencil' type={'MaterialCommunityIcons'} style={{ fontSize: 24, color: 'white' }} />
                }
                </TouchableOpacity>
            </View>
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

                   
                    <View style={{ alignItems: 'center',marginTop:20 }}>
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
