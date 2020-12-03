import React from "react";
import { Text, TextInput, View, Image, ActivityIndicator,
  KeyboardAvoidingView, AsyncStorage
  } from "react-native";
import Button from "react-native-button";

import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');

class LoginScreen extends React.Component {
  
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    global.token = "";
    this.state = {
      loading: true,
      email: "",
      password: "",
      isLoading: false,
      dataSource: "",
    };
  }

  onPressLogin = () => {
  	this.setState({isLoading: true});
    const { email, password } = this.state;
    if (email.length <= 0 || password.length <= 0) {
      alert("Please fill out the required fields.");
      this.setState({isLoading: false});
    }
   	else{
   		return fetch(Config.apiUrl + '/login',{
	    	method: 'POST',
	        headers: {
	          'Accept': 'application/json',
	          'Content-Type': 'application/json',
	        },
	    	body: JSON.stringify({
			    'useremail': email,
			    'password': password,
			 })
  		})
	    .then((response) => response.json())
	    .then((responseJson) => {
	        this.setState({
            isLoading: false,
            dataSource: responseJson,
          });
          if (this.state.dataSource.status=="success") {
	          AsyncStorage.setItem('@app:email', this.state.email);
            AsyncStorage.setItem('@app:token', responseJson.data.token);
            AsyncStorage.setItem('@app:user_id', responseJson.data.user_id.toString());
            
            this.props.navigation.navigate('Drawer');
	        }
          else{
            alert(this.state.dataSource.message);
          }
          this.setState({
            email:"",
            password:"", 
          });
	    })
	    .catch((error) =>{
	    	console.error(error);
	    });
   	}
  };

  render() {
  	if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }

    return (
      <KeyboardAvoidingView style={styles.container2} behavior="padding">
        <View style={styles.viewIconText}>
          <Image
            source={require("../assets/images/icon.png")}
          />  
          <Text style={{color: AppStyles.color.black, paddingBottom:9, fontSize: 40, fontFamily: AppStyles.fontName.semiBold }}>
            {" "}MB{" "}
          </Text>
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            placeholder="Username"
            onChangeText={text => this.setState({ email: text })}
            value={this.state.email}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.InputContainer}>
          <TextInput
            style={styles.body}
            secureTextEntry={true}
            placeholder="Password"
            onChangeText={text => this.setState({ password: text })}
            value={this.state.password}
            placeholderTextColor={AppStyles.color.grey}
            underlineColorAndroid="transparent"
          />
        </View>
        <Button
          containerStyle={[styles.loginContainer,this.state.password.length==0 ? {backgroundColor:"rgba(92,115,242,0.5)",borderColor:"rgba(92,115,242,0.5)"}:null]}
          style={styles.loginText}
          onPress={() => this.onPressLogin()}
          disabled={this.state.password.length==0 ? true:false}
        >
          Log in
        </Button>
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;
