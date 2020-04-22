import React from 'react'
import { Header, Icon, View, Text, Footer } from "native-base"
import { StatusBar, TouchableOpacity } from "react-native"
import { HEADERCOLORS, ACCENTCOLOR, PRIMARYCOLOR, PRIMARYTEXTCOLOR } from '../constants/colorConstants'
import { THEME_BOLD_FONT, THEME_FONT } from '../constants/fontFamily'


const CustomFooter = (props) => {
    console.log(props.leftText);
    return (
        <Footer style={{borderTopRightRadius:25, borderTopLeftRadius:25, elevation:10, backgroundColor:'transparent'}} >
          <View style={{borderTopLeftRadius:25, borderTopRightRadius:25, backgroundColor:'white', flexDirection:'row', flex:1, elevation:10}}>
                <TouchableOpacity style={{flex:1}} onPress={props.onLeftPress} style={{borderBottomColor: PRIMARYCOLOR, justifyContent:'center', alignItems:'center', borderRadius:2,borderBottomWidth: props.leftChecked?2:0, flex:1}}>
                <Text style={{color:PRIMARYTEXTCOLOR, fontSize:14, fontFamily:props.leftChecked?THEME_BOLD_FONT:THEME_FONT}}>   
                     {props.leftText}
                </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={props.onRightPress} style={{borderBottomColor: PRIMARYCOLOR,  justifyContent:'center', alignItems:'center', borderBottomWidth: !props.leftChecked?2:0, flex:1}}>
                <Text style={{color:PRIMARYTEXTCOLOR, fontSize:14, fontFamily:!props.leftChecked?THEME_BOLD_FONT:THEME_FONT}}>    
   
                     {props.rightText}
                </Text>
                </TouchableOpacity>
          </View>
        </Footer>

    )
}

export default CustomFooter;