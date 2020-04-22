import React from 'react'
import { Header, Icon, Text, Right, Thumbnail, Item, Card } from "native-base"
import { THEME_BOLD_FONT, THEME_FONT } from '../constants/fontFamily'
import { PRIMARYCOLOR } from '../constants/colorConstants'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { getDateString } from '../utils/generalFunc'
import { View } from 'react-native'


const TransactionItem = (props) => {
    const item = props.item;
    console.log(item);
    const name = props.name;

    return (
        <TouchableOpacity style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical:5, borderRadius: 12,  }} onPress={props.onPress}>
            <Card style={{
                flex: 1, justifyContent: 'center', flexDirection: 'row', paddingBottom: 15,
                elevation:8, padding:15, borderRadius:12, borderBottomWidth: 1.0, paddingRight: 20
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 20, }}>
                        {item.user.name}
                    </Text>
                    <Text style={{ color: '#5F5F5F', fontSize: 10, marginTop: 4 }}>
                        {getDateString(item.date)}
                    </Text>
                    <Text style={{ color: '#5F5F5F', fontSize: 14, marginTop: 4 }}>
                         {item.received?
                            `You received $${item.amount} from ${item.user.name}`:

                            `You paid $${item.amount} to ${item.user.name}`
                        }
                    </Text>
                </View>

                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ color: item.received ? PRIMARYCOLOR : '#FF4F29', fontSize: 16, marginLeft: 15 }}>

                        ${item.amount}
                    </Text>
                </View>
            </Card>
        </TouchableOpacity>

    )
}

export default TransactionItem;