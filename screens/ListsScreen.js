import React from "react";
import { Text, TextInput, View, AsyncStorage,
    Platform, LayoutAnimation, Alert, FlatList, ActivityIndicator,
    UIManager, TouchableOpacity} from "react-native";
import { Card} from 'react-native-elements';

import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');

class ListsScreen extends React.Component {

  static navigationOptions = {
    headerTitle: 'Lists',
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      scrolling: false,
      date: "",
      dataSource: "",
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
      this.getData();
    });

    var today = new Date();
    var date=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+ today.getFullYear();
    this.setState({date: date});
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
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
            if(responseJson.data.length>0){
              this.setState({
                dataSource: responseJson,
                isLoading: false,
              });
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
              this.setState({
                isLoading: false,
              });
            }
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
    <TouchableOpacity style={{flex:1}} onPress={() => this.openList(item.id,item.list_name)}>
      <Card containerStyle={styles.card2}>
        <Text style={styles.text2}>{item.list_name}</Text>
      </Card>
    </TouchableOpacity>
  );

  openList = (id, name, type) => {
    this.props.navigation.navigate('ListDetail', {
      listId: id.toString(),
      listName: name
    });
  };

  onScrollStart = () => {
    this.setState({scrolling: true});
  };
  onScrollEnd = () => {
    this.setState({scrolling: false});
  };

  logoutAlert(){
    Logout.showAlert(this.props);
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? <ActivityIndicator/> : (
        <View style={{flexDirection:"row",marginTop:10}}>
          <FlatList
            data={this.state.dataSource.data}
            horizontal={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>)}
      </View>
    );
  }
}

export default ListsScreen;
