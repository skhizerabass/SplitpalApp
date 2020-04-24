import React from 'react'
import { Header, Icon, Text, Right, Thumbnail, Item, Card } from "native-base"
import { THEME_BOLD_FONT, THEME_FONT } from '../constants/fontFamily'
import { PRIMARYCOLOR } from '../constants/colorConstants'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDateString } from '../utils/generalFunc'
import { View } from 'react-native'


const TransactionItem = (props) => {
    let item = props.item;
    // console.log(item);
    const name = props.name;
if(item.type){
    // console.log(item.amount)
    let amount =  Number(item.amount) * 0.8;

    amount = amount.toFixed(2)

    // console.log(item.amount)

    return (
        <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical:5, borderRadius: 12,  }} onPress={props.onPress}>
            <Card style={{
                flex: 1, justifyContent: 'center', flexDirection: 'row', paddingBottom: 15,
                elevation:8, padding:15, borderRadius:12, borderBottomWidth: 1.0, paddingRight: 20
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: PRIMARYCOLOR, fontFamily: THEME_FONT, fontSize: 20, }}>
                        {item.user.name}
                    </Text>
                    <Text style={{ color: '#5F5F5F', fontSize: 10, marginTop: 4 }}>
                        {getDateString(item.date)}
                    </Text>
                    <Text style={{ color: '#5F5F5F', fontSize: 14, marginTop: 4 }}>
                         {item.received?
                            `You received $${amount} from ${item.user.name}`:

                            `You paid $${amount} to ${item.user.name}`
                        }
                    </Text>
                </View>

                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: item.received ? PRIMARYCOLOR : '#FF4F29', fontSize: 16, marginLeft: 15 }}>

                        ${amount}
                    </Text>
                </View>
            </Card>
        </TouchableOpacity>

    )
}else{
    
    let amount =  item.amount-(Number(item.amount) * 0.8);
    amount = amount.toFixed(2)
    return (
        <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical:5, borderRadius: 12,  }} onPress={props.onPress}>
            <Card style={{
                flex: 1, justifyContent: 'center', flexDirection: 'row', paddingBottom: 15,
                elevation:8, padding:15, borderRadius:12, borderBottomWidth: 1.0, paddingRight: 20
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 20, }}>
                        {'Subscription Fee'}
                    </Text>
                    <Text style={{ color: '#5F5F5F', fontSize: 10, marginTop: 4 }}>
                        {getDateString(item.date)}
                    </Text>
                    <Text style={{ color: '#5F5F5F', fontSize: 14, marginTop: 4 }}>

                            You paid ${amount} to SplitPal
                        
                    </Text>
                </View>

                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: item.received ? PRIMARYCOLOR : '#FF4F29', fontSize: 16, marginLeft: 15 }}>

                        ${amount}
                    </Text>
                </View>
            </Card>
        </TouchableOpacity>
    );
}
}

export default TransactionItem;