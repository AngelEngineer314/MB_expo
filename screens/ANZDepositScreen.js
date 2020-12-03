import React from "react";
import { Text, TextInput, View, AsyncStorage,
    Platform, LayoutAnimation, Alert, ActivityIndicator,
    UIManager, ScrollView, KeyboardAvoidingView} from "react-native";
import Button from "react-native-button";
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
import CounterScreen from "./CounterScreen";
var styles = require('../constants/Styles.js');

class ANZDepositScreen extends React.Component {

  static navigationOptions = {  
    headerTitle: 'ANZ Deposit Bag',
  };  

  constructor() {
    super();
              
    this.state = { 
      fetchedData: [],
      isLoading: true,
      scrolling: false,
      dataSource: "",
      date: new Date(),
      T100:0, T50:0, T20:0, T10:0, T5:0,
      T2:0, T1:0, T05:0, T02:0, T01:0, T005:0,
      N100:"", N50:"", N20:"", N10:"", N5:"",
      C2:"", C1:"", C05:"", C02:"", C01:"", C005:"",
      NTotal:0,
      CTotal:0,
      Total:0,
      editable:true,
      showSave: true,
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

  onScrollStart = () => {
    this.setState({scrolling: true});
  };
  onScrollEnd = () => {
    this.setState({scrolling: false});
  };

  clearInputs(){
    this.setState({
      T100:0, T50:0, T20:0, T10:0, T5:0,
      T2:0, T1:0, T05:0, T02:0, T01:0, T005:0,
      N100:"", N50:"", N20:"", N10:"", N5:"",
      C2:"", C1:"", C05:"", C02:"", C01:"", C005:"",
      NTotal:0,
      CTotal:0,
    });
  };

  parseFloat2Decimals = (value) => {
    return parseFloat(parseFloat(value).toFixed(2));
  };

  logoutAlert(){
    Logout.showAlert(this.props);
  };

  getData(){
    this.setState({isLoading:true});
    AsyncStorage.getItem('@app:business').then((response) => {
      const responseJson = JSON.parse(response);

      CounterScreen.fetchBusiness(responseJson.data.counter.id).then(businessResponse => {
        const deposit = businessResponse.data.deposit;
        const counter = businessResponse.data.counter;

        if (deposit) {
          this.setState({
            N100:deposit.notes_100,
            N50:deposit.notes_50,
            N20:deposit.notes_20,
            N10:deposit.notes_10,
            N5:deposit.notes_5,
            C2:deposit.coins_2,
            C1:deposit.coins_1,
            C05:deposit.coins_05,
            C02:deposit.coins_02,
            C01:deposit.coins_01,
            C005:deposit.coins_005,
            NTotal:parseInt(deposit.notes_total),
            CTotal:parseFloat(deposit.coins_total),
            T100: parseInt(100*deposit.notes_100),
            T50: parseInt(50*deposit.notes_50),
            T20: parseInt(20*deposit.notes_20),
            T10: parseInt(10*deposit.notes_10),
            T5: parseInt(5*deposit.notes_5),
            T2: parseInt(2*deposit.coins_2),
            T1: parseInt(1*deposit.coins_1),
            T05: this.parseFloat2Decimals(0.5*deposit.coins_05),
            T02: this.parseFloat2Decimals(0.2*deposit.coins_02),
            T01: this.parseFloat2Decimals(0.1*deposit.coins_01),
            T005: this.parseFloat2Decimals(0.05*deposit.coins_005),
          });
        }
        this.setState({
          isLoading: false,
          counter,
          showSave: !businessResponse.data.conclusion
        });
      })
      .catch((error) => {
        console.error(error);
      });
    });
  };

  onPressSave = () => {
    var message = 'Do you really want to save?';
    var buttons = [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Confirm', onPress: () => this.saveData()}
        ];
    if ((parseInt(this.state.NTotal)+parseFloat(this.state.CTotal))==0) {
      message = 'Please enter some values';
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
      this.setState({token: authToken});
      
      AsyncStorage.getItem('@app:business').then((response) => {
        const responseJson = JSON.parse(response);

        const business_id = responseJson.data.id;
    
        return fetch(Config.apiUrl + '/business/' + business_id + '/notes',{
            method: 'POST',
              headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': 'Bearer '+this.state.token,
              },
              body: JSON.stringify({
                user_id: this.state.user_id,
                business_type: "Deposit",
                notes_100: this.state.N100,
                notes_50: this.state.N50,
                notes_20: this.state.N20,
                notes_10: this.state.N10,
                notes_5: this.state.N5,
                coins_2: this.state.C2,
                coins_1: this.state.C1,
                coins_05: this.state.C05,
                coins_02: this.state.C02,
                coins_01: this.state.C01,
                coins_005: this.state.C005,
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
          <View style={styles.dataHead}>
                <Text style={styles.headText}>Type</Text>
                <Text style={styles.headText}>#</Text>
                <Text style={styles.headText}>Value</Text>
          </View>
          
          {this.state.isLoading ? <ActivityIndicator/> :

          <ScrollView onScrollBeginDrag={this.onScrollStart} onScrollEndDrag={this.onScrollEnd} style={this.state.scrolling ? {borderTopWidth:3,borderRadius:5,borderBottomWidth:3,borderColor:"#DCDCDC"} : null}>
            <View style={styles.content}>
              <Text style={[styles.list,styles.listType1]}>NOTES</Text> 
              <View style={styles.data}>
                <Text style={styles.subText}>
                  100</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable}
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.N100}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ N100:text, T100: parseInt(100*text), NTotal: parseInt(100*text)+this.state.T50+this.state.T20+this.state.T10+this.state.T5});
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T100}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  50</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.N50}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ N50:text, T50: parseInt(50*text), NTotal: parseInt(50*text)+this.state.T100+this.state.T20+this.state.T10+this.state.T5 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T50}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  20</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.N20}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ N20:text, T20: parseInt(20*text), NTotal: parseInt(20*text)+this.state.T100+this.state.T50+this.state.T10+this.state.T5 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T20}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  10</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.N10}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ N10:text, T10: parseInt(10*text), NTotal: parseInt(10*text)+this.state.T100+this.state.T50+this.state.T20+this.state.T5 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T10}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  5</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.N5}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ N5:text, T5: parseInt(5*text), NTotal: parseInt(5*text)+this.state.T100+this.state.T50+this.state.T20+this.state.T10 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T5}</Text>
              </View>
              <View style={{flexDirection:"row"}}>
                <Text style={styles.subtotalTitle}>
                  Notes Total</Text>
                <Text style={styles.subtotalValue}>
                  ${this.state.NTotal}</Text>
              </View>
              <Text style={[styles.list,styles.listType1]}>COINS</Text> 
              <View style={styles.data}>
                <Text style={styles.subText}>
                  2</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.C2}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ C2:text, T2: parseInt(2*text), CTotal: parseInt(2*text)+this.state.T1+this.state.T05+this.state.T02+this.state.T01+this.state.T005 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T2}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  1</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.C1}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ C1:text, T1: parseInt(1*text), CTotal: parseInt(1*text)+this.state.T2+this.state.T05+this.state.T02+this.state.T01+this.state.T005 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T1}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  0.5</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.C05}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ C05:text, T05:this.parseFloat2Decimals(0.5*text), CTotal: this.parseFloat2Decimals(0.5*text)+this.state.T2+this.state.T1+this.state.T02+this.state.T01+this.state.T005 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T05}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  0.2</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.C02}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ C02:text, T02:this.parseFloat2Decimals(0.2*text), CTotal: this.parseFloat2Decimals(0.2*text)+this.state.T2+this.state.T1+this.state.T05+this.state.T01+this.state.T005 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T02}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  0.1</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.C01}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ C01:text, T01:this.parseFloat2Decimals(0.1*text), CTotal: this.parseFloat2Decimals(0.1*text)+this.state.T2+this.state.T1+this.state.T05+this.state.T02+this.state.T005 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T01}</Text>
              </View>
              <View style={styles.data}>
                <Text style={styles.subText}>
                  0.05</Text>
                <TextInput 
                  keyboardType='numeric'
                  placeholder="0"
                  editable={this.state.editable} 
                  style={[styles.textInput,{flex:0.33}]}
                  value={this.state.C005}
                  onChangeText={(txt) => {
                    const text = txt.replace(/[^0-9]/ig,'');
                    this.setState({ C005:text, T005: this.parseFloat2Decimals(0.05*text), CTotal: this.parseFloat2Decimals(0.05*text)+this.state.T2+this.state.T1+this.state.T05+this.state.T02+this.state.T01 });
                  }}
                />
                <Text style={styles.subText}>
                  ${this.state.T005}</Text>
              </View>
              <View style={{flexDirection:"row"}}>
                <Text style={styles.subtotalTitle}>
                  Coins Total</Text>
                <Text style={styles.subtotalValue}>
                  ${this.parseFloat2Decimals(this.state.CTotal)}</Text>
              </View>
              <View style={{flexDirection:"row"}}>
                <Text style={styles.finaltotalTitle}>
                  ANZ Deposit</Text>
                <Text style={styles.finaltotalValue}>
                  ${parseInt(this.state.NTotal)+this.parseFloat2Decimals(this.state.CTotal)}</Text>
              </View>
            </View>
          </ScrollView>
        }
        </Card>
        {this.state.showSave?
          <Button
          containerStyle={styles.btnContainer}
          style={styles.btnText}
          onPress={this.onPressSave}
          >Save
        </Button>:null}
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

export default ANZDepositScreen;
