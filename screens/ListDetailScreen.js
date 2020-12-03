import React from "react";
import { Text, TextInput, View,
    Platform, LayoutAnimation, Alert, FlatList, ActivityIndicator,
    UIManager, ScrollView, KeyboardAvoidingView,
    AsyncStorage,
  } from "react-native";
import Button from "react-native-button";
import { NavigationActions } from 'react-navigation';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';

import ListDetailView from "../components/ListDetailView";
import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');

class ListDetailScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('listName', 'List'),
    headerLeft: (
      <Icon
        style={{fontSize:18,padding:15}}
        name="chevron-left"
        color="#230A59"
        onPress={() => navigation.dispatch(NavigationActions.back())}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      fetchedData: [],
      isLoading: true,
      scrolling: false,
      dataSource: "",
      date: new Date(),
      reset: false,
      token: "",
      valid:true,
      user_id: "",
      list_id: this.props.navigation.getParam('listId', '-1'),
    }


    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    this.getData();
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

  getData(){
    AsyncStorage.getItem('@app:token').then(authToken => {
      this.setState({token: authToken});
      console.log({token: authToken});
      return fetch(Config.apiUrl + '/list/entries/value?list_id='+this.state.list_id,{
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
              dataSource: responseJson.data,
              isLoading: false,
            });
          }
          else if(responseJson.message=="You are not authorized to access this page."){
            this.logoutAlert();
          }
          else{
            Alert.alert(
              'Alert',
              'No data found!',
              [
                {text: 'Ok', onPress: () => this.props.navigation.goBack(null)}
              ],
              {cancelable: false},
            );
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

  myCallbackValue = (id,value) => {
    var index = this.state.fetchedData.findIndex(x=> x.list_item_id === id);
    if (index>=0) {
      this.setState({
        fetchedData: [
          ...this.state.fetchedData.slice(0,index),
          Object.assign({}, this.state.fetchedData[index], {entry_value: value}),
          ...this.state.fetchedData.slice(index+1)
        ]
      });
    }
    else{
      const obj = {'list_item_id':id, 'entry_value':value};
      this.state.fetchedData.push(obj);
    }
  };

  isValid = (valid) => {
    this.setState({valid:valid});
  };

  extractEntries = (data) => {
    var entries=[];
    if (data.length>0) {
      for (var i = 0; i < data.length; i++) {
        if(data[i].initial!=null && data[i].entry_value!=null)
          entries.push(data[i].initial,data[i].entry_value,data[i].date);
      }
    }
    return entries;
  };

  extractFields = (data) => {
    var fields=[];
    if (data.length>0) {
      for (var i = 0; i < data.length; i++) {
        if(data[i].field_name!=null && data[i].field_value!=null)
          fields.push(data[i].field_name,data[i].field_value);
      }
    }
    return fields;
  };

  removeBlankValue = () => {
    var array = this.state.fetchedData;
    var length = array.length;
    for (var i = 0; i < length; i++) {
      var index = array.findIndex(x=> x.entry_value == "");
      if (index>=0) {
        array.splice(index, 1);
      }
    }
    return array;
  };

  onPressSave = () => {
    var array = this.removeBlankValue();
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
      var pVar = 'list_item_id';
      var pdVar = 'entry_value';

      var body = {user_id:this.state.user_id,list_id:this.state.list_id,data: []};
      for (var i = 0; i < fetchedData.length; i++) {
        var pro = {};
        pro[pVar] = fetchedData[i].list_item_id;
        pro[pdVar] = fetchedData[i].entry_value;
        body.data.push(pro);
      }

      console.log(body);

      return fetch(Config.apiUrl + '/list/entries/store',{
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

  _renderItem = ({ item }) => (
    <ListDetailView
      item={item}
      list_id={this.state.dataSource.list[0].list_id}
      item_type={item.item_type}
      item_id={item.item_id}
      item_name={item.item_name}
      inputValue={this.myCallbackValue}
      valid={this.isValid}
      fields={item.fields!=undefined?this.extractFields(item.fields):[]}
      entries={item.entries!=undefined?this.extractEntries(item.entries):[]}
    />
  );

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Card containerStyle={styles.card}>
          <View style={styles.dataHead}>
            <Text style={{flex:0.35,fontSize: 16,
              color: "#230A59", fontFamily:AppStyles.fontName.bold}}>Item</Text>
            <Text style={{flex:0.325,fontSize: 16,
              color: "#230A59", textAlign: 'center', fontFamily:AppStyles.fontName.bold}}></Text>
            <Text style={{flex:0.325,fontSize: 16,
              color: "#230A59", textAlign: 'center', fontFamily:AppStyles.fontName.bold}}>Value</Text>
          </View>

          {this.state.isLoading ? <ActivityIndicator/> :
          <ScrollView onScrollBeginDrag={this.onScrollStart} onScrollEndDrag={this.onScrollEnd} style={this.state.scrolling ? {borderTopWidth:3,borderRadius:5,borderBottomWidth:3,borderColor:"#DCDCDC"} : null}>
            <View style={styles.content}>
              <FlatList
                data={this.state.dataSource.items}
                horizontal={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </ScrollView>
        }
        </Card>
        <Button
          disabled={!this.state.valid}
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
            customStyles={{
              dateInput:styles.dateInput,
              dateTouchBody:styles.dateTouchBody,
              dateText:styles.dateText
            }}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default ListDetailScreen;
