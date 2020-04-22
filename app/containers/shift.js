import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Pie from 'react-native-pie'
import { Text, Container, Icon } from "native-base";
import { PENDING, UTILISED, HEADERCOLORS, LIGHTBGCOLOR, BALANCED, ACCENTCOLOR, ENTITLEMENT, BGCOLOR, PRIMARYCOLOR } from "../constants/colorConstants";
import { PIESIZE, PIEINNERRADIUS } from "../constants/sizeConstants";
import { THEME_BOLD_FONT, THEME_HEAVY_FONT } from "../constants/fontFamily";
import { TouchableOpacity } from "react-native-gesture-handler";
import Status from "./status";

const Shift = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon type={'MaterialCommunityIcons'} name={'calendar-check-outline'} style={styles.icon} />
                <Text style={styles.heading}>{props.heading}</Text>
                <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: ACCENTCOLOR, paddingVertical: 4, borderRadius: 1 }}>
                    <Text style={styles.headerRightText}>
                        SEE ALL
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <View style={styles.mainView}>
                    <View style={{ flex: 1, marginHorizontal:10, alignItems:'center'}}>
                         <Text style={styles.day}>WEDNESDAY</Text>
                         <Text style={styles.date}>13 Feburary 2020</Text>

                    </View>
                        <View style={ {height:50, borderRightColor:'#FFF', borderWidth:0.7, borderRadius:1, borderColor:ACCENTCOLOR}}>
                        
                        </View>
                    <View style={{ flex: 1, marginHorizontal:10, alignItems:'center'}}>
                            <Text style={styles.dayTime}>AFTERNOON <Text style={{fontSize:12,color:ACCENTCOLOR}}>(OT)</Text></Text>
                            <Text style={styles.timing}>10.00 am - 11:00 pm</Text>

                     </View>
                   
                </View>

                <View style={{flexDirection:'row', marginTop:15, alignItems:'center'}}>
                    <Icon type={'MaterialCommunityIcons'} name={'clock-outline'} style={{fontSize:28, color:PENDING}}/>
                    <Text style={styles.clockInTime}>Last clock-in <Text style={{fontFamily:THEME_BOLD_FONT, color:PENDING, fontSize:18}}>2:15pm</Text></Text>
                </View>
            
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: LIGHTBGCOLOR,
        borderRadius: 10,
        marginBottom:25
    },
    day:{
        fontSize:18,
        color:ACCENTCOLOR,
        fontFamily:THEME_BOLD_FONT
    },
    dayTime:{
        fontSize:18,
        fontFamily:THEME_HEAVY_FONT

    },
    clockInTime:{
        fontSize:18,
        color:PENDING,
        marginLeft:10,
        letterSpacing:0.2
    },
    date:{
        fontSize:13,
        color:ACCENTCOLOR,
        fontFamily:THEME_HEAVY_FONT,
        marginTop:5
    },
    timing:{
        fontSize:13,
        fontFamily:THEME_HEAVY_FONT,
        marginTop:5
    },


    btnText:{
        fontSize:17,
        color:'#FFFFFF',
        fontFamily:THEME_BOLD_FONT
    },
    gauge: {
        position: 'absolute',
        height: 120,
        width: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeText: {
        backgroundColor: 'transparent',
        fontSize: 40,
        fontFamily: THEME_BOLD_FONT
    },
    pieView: {
        position: 'relative',
        width: PIESIZE,
        height: PIESIZE
    },
    header: {
        padding: 15,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: HEADERCOLORS,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,

    },
    icon: {
        fontSize: 24,
        color: '#FFFFFF'
    },
    body: {
        padding: 15
    },
    heading: {
        fontSize: 20,
        flex: 1,
        fontFamily: THEME_BOLD_FONT,
        marginLeft: 10,
        color: '#FFFFFF'
    },
    headerRightText: {
        fontSize: 12,
        color: ACCENTCOLOR,
        fontFamily: THEME_HEAVY_FONT,
    },
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:10
    }
});
export default Shift;
