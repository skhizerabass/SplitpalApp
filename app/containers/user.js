import React from 'react'
import { Header, Icon, View, Text, Right, Thumbnail, Item } from "native-base"
import { THEME_BOLD_FONT, THEME_FONT } from '../constants/fontFamily'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { PRIMARYTEXTCOLOR } from '../constants/colorConstants'


const UserItem = (props) => {
    // console.log(props.item.image);
    if(props.type==='full'){
        
        return (
        
            <TouchableOpacity style={{ flexDirection: 'row',marginLeft:20, marginVertical:10, justifyContent:'center', alignItems:'center' }} onPress={props.onPress}>
                <Thumbnail style={{width:30, height:30}} circular source={props.item.image?{uri:props.item.image}:require('../assets/groupImg.png')} style={{marginRight:15}}/>
                <View style={{flex:1, justifyContent:'center', flexDirection:'row',
                        borderBottomColor:'rgba(0, 0, 0, 0.12)', borderBottomWidth:1.0, paddingRight:20           
            }}>
                <View style={{ flex: 1, alignItems:'center', flexDirection:'row', paddingVertical:10 }}>
                <View style={{ flex:1}}> 
                <Text style={{ color: '#000000', fontFamily: THEME_BOLD_FONT, fontSize: 18  }}>
                        {props.item.name.toUpperCase()}
                    </Text>
                    <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 12  }}>
                    {props.item.username}
                </Text>
                    <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 12  }}>
                        {props.item.email}
                    </Text>
                    </View>
                   
                    {props.item.leader?
                    <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
                    Leader
                </Text>:
                props.item.member?
                <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
                Member
            </Text>:            <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
            Not Member</Text>}
                
                </View>
                </View>
            </TouchableOpacity>)
    
    }else
    return (
        
        <TouchableOpacity style={{ flexDirection: 'row',marginLeft:20, marginVertical:10, justifyContent:'center' }} onPress={props.onPress}>
        {props.item.image?
            <Thumbnail style={{width:30, height:30}} circular source={props.item.image?{uri:props.item.image}:require('../assets/groupImg.png')} style={{marginRight:15}}/>
        
            :
        <Thumbnail style={{width:40, height:40}} circular source={require('../assets/groupImg.png')} style={{marginRight:15}}/>
        }<View style={{flex:1, justifyContent:'center', flexDirection:'row',
                    borderBottomColor:'rgba(0, 0, 0, 0.12)', borderBottomWidth:1.0, paddingRight:20           
        }}>
            <View style={{ flex: 1, alignItems:'center', flexDirection:'row', paddingVertical:10 }}>
                <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 16, flex:1  }}>
                    {props.item.name.toUpperCase()}
                </Text>
                {props.item.leader?
                <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
                Leader
            </Text>:
            props.item.member?
            <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
            Member
        </Text>:            <Text style={{ color: PRIMARYTEXTCOLOR, fontFamily: THEME_FONT, fontSize: 16  }}>
        Not Member</Text>}
            
            </View>
            </View>
        </TouchableOpacity>

    )
}

export default UserItem;