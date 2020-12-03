import React, { useEffect, useState } from "react";
import { Text, TextInput, View,  AsyncStorage, BackHandler, Image, Linking, ScrollView,
    Platform, LayoutAnimation, Alert, FlatList, ActivityIndicator, Modal,
    UIManager, TouchableOpacity} from "react-native";
import { NavigationActions } from 'react-navigation';
import ImageViewer from 'react-native-image-zoom-viewer';
import * as WebBrowser from 'expo-web-browser';
import { Card, Button, Avatar} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-datepicker';
var moment = require('moment');

import Logout from './LogoutScreen';
import Config from '../constants/Config.js';
import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');
const photoExt = ["jpg","jpeg","png","bmp"];
const filesExt = ["svg","doc","docx","pdf","odt","txt","xls","xlsx"];
const filesImages = [
 {
    ext: 'svg',
    thumbnail: require('../assets/images/svg-file.png')
 },
 {
    ext: 'doc',
    thumbnail: require('../assets/images/doc-file.png')
 },
 {
    ext: 'docx',
    thumbnail: require('../assets/images/doc-file.png')
 },
 {
    ext: 'pdf',
    thumbnail: require('../assets/images/pdf-file.png')
 },
 {
    ext: 'odt',
    thumbnail: require('../assets/images/odt-file.png')
 },
 {
    ext: 'txt',
    thumbnail: require('../assets/images/txt-file.png')
 },
 {
    ext: 'xls',
    thumbnail: require('../assets/images/excel-file.png')
 },
 {
    ext: 'xlsx',
    thumbnail: require('../assets/images/excel-file.png')
 }
];

class RecipeScreen extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    headerTitle: navigation.getParam('itemName', 'Recipes'),
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
      dataSource: [],
      isLoading: true,
      scrolling: false,
      date: "",
      token: "",
      user_id: "",
      result: "",
      showImageModel: false,
      imageUrl:[],
      filesUrl: [],
      otherUrl:[],
      currentImageIndex: 0,
      itemId: props.navigation.getParam('itemId', 'NO-ID')
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
  };

  componentWillUnmount() {
    // Remove the event listener
    this.focusListener.remove();
  };

  closeModal =  () => {
    if (this.state.showImageModel) {
      this.setState({showImageModel: false});
    }
  };

  logoutAlert(){
    Logout.showAlert(this.props);
  };

  showImageModel(key){
    //this.setState({showImageModel: true});
    if (!this.state.showImageModel){
      this.setState({showImageModel: true, currentImageIndex: key});
    }
  };

  getData(){
    this.setState({isLoading:true});
    AsyncStorage.getItem('@app:token').then(authToken => {
      this.setState({token: authToken});

      return fetch(Config.apiUrl + '/product/recipes/?product_id='+this.state.itemId,{
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
            var images = [];
            var files = [];
            var others = [];
            if (this.state.dataSource.data.recipes!=undefined) {
              var data = this.state.dataSource.data.recipes;
              for (var i = data.length - 1; i >= 0; i--) {
                var path = data[i].file_path;
                var ext = path.substr(path.lastIndexOf('.') + 1).toLowerCase();
                if (photoExt.includes(ext))
                  images.unshift({url:data[i].file_path});
                else if (filesExt.includes(ext))
                  files.unshift({url:data[i].file_path});
                else
                  others.unshift({url:data[i].file_path});
              }
              this.setState({imageUrl:images,filesUrl:files,otherUrl:others});
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

  onScrollStart = () => {
    this.setState({scrolling: true});
  };
  onScrollEnd = () => {
    this.setState({scrolling: false});
  };

  getPicture = (url) =>{
    let ext = url.substr(url.lastIndexOf('.') + 1);
    let index = -1;
    Object.keys(filesImages).map((keyName, i) => {
      if(filesImages[keyName].ext == ext){
        index = i;
      }
    });
    return filesImages[index].thumbnail;
  }

  _handlePressButtonAsync = async (url) => {
    let result = await WebBrowser.openBrowserAsync(url);
    this.setState({ result });
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal onRequestClose={() => {this.closeModal();}} visible={this.state.showImageModel} transparent={true}>
          <ImageViewer enableSwipeDown onCancel={()=>this.closeModal()} imageUrls={this.state.imageUrl} index={this.state.currentImageIndex}/>
        </Modal>
        <Card containerStyle={styles.card}>
          {this.state.isLoading ? <ActivityIndicator/> :
            <View style={styles.content}>
              {this.state.dataSource.data.length==0 ?
                <Text>{this.state.dataSource.message}</Text>
              :
                <ScrollView>
                  {this.state.imageUrl.map((item, key) => {
                    return (
                      <View key={key} style={{marginVertical:5}}>
                        <TouchableOpacity style={{alignItems:'center'}} onPress={() => {this.showImageModel(key);}}>
                          <Image resizeMode="center" source={{uri: item.url}} style={{ width: 305, height: 159 }}/>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  {this.state.filesUrl.map((item, key) => {
                    return (
                      <TouchableOpacity key={key} onPress={() => this._handlePressButtonAsync(item.url)}>
                        <Card>
                          <View style={styles.recipeCard}>
                            <Avatar source={this.getPicture(item.url)}/>
                            <Text style={{color:"blue",marginLeft:10,paddingRight:25}}>
                              {item.url.substr(item.url.lastIndexOf('/') + 1)}</Text>
                          </View>
                        </Card>
                      </TouchableOpacity>
                    );
                  })}
                  {this.state.otherUrl.map((item, key) => {
                    return (
                      <TouchableOpacity key={key} onPress={() => this._handlePressButtonAsync(item.url)}>
                        <Card>
                          <View style={styles.recipeCard}>
                            <Text style={{color:"blue"}}>
                              {item.url.substr(item.url.lastIndexOf('/') + 1)}</Text>
                          </View>
                        </Card>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              }
            </View>
          }
        </Card>
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
      </View>
    );
  }
}

export default RecipeScreen;
