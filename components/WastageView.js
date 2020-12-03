import React, { Component } from "react";
import { Text, TextInput, View, Platform, LayoutAnimation, UIManager, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');

export default class ProductView extends Component {
  constructor() {
    super();
    this.state = { 
      expanded: false,
      textInputs: "",
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  clearInput(){
    this.setState({textInput:""});
  };

  componentWillReceiveProps(newProps) {
    if (newProps.reset) {
      this.clearInput();
    }
  };

  changeLayout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({expanded: !this.state.expanded});
  };

  render(){
  	return (
     	<View style={[{paddingHorizontal:9,paddingVertical:5},this.state.expanded ? styles.dataSelected : null]}>
        <View style={styles.data}>
          <TouchableOpacity style={{flex:0.37}} onPress={() => this.props.navigation.push('Recipe',{itemId:this.props.pId.toString(), itemName: this.props.name})}>
            <Text style={{fontSize: 14,fontFamily:AppStyles.fontName.main}}>
              {this.props.name}</Text>
          </TouchableOpacity>
          <Text style={{flex:0.36,fontSize: 14, textAlign: 'center',fontFamily:AppStyles.fontName.main}}>
  	        {this.props.todayWastage}/{this.props.todayProduction}</Text>
  	      <TextInput 
            keyboardType='numeric' 
            style={styles.textInput}
            onChangeText={qty => {
              this.setState({textInput: qty});
              var pId = this.props.pId;
              this.props.inputQty(pId,qty);
            }}
            value={this.state.textInput}
            placeholder="0"
          />
        {this.props.entries!="" || this.props.comments.length>0 ? (<Icon style={{marginRight:-6,flex:0.07,textAlign:'center',paddingVertical:6}} name={this.state.expanded ? "chevron-up" : "chevron-down"} color="#230A59" onPress={this.changeLayout}/>) : null}
  	    </View>
        <View style={{height: this.state.expanded ? null : 0, overflow: 'hidden'}}>
          {this.props.entries!="" ? (<Text style={{fontSize: 12,fontFamily:AppStyles.fontName.semiBold}}>{this.props.entries}</Text>) : null}
              	
          {this.props.comments.map((prop, key) => {
            if(key%2==0){
              return (
                <View key={key} style={{flexDirection:'row'}}>
                  <Text style={{fontSize: 12,fontFamily:AppStyles.fontName.semiBold}}>
                    {this.props.comments[key]}: </Text>
                  <Text style={{fontSize: 12,paddingRight:15,fontFamily:AppStyles.fontName.main}}>
                    {this.props.comments[key+1]}</Text>
                </View>
              );
            }
          })}
      	</View>
      </View>
    );
  }
}
