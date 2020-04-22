import React, { PureComponent } from 'react'
import { View, Text, StyleSheet , Button} from 'react-native'
import stripe from 'tipsi-stripe'
import Spoiler from '../../containers/spoiler'
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

stripe.setOptions({
    publishableKey: 'pk_test_PuyAisdrSsMI9txyULeh0gE700Qomup2GI',
    androidPayMode: 'test',
  })
export default class CustomCardScreen extends PureComponent {
  static title = 'Custom Card'

  state = {
    loading: false,
    token: null,
    error: null,
 
  }

  handleCustomPayPress = async (shouldPass = true) => {
    try {
      this.setState({ loading: true, token: null, error: null })

      const params = shouldPass ? this.state.params : this.state.errorParams
      const token = await stripe.createTokenWithCard(params)
      //   console.log(token)
      this.setState({ loading: false, error: undefined, token })
    } catch (error) {
      this.setState({ loading: false, error })
    }
  }

  _onChange = form =>{ 
    //   console.log(form)
        const cvc={
            number: form.number,
            expMonth: form.expiry.split('/')[0],
            expYear: form.expiry.split('/')[1],
            cvc: form.cvc
        }
        t
    };


  render() {
    const { loading, token, error, params, errorParams } = this.state

    return (
      <View style={styles.container}>
        <CreditCardInput onChange={this._onChange} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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