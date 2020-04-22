import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import Pie from 'react-native-pie'
import { Text, Container, Icon } from "native-base";
import { PENDING, UTILISED, HEADERCOLORS, LIGHTBGCOLOR, BALANCED, ACCENTCOLOR, ENTITLEMENT, BGCOLOR, PRIMARYCOLOR } from "../constants/colorConstants";
import { PIESIZE, PIEINNERRADIUS } from "../constants/sizeConstants";
import { THEME_BOLD_FONT, THEME_HEAVY_FONT } from "../constants/fontFamily";
import { TouchableOpacity } from "react-native-gesture-handler";
import Status from "./status";

const Attendance = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Icon type={'MaterialCommunityIcons'} name={'checkbox-marked-circle-outline'} style={styles.icon} />
                <Text style={styles.heading}>{props.heading}</Text>
                <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: ACCENTCOLOR, paddingVertical: 4, borderRadius: 1 }}>
                    <Text style={styles.headerRightText}>
                        SEE ALL
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <View style={styles.mainView}>
                    <View style={styles.pieView}>
                        <Pie
                            radius={PIESIZE / 2}
                            innerRadius={PIEINNERRADIUS}
                            sections={[
                                {
                                    percentage: props.notclockedInPercentageno,
                                    color: ACCENTCOLOR,
                                },
                                {
                                    percentage: props.clockInPercentage,
                                    color: PRIMARYCOLOR,
                                }
                                
                            ]}
                            backgroundColor="#ddd"
                        />
                        <View style={styles.gauge}>
                            <Text style={styles.gaugeText}>
                                {props.clockInValue}
                                 </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, marginHorizontal:10 }}>
                            <Status color={PRIMARYCOLOR} status={'CLOCK IN'} countValue={props.clockInValue} />
                            <Status color={ACCENTCOLOR} status={'NOT YET CLOCK-IN'} countValue={props.notClockedInValue} />
                      
                    </View>
                   
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
    btn:{
        flex:1,
        margin:20,
        marginBottom:10,
        justifyContent:'center',
        alignItems:'center',
        padding:15,
        borderRadius:10,
        backgroundColor:PRIMARYCOLOR
    },
    btnText:{
        fontSize:18,
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
        padding: 15,
        paddingVertical:25
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
        alignItems: 'center'
    }
});
export default Attendance;
