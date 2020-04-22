import React from 'react'
import { Header, Icon, View, Text, Right, Thumbnail, Item } from "native-base"
import { THEME_BOLD_FONT } from '../constants/fontFamily'
import { TouchableOpacity } from 'react-native-gesture-handler'


const GroupItem = (props) => {
    return (
        <TouchableOpacity style={{ flexDirection: 'row',marginLeft:20, marginTop:10 }} onPress={props.onPress}>
            <Thumbnail style={{width:40, height:40}} circular source={props.img} style={{marginRight:15}}/>
            <View style={{flex:1, justifyContent:'center', flexDirection:'row', paddingBottom:15,
                    borderBottomColor:'rgba(0, 0, 0, 0.12)', borderBottomWidth:1.0, paddingRight:20           
        }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_BOLD_FONT, fontSize: 16,  }}>
                    {props.title}
                </Text>
                <Text style={{ color: '#5F5F5F', fontSize: 12, marginTop:4 }}>
                    {props.date}
                </Text>

                <Text style={{ color: '#5F5F5F', fontSize: 14,  marginTop:4 }}>
                    {props.detail}
                </Text>
            </View>

            <View style={{justifyContent:'center'}}>
            <Text style={{ color: '#5F5F5F', fontSize: 14, marginLeft: 15 }}>

                ${props.price}
                </Text>
            </View>
            </View>
        </TouchableOpacity>

    )
}

export default GroupItem;