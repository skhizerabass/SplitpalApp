import React, { PureComponent } from 'react'
import { View, Text, StyleSheet , Button, StatusBar, ActivityIndicator, Alert} from 'react-native'
import stripe from 'tipsi-stripe'
import Spoiler from '../../containers/spoiler'
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import { Header, Icon, Container } from 'native-base';
import { THEME_FONT } from '../../constants/fontFamily';
import CustomButton from '../../containers/button';
import { PRIMARYCOLOR } from '../../constants/colorConstants';
import { requestHandler } from '../../utils/requestHandler';
import database from '@react-native-firebase/database';

stripe.setOptions({
    publishableKey: 'pk_live_O15PpRa26KNUjhzV3EIyz1TF00tZvkVlej',
    androidPayMode: 'test',
  })
export default class AddCard extends PureComponent {
  static title = 'Custom Card'

  state = {
    loading: false,
    token: null,
    error: null,
 
  }

  handleCustomPayPress = async (shouldPass = true) => {
    try {
      this.setState({ loading: true, token: null, error: null })
        const { form} = this.state;
        const {user}=  this.props.route.params;
        const params = shouldPass ? this.state.params : this.state.errorParams
        const cvc={
                number: form.number,
                expMonth: Number(form.expiry.split('/')[0]),
                expYear: Number(form.expiry.split('/')[1]),
                cvc: form.cvc
            }
            // console.log(cvc);
          const token = await stripe.createTokenWithCard(cvc);
        // console.log(token)

     try {

            // const result = await stripe.paymentRequestWithCardForm();
            // console.log(result);
            
            let data = await requestHandler('getPaymentIntent',{uid:user.uid,custID: user.stripeID, cardID: token.tokenId,pmID:user.card?user.card.cardId : null});
            console.log('DATA',data);
            if(data.setupIntent){
                    database().ref().child('users').child(user.uid).child('card').set({...token.card,});
                    this.props.navigation.pop();
            }else{
                Alert.alert('Something went wrong. Please try again.');

            }

            // console.log(result2);
          } catch (e) {
            // handle exception here
            console.log(e);
            Alert.alert('Something went wrong. Please try again.');
        }

      this.setState({ loading: false, error: undefined, token })
    } catch (error) {
        console.log(error);
      this.setState({ loading: false, error })
    }
  }

  _onChange = form =>{ 
      console.log(form)
        // const cvc={
        //     number: form.number,
        //     expMonth: form.expiry.split('/')[0],
        //     expYear: form.expiry.split('/')[1],
        //     cvc: form.cvc
        // }
        if(form.valid){
            // console.log('you called me');
            this.setState({submitBtn:true, form:form.values});
        }else{
            this.setState({submitBtn:false});

        }
    };

    headerWithoutSearch = () => (
        <Header style={{ flexDirection: 'row', height: 70, alignItems: 'center', marginHorizonta: 10 }}>
            <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />

            <View style={{height:40, width:40, alignItems:'center', justifyContent:'center'}}>
                <Icon onPress={() => this.props.navigation.pop()} type={'MaterialCommunityIcons'} name={'arrow-left'} style={{ fontSize: 26, color: '#000' }} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 24, marginLeft: 15 }}>
                   {'Add Card'}
            </Text>
            </View>
        </Header>
    )


  render() {
    const { loading, token, error, params, submitBtn } = this.state

    return (
      <Container>
      {this.headerWithoutSearch()}
      <View  style={styles.container}>
        <CreditCardInput onChange={this._onChange} />
        </View>
        {!loading && submitBtn?

            <View style={{margin:30, flex:1,justifyContent:'center', alignItems:'center'}}>
            <CustomButton text={'Add Card'} onPress={() => { this.handleCustomPayPress() }} />
            </View>:
            null}
            {loading?<ActivityIndicator size={'large'} color={PRIMARYCOLOR}/>:null}

      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
      flex:1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'#FFF',
    marginTop:20
  },
  header: {
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
  },
  params: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'flex-start',
    margin: 5,
  },
  param: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
})