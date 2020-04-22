import React from 'react';
import { SafeAreaView, StatusBar, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Footer, Container, Content, Header, View, Text, Icon, Input } from 'native-base';
import CustomFooter from '../../containers/footer';
import CustomHeader from '../../containers/header';
import GroupItem from '../../containers/groupItem';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { THEME_BOLD_FONT, THEME_FONT } from '../../constants/fontFamily';
import FabBtnCheck from '../../containers/fabBtnCheck';
import { TextInput } from 'react-native-gesture-handler';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { PRIMARYCOLOR, PRIMARYTEXTCOLOR } from '../../constants/colorConstants';
import Stripe from 'tipsi-stripe';
import { requestHandler } from '../../utils/requestHandler';
import { Dialog } from 'react-native-simple-dialogs';

Stripe.setOptions({
    publishableKey: 'pk_test_PuyAisdrSsMI9txyULeh0gE700Qomup2GI',
    androidPayMode: 'test',
})
export default class CardView extends React.Component {
    _menu = null;

    constructor(props) {
        super(props);
        this.state = {
            paypalEmail: '',
            dialogVisible: false
        };

    }
    openCard1() {
    }

    async openCard() {
        // console.log(result);
        const { user } = this.props;
        this.props.navigation.navigate('AddCard', { user });
        // try {

        //     const result = await Stripe.paymentRequestWithCardForm();
        //     // console.log(result);
        //     let data = await requestHandler('getPaymentIntent',{uid:user.uid,custID: user.stripeID, pmID:user.card?user.card.id : null});
        //     if(data.setupIntent){
        //         console.log(data);
        //         const { id: paymentMethodId } = result; 
        //         let  result2 = await Stripe.confirmSetupIntent({
        //                       clientSecret : data.setupIntent.client_secret,
        //                       paymentMethodId
        //                     })

        //         console.log(result2);
        //         if(result2){
        //             database().ref().child('users').child(user.uid).child('card').set({...result.card,id:paymentMethodId});
        //         }else{
        //             Alert.alert('Something went wrong. Please try again.');
        //         }
        //     }else{
        //         Alert.alert('Something went wrong. Please try again.');

        //     }

        //     // console.log(result2);
        //   } catch (e) {
        //     // handle exception here
        //     console.log(e);
        //     Alert.alert('Something went wrong. Please try again.');
        // }
    }

    savePayPal() {
        const { paypalEmail } = this.state;
        const { user } = this.props;
        if (paypalEmail.length) {
            database().ref('users').child(user.uid).child('payout').set({
                address: paypalEmail,
                addressType: 'EMAIL',
                service: 'paypal'
            });
            this.setState({ dialogVisible: false });
        } else {
            Alert.alert('Please provide your email connected with paypal.')
        }
    }

    render() {
        const { user } = this.props;
        const { paypalEmail } = this.state;
        return (
            <View style={{ flex: 1, paddingHorizontal: 25, marginTop: 10 }}>
                {user.card ?
                    <View style={{ height: 150, borderRadius: 20, backgroundColor: '#0511F2', padding: 25, elevation: 10 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>{user.name}</Text>
                        <Text style={{ color: 'white', fontSize: 20, marginTop: 15 }}>**** **** **** {user.card.last4}</Text>
                        <Text style={{ color: 'white', textAlign: 'right', fontSize: 24, marginTop: 15, fontWeight: 'bold', fontStyle: 'italic' }}>{user.card.brand.toUpperCase()}</Text>

                    </View> : null}

                <TouchableOpacity onPress={() => { this.openCard() }} style={{ backgroundColor: '#5F5F5F', height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, elevation: 10, borderRadius: 15, marginVertical: 15, flex: 1 }}>
                    <Icon name={'plus'} type={'MaterialCommunityIcons'} style={{ color: 'white' }} />
                    <Text style={{ marginLeft: 15, color: 'white', fontSize: 20 }}>Add new credit card</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000', marginTop: 30 }}>Paypal Account</Text>
                {user.payout ?
                    <View style={{ height: 150, borderRadius: 20, backgroundColor: '#0511F2', justifyContent: 'space-between', padding: 25, elevation: 10, marginTop: 10 }}>

                        <Text style={{ color: 'white', fontSize: 20 }}>{user.payout.address}</Text>
                        <Text style={{ color: 'white', textAlign: 'right', fontSize: 24, fontWeight: 'bold', fontStyle: 'italic' }}>PayPal</Text>

                    </View> :
                    <Text style={{ color: 'black', fontSize: 18, marginTop: 20 }}>Please connect your paypal account to receive subscriptions from your group members.</Text>
                }
                <TouchableOpacity onPress={() => { this.setState({ dialogVisible: true }) }} style={{ backgroundColor: '#5F5F5F', height: 50, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, elevation: 10, borderRadius: 15, marginVertical: 15, flex: 1 }}>
                    <Icon name={'plus'} type={'MaterialCommunityIcons'} style={{ color: 'white' }} />
                    <Text style={{ marginLeft: 15, color: 'white', fontSize: 20 }}>Connect new PayPal account</Text>
                </TouchableOpacity>
                <Dialog
                    visible={this.state.dialogVisible}
                    title={'Connect PayPal'}
                    onTouchOutside={() => this.setState({ dialogVisible: true })} >
                    <View>
                        <TextInput placeholder={'Enter PayPal email here...'} value={paypalEmail}  style={{ borderBottomColor: PRIMARYCOLOR, borderBottomWidth: 1 }} onChangeText={(value) => { this.setState({ paypalEmail: value }) }} />
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 50 }}>

                            <TouchableOpacity style={{ marginLeft: 30 }} onPress={() => { this.setState({ dialogVisible: false }) }}>
                                <Text style={{ color: PRIMARYCOLOR, fontSize: 14, fontFamily: THEME_BOLD_FONT }}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ marginLeft: 30 }} onPress={() => { this.savePayPal() }}>
                                <Text style={{ color: PRIMARYCOLOR, fontSize: 14, fontFamily: THEME_BOLD_FONT }}>CHANGE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Dialog>

            </View>

        )
    }
}