import React, { Component } from "react";
import { Text, TextInput, View, CheckBox} from "react-native";

import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');

export default class VoucherView extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      textInput: this.props.value,
    };
  }

  clearInput(){
    this.setState({textInput:""});
  };

  render(){
  	return (
      <View style={styles.data}>
        <Text style={{flex:0.64,fontSize: 14,fontFamily:AppStyles.fontName.main}}>
          {this.props.name}</Text>
        <Text style={{flex:0.03,fontSize: 14,textAlign:'center',fontFamily:AppStyles.fontName.main}}>$</Text>
        <TextInput
            keyboardType='numeric' 
            style={[styles.textInput,{flex:0.33}]}
            editable={this.props.editable}
            onChangeText={qty => {
              this.setState({textInput: qty});
              var pId = this.props.pId;
              this.props.inputQty(pId,qty);
            }}
            value={this.state.textInput}
            placeholder="0"
          />
      </View>
    );
  }
}
