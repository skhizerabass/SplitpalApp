import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { PRIMARYCOLOR, PRIMARYTEXTCOLOR } from "../constants/colorConstants";
import { Icon, Text } from "native-base";
import { THEME_BOLD_FONT } from "../constants/fontFamily";

const NotificationBox = (props) => {

    return (
        <TouchableOpacity style={styles.container}>
            <Icon type={"MaterialCommunityIcons"} name={"bell"} style={styles.icon}/>
            <Text style={[styles.text,{marginLeft:10, flex:1}]}>You have {props.total} leaves awaiting your approvals</Text>
            <Icon type={'Octicons'} name={'chevron-right'} style={[styles.text,{fontSize:34}]}/>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container: {
        marginTop:10,
        backgroundColor: PRIMARYCOLOR,
        borderRadius: 10,
        marginBottom:25,
        flexDirection:'row',
        alignItems:'center',
        padding:20
    },
    icon:{
        fontSize:32,
        color:PRIMARYTEXTCOLOR
    },
    text:
        {fontSize:18, fontFamily:THEME_BOLD_FONT, color:'#FFFFFF'}
    

});
export default NotificationBox;
