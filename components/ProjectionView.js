import React, { Component } from "react";
import { Text, TextInput, View, Platform, LayoutAnimation, UIManager, TouchableOpacity} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from "react-native-button";
import { Overlay } from 'react-native-elements';

import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');

export default class ProjectionView extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      expanded: false,
      isVisible: false,
      textInput: this.props.fetchedValueIndex>-1 ? this.props.fetchedValue[this.props.fetchedValueIndex].qty : "",
      comment: this.props.fetchedValueIndex>-1 ? this.props.fetchedValue[this.props.fetchedValueIndex].comment : "",
      showComment: this.props.fetchedValueIndex>-1 ? (this.props.fetchedValue[this.props.fetchedValueIndex].comment!=""?true:false) : false,
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

  addComment = () => {
    if(this.state.comment!=""){
      this.setState({showComment: true});
    }else{
      this.setState({showComment: false});
    }
    var pId = this.props.pId;
    this.props.inputComment(pId,this.state.comment);
    this.setState({isVisible: !this.state.isVisible});
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
            {this.props.todayProjection}</Text>
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
            
          {this.props.hasComment ? (<Icon style={{marginRight:-6,flex:0.07,textAlign:'center',paddingVertical:6}} name={this.state.expanded ? "chevron-up" : "chevron-down"} color="#230A59" onPress={this.changeLayout}/>) : null}
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

          {this.state.showComment ? 
            (
              <View style={{flexDirection:'row'}}>
                <Text style={{fontSize: 12,fontFamily:AppStyles.fontName.semiBold}}>
                  RM: </Text>
                <Text style={{fontSize: 12,paddingRight:15,fontFamily:AppStyles.fontName.main}}>
                  {this.state.comment}</Text>
                </View>
            ):null}

          <Icon 
            style={{textAlign:'center', fontSize:20, marginTop:5}} 
            name="plus-circle" 
            color="#5C73F2" 
            onPress={this.addComment}/>
          <Overlay
            onBackdropPress={() => this.setState({ isVisible: false })}
            overlayStyle={styles.overlay}
            height="auto"
            isVisible={this.state.isVisible}>
            <View>
              <Text style={{fontSize: 16}}>Add comment</Text>
              <TextInput
                multiline
                style={styles.comment}
                onChangeText={text => this.setState({ comment: text })}
                value={this.state.comment}
                placeholder="Type here...">
              </TextInput>
              <Button
                style={[styles.btnText,{
                  alignSelf:"center",
                  marginTop:5,
                  width: '30%',
                  backgroundColor: '#5C73F2',
                  borderRadius: 5,
                  padding: 5}]}
                onPress={this.addComment}>
                Save
              </Button>
            </View>
          </Overlay>
        </View>
      </View>
  	);
  }
}
