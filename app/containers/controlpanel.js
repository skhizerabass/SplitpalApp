import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, StatusBar, Platform } from "react-native";
import { PRIMARYCOLOR, PRIMARYTEXTCOLOR, BGCOLOR, HEADERCOLORS, ACCENTCOLOR } from "../constants/colorConstants";
import { Icon, Text, Container, Thumbnail, Content, Header } from "native-base";
import { THEME_BOLD_FONT, THEME_HEAVY_FONT } from "../constants/fontFamily";

const ControlPanel = (props) => {

    return (
        <Container style={styles.container}>
        <Header style={{height:0, borderWidth:0}}>
        <StatusBar style={{ backgroundColor: HEADERCOLORS }} barStyle={'light-content'} animated />
        </Header>

            <Content>
                <View style={styles.header}>
                    <Thumbnail large source={require('../assets/avatar.png')} />
                    <Text style={styles.name}>
                        John Smith
                    </Text>
                    <Text style={styles.designation}>
                        SUPERVISOR
                    </Text>
                </View>

                <View>
                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0, backgroundColor: PRIMARYCOLOR, }]}>
                        <Text style={[styles.mainText, { color: '#FFFFFF', flex: 1 }]}>
                            johnsmith@abc.com
                            </Text>
                        <Icon type={'MaterialCommunityIcons'} name={'email'} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem]}>
                        <Text style={styles.label}>ID</Text>
                        <Text style={styles.mainText}>
                            JH071
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem]}>
                        <Text style={styles.label}>FP ID</Text>
                        <Text style={styles.mainText}>
                            2033
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                        <Text style={styles.label}>STATUS</Text>
                        <Text style={styles.mainText}>
                            Confirmed
                    </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0, backgroundColor: ACCENTCOLOR, }]}>
                        <Text style={[styles.mainText, { color: '#FFFFFF', flex: 1 }]}>
                            LOG OUT
                        </Text>
                        <Icon type={'MaterialCommunityIcons'} name={'logout'} style={styles.icon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.subHeader}>
                    <Text style={styles.name}>
                        Companies
                  </Text>
                </View>
                <View>
                    <TouchableOpacity style={[styles.menuItem]}>
                        <Text style={styles.mainText}>
                            ABC Sdn. Bhd.
            </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem]}>
                        <Text style={styles.mainText}>
                            DEF Sdn. Bhd.
                    </Text>
                    </TouchableOpacity>
                </View>


            </Content>


        </Container>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: BGCOLOR,
        flex: 1
    },
    subHeader: {
        backgroundColor: '#575757',
        justifyContent: 'flex-end',
        height: 90,
        padding: 20
    },
    header: {
        backgroundColor: HEADERCOLORS,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios'? 20: 30,
        paddingTop: Platform.OS === 'ios'? 10: 30,

    },
    innerView: {
        width: 40, height: 40,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
    },
    icon: {
        fontSize: 28,
        color: PRIMARYCOLOR
    },
    name: { marginTop: 10, fontSize: 25, fontFamily: THEME_BOLD_FONT, color: '#FFFFFF' },
    designation: { marginTop: 5, fontSize: 15, fontFamily: THEME_BOLD_FONT, color: '#FFFFFF' },
    mainText: { fontSize: 15, fontFamily: THEME_BOLD_FONT, flex: 4 },
    label: { marginRight: 30, flex: 1, fontSize: 12, fontFamily: THEME_HEAVY_FONT, color: PRIMARYCOLOR },
    icon: { color: '#FFFFFF', fontSize: 22 },
    text:
        { fontSize: 11, fontFamily: THEME_BOLD_FONT, color: '#FFFFFF' },
    menuItem: {
        flexDirection: 'row',
        borderBottomWidth: 0.7,
        borderBottomColor: '#707070',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
    }


});
export default ControlPanel;
