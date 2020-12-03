import React from "react";
import { Text, TextInput, View, AsyncStorage,
    Platform, LayoutAnimation, Alert, ActivityIndicator,
    UIManager, KeyboardAvoidingView} from "react-native";
import Button from "react-native-button";
import { Card, ListItem, Overlay} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
import CounterScreen from "./CounterScreen";
var styles = require('../constants/Styles.js');


class ConclusionScreen extends React.Component {

  static navigationOptions = {  
    headerTitle: 'Conclusion',
  };  

  constructor() {
    super();
    this.state = { 
      isLoading: true,
      isLoaded: false,
      scrolling: false,
      editable:true,
      showSave:true,
      deposit_total: "",
      voucher_total: "",
      gross_sale: "",
      eftpos: "",
      difference: "loading...",
      isZero:true,
      tax: "",
      date: new Date(),
      token: "",
      user_id: "",
      counter: null
    }
 
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    
  };
 
  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.setState({date: new Date()});
      this.getData();
    });
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  };

  clearInputs(){
    this.setState({
      gross_sale: 0, eftpos: 0, difference: 0, tax: 0,
    });
  };

  logoutAlert(){
    Logout.showAlert(this.props);
  };

  setDifference = (deposit,voucher,eft,gross) => {
    if(this.state.isLoaded){
      var difference = (
        (
          parseFloat(deposit) + 
          (eft==""?0:parseFloat(eft)) + 
          parseFloat(voucher)
        ) - (gross==""?0:parseFloat(gross)));
      if(difference!=0)
        this.setState({isZero:false});
      else
        this.setState({isZero:true});
      if(Math.floor(difference) === difference)
        this.setState({difference:difference});
      else if(difference.toString().indexOf(".")>-1)
        if(difference.toString().split(".")[1].length>=3)
          this.setState({difference:difference.toFixed(3)});
      else
        this.setState({difference:difference.toFixed(2)});      
    }
  };

  getData(){
    this.setState({isLoading:true, isLoaded:false, difference: "loading...", isZero:true});
    AsyncStorage.getItem('@app:business').then((response) => {
      const responseJson = JSON.parse(response);

      CounterScreen.fetchBusiness(responseJson.data.counter.id).then(businessResponse => {
        const business_id = businessResponse.data.id;
        const counter = businessResponse.data.counter;
        const {
          gross_sale,
          eftpos,
          tax,
        } = businessResponse.data.conclusion || {
          gross_sale: "",
          eftpos: "",
          tax: ""
        };

        this.setState({
          gross_sale,
          eftpos,
          tax,
          isLoading: false,
          counter,
          showSave: !businessResponse.data.conclusion
        });

        AsyncStorage.getItem('@app:token').then(authToken => {
          fetch(Config.apiUrl + '/business/' + business_id + '/deposit-voucher-total', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + authToken,
            }
          }
          )
            .then((response) => response.json())
            .then((responseJson) => {
              const { deposite_total, voucher_total } = responseJson.data;

              this.setState({
                deposit_total: deposite_total,
                voucher_total,
                isLoaded: true,
              });
              this.setDifference(deposite_total, voucher_total, eftpos, gross_sale);
            })
            .catch((error) => {
              console.error(error);
            });
        })
          .catch((error) => {
            console.error(error);
          });
      });
    });
  };


  onScrollStart = () => {
    this.setState({scrolling: true});
  };
  onScrollEnd = () => {
    this.setState({scrolling: false});
  };

  onPressSave = () => {
    var message = 'Are you sure? You will not be able to change it later.';
    var buttons = [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Confirm', onPress: () => this.saveData()}
        ];
    if (this.state.gross_sale=="" || this.state.eftpos=="" || this.state.difference=="" || this.state.tax=="") {
      message = 'Please enter all values';
      buttons = [{text: 'Ok', style: 'cancel'}];
    }
    Alert.alert(
      'Save',
      message,
      buttons,
      {cancelable: false},
    );
  };

  saveData(){
    AsyncStorage.getItem('@app:token').then(authToken => {
      AsyncStorage.getItem('@app:business').then((response) => {
        const responseJson = JSON.parse(response);

        const business_id = responseJson.data.id;

        return fetch(Config.apiUrl + '/business/' + business_id + '/totals',{
          method: 'POST',
            headers: {
              'Accept': 'application/json',
              'content-type': 'application/json',
              'Authorization': 'Bearer '+ authToken,
            },
            body: JSON.stringify({
              gross_sale: this.state.gross_sale,
              eftpos: this.state.eftpos,
              difference: this.state.difference,
              tax: this.state.tax,
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          alert("Save Successful");
          this.getData();
        })
        .catch((error) =>{
          console.error(error);
        });
      });
    });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Card containerStyle={styles.card}>
          {this.state.isLoading ? <ActivityIndicator/> :
            <View style={styles.content}>
              <View style={styles.data}>
                <Text style={{flex:0.66,fontSize: 16,fontFamily:AppStyles.fontName.main}}>
                  GROSS SALE</Text>
                <TextInput
                  placeholder="0"
                  keyboardType='numeric'
                  editable={this.state.editable}
                  style={[styles.textInput,{flex:0.33,fontSize: 16}]}
                  onChangeText={(text) => {
                    this.setState({
                      gross_sale:text,
                    });
                    this.setDifference(
                      this.state.deposit_total,
                      this.state.voucher_total,
                      this.state.eftpos,
                      text);
                  }}
                  value={this.state.gross_sale}
                />
              </View>
              <View style={styles.data}>
                <Text style={{flex:0.66,fontSize: 16,fontFamily:AppStyles.fontName.main}}>
                  EFTPOS</Text>
                <TextInput
                  placeholder="0"
                  keyboardType='numeric'
                  editable={this.state.editable}
                  style={[styles.textInput,{flex:0.33,fontSize: 16}]}
                  onChangeText={(text) => {
                    this.setState({
                      eftpos:text,
                    });
                    this.setDifference(
                      this.state.deposit_total,
                      this.state.voucher_total,
                      text,
                      this.state.gross_sale);
                  }}
                  value={this.state.eftpos}
                />
              </View>
              <View style={styles.data}>
                <Text style={{flex:0.66,fontSize: 16,fontFamily:AppStyles.fontName.main}}>
                  Difference</Text>
                <Text style={{flex:0.33,fontSize: 16,paddingBottom:1,textAlign: 'center',backgroundColor:this.state.isZero?null:"orange",fontFamily:AppStyles.fontName.main}}>
                  {this.state.difference}</Text>
              </View>
              <View style={styles.data}>
                <Text style={{flex:0.66,fontSize: 16,fontFamily:AppStyles.fontName.main}}>
                  TAX</Text>
                <TextInput
                  placeholder="0"
                  keyboardType='numeric'
                  editable={this.state.editable}
                  style={[styles.textInput,{flex:0.33,fontSize: 16}]}
                  onChangeText={(text) => {
                    this.setState({tax:text});
                  }}
                  value={this.state.tax}
                />
              </View>
            </View>
          }
        </Card>
        {this.state.showSave?
          <Button
            containerStyle={styles.btnContainer}
            style={styles.btnText}
            onPress={this.onPressSave}
            >Save
          </Button>
        :null}
        <View style={styles.dateLabelContainer}>
         <Text style={styles.dateTextDisabled}>{this.state.counter ? this.state.counter.name : ""}</Text>
         <DatePicker
            date={this.state.date}
            showIcon={false}
            mode="date"
            disabled
            format={settings_date_format}
            customStyles={{
              disabled: styles.dateLabelDisabled,
              dateText: styles.dateTextDisabled,
              dateTouchBody: styles.dateTouchBodyDisabled,
            }}
          /> 
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default ConclusionScreen;
