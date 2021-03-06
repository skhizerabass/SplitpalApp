import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { PRIMARYCOLOR, PRIMARYTEXTCOLOR, BGCOLOR } from "../constants/colorConstants";
import { Icon, Text } from "native-base";
import { THEME_BOLD_FONT } from "../constants/fontFamily";

const FabBtnCheck = (props) => {

    return (
        <TouchableOpacity style={styles.container} onPress={props.onPress}>
            <Icon type={"MaterialCommunityIcons"} name={"plus"} style={styles.icon}/>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        padding:10,
        width:50, height:50,
        backgroundColor: PRIMARYCOLOR,
        borderRadius: 30,
        justifyContent:'center',
        alignItems:'center',    
        elevation:12
    },
    innerView:{
        width:50, height:50,
        backgroundColor:PRIMARYCOLOR,
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 30,
    },
    icon:{
        fontSize:28,
        color:'#FFFFFF'
    },
    text:
        {fontSize:18, fontFamily:THEME_BOLD_FONT, color:'#FFFFFF'}
    

});
export default FabBtnCheck;
