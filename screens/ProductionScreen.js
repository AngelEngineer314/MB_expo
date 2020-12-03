import React from "react";
import { Text, TextInput, View,
    Platform, LayoutAnimation, Alert, FlatList, ActivityIndicator,
    UIManager, ScrollView, KeyboardAvoidingView,
    AsyncStorage,
  } from "react-native";
import Button from "react-native-button";
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
var moment = require('moment');

import ProductView from "../components/ProductView";
import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');


class ProductionScreen extends React.Component {

  static navigationOptions = {
    headerTitle: 'Production',
  };  

  constructor() {
    super();
    this.state = { 
      fetchedData: [],
      isLoading: true,
      scrolling: false,
      dataSource: "",
      date: new Date(),
      showUpdateDate:false,
      updateDate:"",
      reset: false,
      token: "",
      user_id: "",
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

  getYYYYMMDD = (date) => {
    return (date.getFullYear() +"-"+ parseInt(date.getMonth()+1) + "-"+ date.getDate());
  };

  getDDMMYYYY = (date) => {
    return (date.getDate() + "-"+ parseInt(date.getMonth()+1) +"-"+ date.getFullYear());
  };
  
  logoutAlert(){
    Logout.showAlert(this.props);
  };

  getData(){
    this.setState({isLoading:true});
    AsyncStorage.getItem('@app:token').then(authToken => {
      this.setState({token: authToken});

      AsyncStorage.getItem('@app:user_id').then(userId => {
        this.setState({user_id: userId});

        fetch(Config.apiUrl + '/production/check',{
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': 'Bearer '+this.state.token,
          },
          body: JSON.stringify({
            'user_id': this.state.user_id,
            'date': this.getYYYYMMDD(this.state.date),
          })
        },
        )
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.data.length>0) {
            this.setState({
              showLastUpdate: true,
              lastUpdate: responseJson.message
            });
          }
        })
        .catch((error) =>{
          console.error(error);
        });
      });

      return fetch(Config.apiUrl + '/projections/list?date='+this.getYYYYMMDD(this.state.date),{
          method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+this.state.token,
            }}
         )
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.status=="success"){
            this.setState({
              dataSource: responseJson,
              isLoading: false,
            });
          }
          else if(responseJson.message=="You are not authorized to access this page."){
            this.logoutAlert();
          }
        })
        .catch((error) =>{
          console.error(error);
        });
    });
  };

  onScrollStart = () => {
    this.setState({scrolling: true});
  };
  onScrollEnd = () => {
    this.setState({scrolling: false});
  };

  myCallbackQty = (id,qty) => {
    var index = this.state.fetchedData.findIndex(x=> x.id === id);
    if (index>=0) {
      this.setState({
        fetchedData: [
          ...this.state.fetchedData.slice(0,index),
          Object.assign({}, this.state.fetchedData[index], {qty: qty}),
          ...this.state.fetchedData.slice(index+1)
        ]
      });
    }
    else{
      const obj = {'id':id, 'qty':qty, 'comment':''};
      this.state.fetchedData.push(obj);
    }
  };

  extractEntries = (data) => {
    var entries=[];
    var strEntries=[];
    for (var i = 0; i < data.length; i++) {
      var index = entries.findIndex(x=> x.initial === data[i].initial);
      if (index>=0){
        entries[index] = {'initial': data[i].initial,'production': parseInt(entries[index].production + parseInt(data[i].production))};
      }
      else{
        const obj = {'initial':data[i].initial, 'production':parseInt(data[i].production)};
        entries.push(obj);
      }
    }
    entries.map(function(item) {
      strEntries.push(item['initial']+'/'+item['production']);
    });
    return strEntries.join(', ');
  };

  extractComments = (data) => {
    var comments=[];
    if (data.length>0) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].comment!=null)
          comments.push(data[i].initial,data[i].comment);
      }
    }
    return comments;
  };

  removeBlankQty = () => {
    var array = this.state.fetchedData;
    var length = array.length;
    for (var i = 0; i < length; i++) {
      var index = array.findIndex(x=> x.qty == "");
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
      reset: true,
      isLoading:true,
    });
    AsyncStorage.getItem('@app:user_id').then(userId => {
      this.setState({user_id: userId});

      var fetchedData = this.state.fetchedData;
      var dVar = 'data';
      var pVar = 'product_id';
      var pdVar = 'production';

      var body = {user_id:this.state.user_id,data: []};
      for (var i = 0; i < fetchedData.length; i++) {
        var pro = {};
        pro[pVar] = fetchedData[i].id;
        pro[pdVar] = fetchedData[i].qty;
        body.data.push(pro);
      }

      return fetch(Config.apiUrl + '/productions/store',{
          method: 'POST',
            headers: {
              'Accept': 'application/json',
              'content-type': 'application/json',
              'Authorization': 'Bearer '+this.state.token,
            },
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseJson) => {
          this.setState({
            reset: false,
            isLoading:false,
          });
          if (responseJson.status=="success") {
            alert("Save Successful");
            this.setState({
              fetchedData:[],
            });
            this.getData();
          }
          else{
            alert(responseJson.message);
          }
        })
        .catch((error) =>{
          console.error(error);
        });
    });
  };


  _renderItem = ({ item }) => (
    <ProductView
      navigation={this.props.navigation}
      reset={this.state.reset}
      inputQty={this.myCallbackQty}
      pId={item[0].id}
      name={item[0].name}
      totalProjection={item[2].projectionTotal}
      todayProjection={item[3].todayProjectionTotal}
      todayProduction={item[4].todayProductionTotal}
      todayWastage={item[5].todayWastageTotal}
      entries={this.extractEntries(item[6].productions)}
      comments={this.extractComments(item[1].projections)}
    />
  );

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        {!this.state.showLastUpdate?null:<Text style={styles.lastUpdate}>{this.state.lastUpdate}</Text>}
        <Card containerStyle={styles.card}>
          <View style={styles.dataHead}>
                <Text style={{flex:0.35,fontSize: 16, textAlign: 'center', 
    color: "#230A59", fontFamily:AppStyles.fontName.bold}}>PRODUCT</Text>
                <Text style={{flex:0.39,fontSize: 16,
    color: "#230A59", textAlign: 'center', fontFamily:AppStyles.fontName.bold}}>PRODUCTION</Text>
                <Text style={{flex:0.22,fontSize: 16,
    color: "#230A59", textAlign: 'center', fontFamily:AppStyles.fontName.bold}}>QTY</Text>
          </View>
          
          <ScrollView onScrollBeginDrag={this.onScrollStart} onScrollEndDrag={this.onScrollEnd} style={this.state.scrolling ? {borderTopWidth:3,borderRadius:5,borderBottomWidth:3,borderColor:"#DCDCDC"} : null}>
            <View style={styles.content}>
              <Text style={[styles.list2,styles.listType1]}>MOSTLY USED</Text> 
              {this.state.isLoading?
                <View style={{flex: 1, padding: 20}}>
                  <ActivityIndicator/>
                </View>
                :
                <FlatList
                  style={{marginHorizontal:-8}}
                  data={this.state.dataSource.data.mostused}
                  horizontal={false}
                  keyExtractor={(item, index) => 'M'+index.toString()}
                  renderItem={this._renderItem}
                  showsVerticalScrollIndicator={false}
                />
              }
            
              <Text style={[styles.list2,styles.listType1]}>RECENTLY USED</Text> 
              {this.state.isLoading?
                <View style={{flex: 1, padding: 20}}>
                  <ActivityIndicator/>
                </View>
                :
                <FlatList
                  style={{marginHorizontal:-8}}
                  data={this.state.dataSource.data.recentlyused}
                  horizontal={false}
                  keyExtractor={(item, index) => 'R'+index.toString()}
                  renderItem={this._renderItem}
                  showsVerticalScrollIndicator={false}
                />
              }
            
              <Text style={[styles.list2,styles.listType1]}>NEVER USED</Text> 
              {this.state.isLoading?
                <View style={{flex: 1, padding: 20}}>
                  <ActivityIndicator/>
                </View>
                :
                <FlatList
                  style={{marginHorizontal:-8}}
                  data={this.state.dataSource.data.notused}
                  horizontal={false}
                  keyExtractor={(item, index) => 'N'+index.toString()}
                  renderItem={this._renderItem}
                  showsVerticalScrollIndicator={false}
                />
              }
            </View>
          </ScrollView>
        </Card>
        <Button
          containerStyle={styles.btnContainer}
          style={styles.btnText}
          onPress={this.onPressSave}>
          Save
        </Button>
        <View style={styles.dateContainer}>
         <DatePicker
            date={this.state.date}
            showIcon={false}
            mode="date"
            disabled
            format={settings_date_format}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateInput: {
                flexDirection:'row',
                borderWidth:0,
                marginRight:10,
              },
              dateTouchBody: {
                flex:1,
                width:'100%',
                margin:10,
                borderWidth:0,
              },
              dateText: styles.date,
            }} 
          /> 
         </View>
      </KeyboardAvoidingView>
    );
  }
}

export default ProductionScreen;
