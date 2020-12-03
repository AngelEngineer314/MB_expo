import React from "react";
import { Text, TextInput, View, AsyncStorage,
    Platform, LayoutAnimation, Alert, FlatList, ActivityIndicator,
    UIManager, ScrollView, KeyboardAvoidingView} from "react-native";
import Button from "react-native-button";
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';

import VoucherView from "../components/VoucherView";
import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
import CounterScreen from "./CounterScreen";
var styles = require('../constants/Styles.js');

class VoucherScreen extends React.Component {

  static navigationOptions = {  
        headerTitle: 'Voucher',
  };  

  constructor() {
    super();
    this.state = { 
      fetchedData: [],
      totalsData: [],
      isLoading: true,
      scrolling: false,
      dataSource: "",
      date: new Date(),
      total:0,
      editable:true,
      showSave:true,
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

  logoutAlert(){
    Logout.showAlert(this.props);
  };

  parseFloat2Decimals = (value) => {
    return parseFloat(parseFloat(value).toFixed(3));
  };

  getData(){
    this.setState({
      isLoading:true,
    });
    AsyncStorage.getItem('@app:business')
      .then(response => {
        const responseJson = JSON.parse(response)

        CounterScreen.fetchBusiness(responseJson.data.counter.id).then(businessResponse => {
          const fetchedData = businessResponse.data.vouchers.map((voucher) => {
            return { 'id': voucher.id, 'qty': voucher.data ? voucher.data.amount : '' };
          });
  
          this.setState({
            dataSource: businessResponse,
            fetchedData,
            total: fetchedData.reduce((sum, item) => {
              if (!item.qty) {
                return sum;
              }
        
              return this.parseFloat2Decimals(sum) + this.parseFloat2Decimals(item.qty);
            }, 0),
            isLoading: false,
            counter: businessResponse.data.counter,
            showSave: !businessResponse.data.conclusion
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

  removeBlankQty = () => {
    var array = this.state.fetchedData;
    var length = array.length;
    for (var i = 0; i < length; i++) {
      var index = array.findIndex(x=> x.qty == null);
      if (index>=0) {
        array.splice(index, 1);
      } 
    }
    return array;
  };

  onPressSave = () => {
    var array = this.removeBlankQty();
    var message = 'Do you really want to save?';
    var buttons = [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Confirm', onPress: () => this.saveData()}
        ];
    if (array.length==0) {
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
    this.setState({
      isLoading:true,
    });
    AsyncStorage.getItem('@app:token').then(authToken => {
      const fetchedData = [
        ...this.state.fetchedData
      ];
      
      var data = {};

      fetchedData.forEach((voucherData) => {
        data[voucherData.id] = {
          amount: voucherData.qty
        }
      });

      return fetch(Config.apiUrl + '/business/' + this.state.dataSource.data.id + '/vouchers',{
        method: 'POST',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': 'Bearer '+authToken,
          },
          body: JSON.stringify({
            data 
          })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          fetchedData:[],
        });
        alert("Save Successful");
        global.total_voucher=this.state.total;
        
        this.getData();
      })
      .catch((error) =>{
        console.error(error);
      });
      
    });
  };

  myCallbackQty = (id, qty) => {
    var value = 0;
    if (qty == '') {
      qty = null;
      value = 0;
    }
    else {
      value = qty;
    }
    let updatedFetchedData = [
      ...this.state.fetchedData
    ];

    var index = this.state.fetchedData.findIndex(x => x.id === id);

    if (index >= 0) {
      if (qty != null) {
        updatedFetchedData = [
          ...updatedFetchedData.slice(0, index),
          Object.assign({}, updatedFetchedData[index], { qty: qty }),
          ...updatedFetchedData.slice(index + 1)
        ];
      }
    }
    else {
      const obj = { 'id': id, 'qty': qty };
      updatedFetchedData.push(obj);
    }

    this.setState({
      fetchedData: updatedFetchedData,
      total: updatedFetchedData.reduce((sum, item) => {
        if (!item.qty) {
          return sum;
        }
  
        return this.parseFloat2Decimals(sum) + this.parseFloat2Decimals(item.qty);
      }, 0),
    });
  };

  _renderItem = ({ item }) => (
    <VoucherView
      pId={item.id}
      inputQty={this.myCallbackQty}
      name={item.name}
      editable={this.state.editable}
      value={item.data ? item.data.amount : ''}
    />
  );


  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Card containerStyle={styles.card}>
          <View style={styles.dataHead}>
                <Text style={{flex:0.66,fontSize: 16, 
    color: "#230A59", fontFamily:AppStyles.fontName.bold}}>Item</Text>
                <Text style={{flex:0.33,fontSize: 16,
    color: "#230A59", textAlign: 'center', fontFamily:AppStyles.fontName.bold}}>Daily</Text>
          </View>
          
          {this.state.isLoading ? <ActivityIndicator/> :

          <ScrollView onScrollBeginDrag={this.onScrollStart} onScrollEndDrag={this.onScrollEnd} style={this.state.scrolling ? {borderTopWidth:3,borderRadius:5,borderBottomWidth:3,borderColor:"#DCDCDC"} : null}>
            <View style={styles.content}>
              <FlatList
                style={{marginHorizontal:-8}}
                data={this.state.dataSource.data.vouchers}
                horizontal={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <View style={{flexDirection:"row"}}>
              <Text style={{flex:0.64,fontSize: 16, textAlign: 'center',fontFamily:AppStyles.fontName.bold}}>
                Total</Text>
              <Text style={{flex:0.36,fontSize: 16, textAlign: 'center',fontFamily:AppStyles.fontName.bold}}>
                ${this.parseFloat2Decimals(this.state.total)}</Text>
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

export default VoucherScreen;
