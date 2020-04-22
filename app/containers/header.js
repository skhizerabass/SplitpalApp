import React from 'react'
import { Header, Icon, View, Text, Right } from "native-base"
import { StatusBar, TouchableOpacity } from "react-native"
import { HEADERCOLORS, ACCENTCOLOR } from '../constants/colorConstants'
import { THEME_BOLD_FONT } from '../constants/fontFamily'


const CustomHeader = (props) => {
    return (
        <Header style={{  flexDirection: 'row',height:70, paddingTop:15}}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_BOLD_FONT, fontSize: 24, marginLeft: 10 }}>
                    {props.title}
                </Text>
            </View>
            {props.rightType?
            <View>
                <Icon onPress={props.rightPress} type={props.rightType} name={props.rightName} style={{fontSize:20, color:'#000'}}/>
            </View>:null}
        </Header>

    )
}

export default CustomHeader;