import React from 'react';
import { StyleSheet, Dimensions, View, StatusBar } from 'react-native';

import Pdf from 'react-native-pdf';
import { Header, Icon, Container, Text } from 'native-base';
import { THEME_FONT } from '../../constants/fontFamily';

export default class TermsAndCondition extends React.Component {
    render() {
        const source = { uri: 'https://firebasestorage.googleapis.com/v0/b/spilpal.appspot.com/o/files%2FUntitled_document_2.pdf?alt=media&token=dc75c831-f580-47a7-9427-3c06fddf8ad3', cache: true };
        //const source = require('./test.pdf');  // ios only
        //const source = {uri:'bundle-assets://test.pdf'};

        //const source = {uri:'file:///sdcard/test.pdf'};
        //const source = {uri:"data:application/pdf;base64,JVBERi0xLjcKJc..."};

        return (
            <Container  padder>
                <Header style={{ flexDirection: 'row', height: 70, alignItems: 'center', marginHorizontal: 10 }}>
                    <StatusBar style={{ backgroundColor: '#FFF' }} barStyle={'dark-content'} animated />

                    <View>
                        <Icon onPress={() => this.props.navigation.pop()} type={'MaterialCommunityIcons'} name={'arrow-left'} style={{ fontSize: 26, color: '#000' }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#000000', fontFamily: THEME_FONT, fontSize: 24, marginLeft: 15 }}>
                            Terms And Condition
                        </Text>
                    </View>
                </Header>
                    <Pdf
                        source={source}
                        onLoadComplete={(numberOfPages, filePath) => {
                            console.log(`number of pages: ${numberOfPages}`);
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`current page: ${page}`);
                        }}
                        onError={(error) => {
                            console.log(error);
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link presse: ${uri}`)
                        }}
                        style={styles.pdf} />
                                    
                </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});