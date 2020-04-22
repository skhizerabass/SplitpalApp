import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Pie from 'react-native-pie'
import { Text, Container, Icon } from "native-base";
import { PENDING, UTILISED, HEADERCOLORS, LIGHTBGCOLOR, BALANCED, ACCENTCOLOR } from "../constants/colorConstants";
import { PIESIZE, PIEINNERRADIUS } from "../constants/sizeConstants";
import { THEME_BOLD_FONT, THEME_HEAVY_FONT } from "../constants/fontFamily";
import { TouchableOpacity } from "react-native-gesture-handler";

const Status = (props)=>{
    return(
        <View style={{flexDirection:'row', alignItems:'center', marginTop:10}}>
            <View style={{width:22, height:14, borderRadius:4, backgroundColor:props.color}}>

            </View>

            <Text style={{flex:1, marginHorizontal:10, fontSize:14, fontFamily:THEME_BOLD_FONT}}>
                {props.status}
            </Text>

            <Text style={{color:props.color, fontSize:16, fontFamily:THEME_BOLD_FONT}}>{props.countValue}</Text>
        </View>
    )
}

export default Status