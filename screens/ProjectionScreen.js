import React from "react";
import { Text, TextInput, View,
    Platform, LayoutAnimation, Alert, FlatList, ActivityIndicator,
    UIManager, ScrollView, KeyboardAvoidingView, 
    AsyncStorage,
    } from "react-native";
import Button from "react-native-button";
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
var moment = require('moment');

import ProjectionView from "../components/ProjectionView";
import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');


class ProjectionScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      fetchedData: [],
      dataSource: "",
      isLoading: true,
      saveLoading: false,
      scrolling: false,
      entries: [],
      date: new Date(),
      showLastUpdate:false,
      lastUpdate:"",
      reset: false,
      token: "",
      user_id: "",
    };
 
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  static navigationOptions = {
    headerTitle: 'Projection',
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

  logoutAlert(){
    Logout.showAlert(this.props);
  };

  getData(){
    this.setState({
      isLoading:true,
    });

    AsyncStorage.getItem('@app:token').then(authToken => {
      this.setState({token: authToken});

      AsyncStorage.getItem('@app:user_id').then(userId => {
        this.setState({user_id: userId});

        fetch(Config.apiUrl + '/projection/check',{
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
          }else{
            this.setState({
              showLastUpdate: false,
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
        },
        },
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
 
  addComment = () => {
    this.setState({isVisible: !this.state.isVisible});
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
      var pdVar = 'projection';
      var cVar = 'comment';

      var body = {user_id:this.state.user_id, date:this.getYYYYMMDD(this.state.date), data: []};
      for (var i = 0; i < fetchedData.length; i++) {
        var pro = {};
        pro[pVar] = fetchedData[i].id;
        pro[pdVar] = fetchedData[i].qty;
        pro[cVar] = fetchedData[i].comment;
        body.data.push(pro);
      }

      return fetch(Config.apiUrl + '/projections/store',{
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
          console.log(responseJson);
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

  myCallbackComment = (id,comment) => {
    var index = this.state.fetchedData.findIndex(x=> x.id === id);
    if (index>=0) {
      this.setState({
        fetchedData: [
          ...this.state.fetchedData.slice(0,index),
          Object.assign({}, this.state.fetchedData[index], {comment: comment}),
          ...this.state.fetchedData.slice(index+1)
        ]
      });
    }
    else{
      const obj = {'id':id, 'qty':'', 'comment':comment};
      this.state.fetchedData.push(obj);
    }
  };

  extractEntries = (data) => {
    var entries=[];
    var strEntries=[];
    for (var i = 0; i < data.length; i++) {
      var index = entries.findIndex(x=> x.initial === data[i].initial);
      if (index>=0){
        entries[index] = {'initial': data[i].initial,'projection': parseInt(entries[index].projection + parseInt(data[i].projection))};
      }
      else{
        const obj = {'initial':data[i].initial, 'projection':parseInt(data[i].projection)};
        entries.push(obj);
      }
    }
    entries.map(function(item) {
      strEntries.push(item['initial']+'/'+item['projection']);
    });
    return strEntries.join(', ');
  };

  extractComments = (data) => {
    var comments=[];
    for (var i = 0; i < data.length; i++) {
      if (data[i].comment!=null)
        comments.push(data[i].initial,data[i].comment);
    }
    return comments;
  };

  _renderItem = ({ item, index }) => (
    <ProjectionView
      navigation={this.props.navigation}
      reset={this.state.reset}
      inputQty={this.myCallbackQty}
      inputComment={this.myCallbackComment}
      pId={item[0].id}
      name={item[0].name}
      fetchedValueIndex={this.state.fetchedData.findIndex(x=> x.id == item[0].id)}
      fetchedValue={this.state.fetchedData}
      totalProjection={item[2].projectionTotal}
      todayProjection={item[3].todayProjectionTotal}
      todayProduction={item[4].todayProductionTotal}
      todayWastage={item[5].todayWastageTotal}
      hasComment
      entries={this.extractEntries(item[1].projections)}
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
                  color: "#230A59", textAlign: 'center', fontFamily:AppStyles.fontName.bold}}>PROJECTION</Text>
                <Text style={{flex:0.22,fontSize: 16,
                  color: "#230A59", textAlign: 'center', fontFamily:AppStyles.fontName.bold}}>QTY</Text>
          </View>

          <ScrollView 
            onScrollBeginDrag={this.onScrollStart} 
            onScrollEndDrag={this.onScrollEnd} 
            style={this.state.scrolling ? 
              {borderTopWidth:3,borderRadius:5,borderBottomWidth:3,borderColor:"#DCDCDC"} 
              : null}>
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
            mode="date"
            format={settings_date_format}
            customStyles={{
              dateInput: {
                flexDirection:'row',
                borderWidth:0,
              },
              dateTouchBody: {
                flex:1,
                width:'100%',
                margin:10,
                borderWidth:0,
              },
              dateText: styles.date,
            }}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            minDate={new Date()}
            onDateChange={(date,datestr) => 
              {
                this.setState({date: datestr});
                this.getData();
              }} 
          /> 
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default ProjectionScreen;
