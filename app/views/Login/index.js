import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { Footer, Container, Content, Header, View, Text } from 'native-base';
import CustomFooter from '../../containers/footer';
import Login from './login';
import Signup from './signup';
import { BGCOLOR } from '../../constants/colorConstants';
import auth from '@react-native-firebase/auth';

export default class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginChecked: true
        }
    }
    componentDidMount(){
    }
    render() {
        const { loginChecked } = this.state;
        
        return (
            <Container >
            <Header style={{height:0}}>
            <StatusBar backgroundColor={BGCOLOR} barStyle={'dark-content'}/>

            </Header>
                {
                    loginChecked ?
                            <Login navigation = {this.props.navigation}/>
                       :
                        <Content padder >
                            <Signup navigation = {this.props.navigation} />
                        </Content>
                        
                }
                <CustomFooter
                    leftText={'LOGIN'}
                    leftChecked={loginChecked}
                    onLeftPress={() => { this.setState({ loginChecked: true }) }}
                    onRightPress={() => { this.setState({ loginChecked: false }) }}

                    rightText={'SIGNUP'} />
            </Container>
        )
    }
}