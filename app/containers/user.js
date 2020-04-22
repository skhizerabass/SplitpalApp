import React from 'react'
import { Header, Icon, View, Text, Right, Thumbnail, Item } from "native-base"
import { THEME_BOLD_FONT, THEME_FONT } from '../constants/fontFamily'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { PRIMARYTEXTCOLOR } from '../constants/colorConstants'
import { Image } from 'react-native'


const UserItem = (props) => {
    console.log(props.item);
    return (
        <TouchableOpacity style={{ flexDirection: 'row',marginLeft:20, marginVertical:10, justifyContent:'center' }} onPress={props.onPress}>
            <Image style={{width:40, height:40}} circular source={require('../assets/groupImg.png')} style={{marginRight:15}}/>
            <View style={{flex:1, justifyContent:'center', flexDirection:'row',
                    borderBottomColor:'rgba(0, 0, 0, 0.12)', borderBottomWidth:1.0, paddingRight:20           
        }}>
            <View style={{ flex: 1, alignItems:'center', flexDirection:'row', paddingVertical:10 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 16, flex:1  }}>
                    {props.item.name}
                </Text>
                {props.item.leader?
                <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
                Leader
            </Text>:
            props.item.member?
            <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
            Member
        </Text>:            <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
        Not Member</Text>}
            
            </View>
            </View>
        </TouchableOpacity>

    )
}

export default UserItem;