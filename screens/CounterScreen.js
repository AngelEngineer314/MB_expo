import React from "react";
import {ActivityIndicator, AsyncStorage, FlatList, Text, TouchableOpacity, View} from "react-native";
import {Card} from 'react-native-elements';

import Logout from './LogoutScreen';
import Config from "../constants/Config";

const styles = require('../constants/Styles.js');

class CounterScreen extends React.Component {

  static navigationOptions = {  
    headerTitle: 'Select Counter',
  };  

  constructor() {
    super();
    this.state = { 
      fetchedData: [],
      isLoading: true,
      isLoaded: false,
      date: new Date(),
      token: "",
      user_id: "",
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

  getData(){
    this.setState({
        isLoading:true,
    });
    AsyncStorage.getItem('@app:token').then(authToken => {
      this.setState({token: authToken});

      // TODO call counter api
      return fetch(Config.apiUrl + '/business/counters',{
          method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+this.state.token,
            }}
         )
        .then((response) => response.json())
        .then((responseJson) => {
          if(responseJson.data.length>0){
            var data = responseJson.data;
            if(data.length>0){
              if (data.length == 1) {
                CounterScreen.fetchBusiness(data[0].id).then(() => {
                  this.props.navigation.navigate('Voucher', { counter_id: data[0].id });
                });

                return;
              }

              this.setState({
                fetchedData: data,
                isLoading: false,
                isLoaded: true,
              });
            }
            else{
              this.setState({
                isLoading: false,
              });
            }
          }else{
            this.setState({
              isLoading: false,
            });
          }
        })
        .catch((error) =>{
          console.error(error);
        });
    });
  };

  handleCounterTap(item) {
    this.setState({ isLoading: true });

    CounterScreen.fetchBusiness(item.id)
      .then(() => {
        this.setState({ isLoading: false });
        this.props.navigation.navigate('Voucher', { counter_id: item.id });
      }).catch((error) => {
        this.setState({ isLoading: false });
        console.error(error);
      });
  }

  static fetchBusiness(counter_id) {
    return AsyncStorage.getItem('@app:token').then(authToken => {
      return fetch(Config.apiUrl + '/business', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'Authorization': 'Bearer ' + authToken,
        },
        body: JSON.stringify({
          counter_id
        })
      })
        .then((response) => response.json())
        .then(responseJson => {
          return AsyncStorage.setItem('@app:business', JSON.stringify(responseJson))
            .then(() => responseJson);
        });
    });
  }

  _renderItem = ({ item, index }) => (
    <TouchableOpacity style={{flex:1}}
        onPress={() => this.handleCounterTap(item)}>
      <Card containerStyle={styles.card2}>
        <Text style={styles.text2}>{item.name}</Text>
      </Card>
    </TouchableOpacity>
  );

  render() {
    return (
        <View style={styles.container}>
            {this.state.isLoading ? <ActivityIndicator/> : (
            <View style={{flexDirection:"row",marginTop:10}}>
                <FlatList
                data={this.state.fetchedData}
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

export default CounterScreen;
