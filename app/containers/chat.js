import React from 'react'
import { Header, Icon, View, Text, Right, Thumbnail, Item } from "native-base"
import { THEME_BOLD_FONT } from '../constants/fontFamily'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Dimensions } from 'react-native'

const ChatItem = (props) => {
    const { item,user } = props;
    console.log(item.message, item.repeat)
    return (
        item.sent ?
        <View style={{flex:1, alignItems:'flex-end', marginHorizontal:15, 
                    marginTop: item.repeat?2:10}}>
            <TouchableOpacity style={{ maxWidth:Dimensions.get('window').width *0.65,backgroundColor:'#FF4F29', narginHorizontal:5, 
            paddingHorizontal: 15, paddingVertical: 10, 
            borderRadius:20, borderBottomRightRadius:0 }}>
                <Text style={{color:'#FFFFFF', fontSize:14,   }}>
                        {item.message}
                </Text>
            </TouchableOpacity>
            </View>
            :
         <View style={{flexDirection:'row', marginHorizontal:5,marginTop: !props.showUserInfo?2:10}}>
         {props.showUserInfo?
         <Thumbnail small circular source={user?{uri: user.image}? {uri:user.image}:require('../assets/groupImg.png'):require('../assets/groupImg.png')} />
         :
         <View style={{width:40}}/>
         }
            <View>
            {props.showUserInfo?

                <Text style={{marginHorizontal:10,  marginBottom:5,color:'#000'}}>
                {item.user}
                </Text>
                :null}
                <TouchableOpacity style={{ backgroundColor:'#0511F2', marginHorizontal:10, paddingHorizontal: 15, paddingVertical: 10, borderRadius:20, borderTopLeftRadius:0 }}>
                        <Text style={{color:'#FFFFFF', fontSize:14}}>
                            {item.message}
                        </Text>
                </TouchableOpacity>
            </View>
         </View>


    )
}

export default ChatItem;