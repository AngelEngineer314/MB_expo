import React from "react";
import { Text, TextInput, View,  AsyncStorage, BackHandler,
    Platform, LayoutAnimation, Alert, FlatList, ActivityIndicator,
    UIManager, TouchableOpacity} from "react-native";
import { Card, Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
var moment = require('moment');

import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');

class DashboardScreen extends React.Component {

  _didFocusSubscription;
  _willBlurSubscription;

  static navigationOptions = {
    headerTitle: 'Dashboard',
  };

  constructor(props) {
    super(props);

    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid));

    this.state = {
      isLoading2: true,
      isLoading: true,
      scrolling: false,
      date: "",
      token: "",
      user_id: "",
    }

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.getSettings();

  };

  componentDidMount(){
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid));

    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      // The screen is focused
      // Call any action
      this.getData();
    });
  };

  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
    // Remove the event listener
    this.focusListener.remove();
  };

  onBackButtonPressAndroid =  () => {
    Alert.alert(
      'Exit',
        'Want to exit?',
        [
          {text: 'No', style: 'cancel'},
          {text: 'Yes', onPress: () => BackHandler.exitApp()}
        ],
        {cancelable: false},
    );
    return true;
  };

  logoutAlert(){
    Logout.showAlert(this.props);
  };

  parseFloat2Decimals = (value) => {
    return parseFloat(parseFloat(value).toFixed(2));
  };

  formatDate = (format) => {
    var new_format = "";
    new_format = format.replace("d", "DD");
    new_format = new_format.replace("M", "MMM");
    new_format = new_format.replace("m", "MM");
    new_format = new_format.replace("Y", "YYYY");
    return new_format;
  };

  getSettings(){
    AsyncStorage.getItem('@app:token').then(authToken => {
      return fetch(Config.apiUrl + '/business/settings',{
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+authToken,
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading2: false,
        });
        global.settings_date_format = this.formatDate(responseJson.data.date_format);
      })
      .catch((error) =>{
        console.error(error);
      });
    });
  };

  getData(){
    this.setState({isLoading:true});
    AsyncStorage.getItem('@app:token').then(authToken => {
      this.setState({token: authToken});

      return fetch(Config.apiUrl + '/list/entries',{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+this.state.token,
          }
        })
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

  _renderItem = ({ item, index }) => (
    <TouchableOpacity style={{flex:1}} onPress={() => this.openList(item.id,item.list_name,item.input_type)}>
      <Card containerStyle={styles.card2}>
        <Text style={styles.text2}>{item.list_name}</Text>
      </Card>
    </TouchableOpacity>
  );

  openList = (id, name, type) => {
    this.props.navigation.navigate('ListDetail', {
      listId: id.toString(),
      listType: type,
      listName: name,
    });
  };

  onScrollStart = () => {
    this.setState({scrolling: true});
  };
  onScrollEnd = () => {
    this.setState({scrolling: false});
  };

  render() {
    return (
      <View style={[styles.container,{alignItems:null}]}>
      {this.state.isLoading2 ? <ActivityIndicator/> :
      <View>
        {Config.apiUrl == "http://cafe.phoenixcode.in/api" ? <Text style={styles.text1}>{Config.apiUrl}</Text> : null}
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity style={{flex:0.5}} onPress={() => this.props.navigation.navigate('Projection')}>
            <Card containerStyle={[styles.card1]}>
              <Icon
                style={{alignSelf:'center'}}
                name="product-hunt"
                size={50}
                color="white"
              />
              <Text style={styles.text1}>Projection</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:0.5}} onPress={() => this.props.navigation.navigate('Production')}>
            <Card containerStyle={styles.card1}>
              <Icon
                style={{alignSelf:'center'}}
                name="product-hunt"
                size={50}
                color="white"
              />
              <Text style={styles.text1}>Production</Text>
            </Card>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity style={{flex:0.5}} onPress={() => this.props.navigation.navigate('Wastage')}>
            <Card containerStyle={styles.card1}>
              <Icon
                style={{alignSelf:'center'}}
                name="trash"
                size={50}
                color="white"
              />
              <Text style={styles.text1}>Wastage</Text>
            </Card>
          </TouchableOpacity>
          <TouchableOpacity style={{flex:0.5}} onPress={() => this.props.navigation.navigate('Counter')}>
            <Card containerStyle={styles.card1}>
              <Icon
                style={{alignSelf:'center'}}
                name="money"
                size={50}
                color="white"
              />
              <Text style={styles.text1}>Business Entry</Text>
            </Card>
          </TouchableOpacity>
        </View>
        {this.state.isLoading ? <ActivityIndicator/> :
          (<View style={{flexDirection:"row",marginTop:10}}>
            <FlatList
              data={this.state.dataSource.data}
              horizontal={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this._renderItem}
              showsVerticalScrollIndicator={false}
            />
          </View>)
        }
      </View>
      }
      </View>
    );
  }
}

export default DashboardScreen;
