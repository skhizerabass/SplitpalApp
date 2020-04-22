import React from 'react'
import { Header, Icon, View, Text, Footer } from "native-base"
import { StatusBar, TouchableOpacity } from "react-native"
import { HEADERCOLORS, ACCENTCOLOR, PRIMARYCOLOR, PRIMARYTEXTCOLOR } from '../constants/colorConstants'
import { THEME_BOLD_FONT, THEME_FONT } from '../constants/fontFamily'


const CustomButton = (props) => {
    console.log(props.leftText);
    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={props.onPress} style={{
            backgroundColor: PRIMARYCOLOR,
            borderRadius: 20, minWidth: 150, elevation: 2, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center'
        }}>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontFamily: THEME_FONT }}>

                {props.text}
            </Text>
        </TouchableOpacity>


    )
}

export default CustomButton;