import React, { Component } from "react";
import { Text, TextInput, View, Platform, Picker, LayoutAnimation, UIManager} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { CheckBox, Slider, Button } from 'react-native-elements';
import Moment from 'moment';

import { AppStyles } from "../constants/AppStyles";
var styles = require('../constants/Styles.js');

export default class ListDetailView extends Component {
  constructor(props) {
    super();
    this.state = {
      item_type: props.item_type,
      expanded: true,
      textInputs: "",
      checkInputs: false,
      entryDate: "",
      valid:true,
      range: Number(props.item.min_range),
      enum:""
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    if (props.item_type=="Range") {
      props.inputValue(props.item_id,props.item.min_range);
    }
  }

  validate(txt){
    var text = null;
    switch(this.state.item_type) {
      case 'Numberic Textbox':
        text = txt.replace(/[^0-9]/ig,'');
        this.setState({textInput: text});
        break;
      case 'Alphabetic Textbox':
        text = txt.replace(/[^A-Z]/ig,'');
        this.setState({textInput: text});
        break;
      case 'Alphanumeric Textbox':
        text = txt.replace(/[^A-Z0-9]/ig,'');
        this.setState({textInput: text});
        break;
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

  formatDateTime = (dateTime) => {
    var today = Moment().format(settings_date_format);
    var date = Moment(dateTime).format(settings_date_format);
    var datetime = Moment(dateTime).format("ddd hh:mma D/M/YY");
    var time = Moment(dateTime).format("HH:mm");
    if (date==today)
      return time;
    else
      return datetime;
  };

  rangePlus = () => {
    this.setState({range:Number(this.state.range)+1});
    var id = this.props.item_id;
    this.props.inputValue(id,this.state.range.toString());
  };

  rangeMinus = () => {
    this.setState({range:Number(this.state.range)-1});
    var id = this.props.item_id;
    this.props.inputValue(id,this.state.range.toString());
  };

  render(){
    return (
      <View style={[{paddingHorizontal:9,paddingVertical:5},this.state.expanded ? styles.dataSelected : null]}>
        <View style={styles.data}>
          <Text style={{flex:0.35,fontSize: 14,fontFamily:AppStyles.fontName.main}}>
            {this.props.item_name}</Text>
          <Text
            style={{
              flex:0.325,
              alignItems:'center',
              textAlign:'center',
              fontSize: 12,
              fontFamily:AppStyles.fontName.main
            }}
          >
            {this.props.entries.map((prop, key) => {
            if(key%3==0){
              var display = this.formatDateTime(this.props.entries[key+2]!=undefined ? this.props.entries[key+2] : "");
              if (this.props.item_type=="checkbox" && this.props.entries[key+1]=="yes") {
                return (
                  this.props.entries[key]+"/"+display
                );
              }else if (this.props.item_type=="checkbox" && this.props.entries[key+1]=="no") {
                return (
                  null
                );
              }else{
                return (
                  this.props.entries[key]+"/"+this.props.entries[key+1]+"\n"+display
                );
              }
            }
            })}
          </Text>
          <View style={{flex:0.325, alignItems:'center'}}>
          {this.props.item_type=="textbox" ?
            (<TextInput
              style={styles.textInput2}
              onChangeText={qty => {
                this.setState({textInput: qty});
                var id = this.props.item_id;
                this.props.inputValue(id,qty);
              }}
              value={this.state.textInput}
              placeholder="type here"
            />)
            :
            this.props.item_type=="checkbox" ?
            (<CheckBox
              containerStyle={styles.checkbox}
              checkedColor="#230A59"
              onPress={() => {
                this.setState({checkInputs: !this.state.checkInputs});
                var id = this.props.item_id;
                if (!this.state.checkInputs)
                  this.props.inputValue(id,"yes");
                else
                  this.props.inputValue(id,"no");
              }}
              checked={this.state.checkInputs}
            />)
            :
            this.props.item_type=="Numberic Textbox" ?
            (<TextInput
              keyboardType="numeric"
              style={styles.textInput2}
              onChangeText={text => {
                this.validate(text);
                var id = this.props.item_id;
                this.props.inputValue(id,text);
              }}
              value={this.state.textInput}
              placeholder="type here"
            />)
            :
            this.props.item_type=="Alphabetic Textbox" ?
            (<TextInput
              style={styles.textInput2}
              onChangeText={text => {
                this.validate(text);
                var id = this.props.item_id;
                this.props.inputValue(id,text);
              }}
              value={this.state.textInput}
              placeholder="type here"
            />)
            :
            this.props.item_type=="Alphanumeric Textbox" ?
            (<TextInput
              style={styles.textInput2}
              onChangeText={text => {
                this.validate(text);
                var id = this.props.item_id;
                this.props.inputValue(id,text);
              }}
              value={this.state.textInput}
              placeholder="type here"
            />)
            :
            this.props.item_type=="Checkbox" ?
            (<CheckBox
              containerStyle={styles.checkbox}
              checkedColor="#230A59"
              onPress={() => {
                this.setState({checkInputs: !this.state.checkInputs});
                var id = this.props.item_id;
                if (!this.state.checkInputs)
                  this.props.inputValue(id,"yes");
                else
                  this.props.inputValue(id,"no");
              }}
              checked={this.state.checkInputs}
              />)
            :
            this.props.item_type=="Boolean" ?
              (<CheckBox
                containerStyle={styles.checkbox}
                checkedColor="#230A59"
                onPress={() => {
                  this.setState({checkInputs: !this.state.checkInputs});
                  var id = this.props.item_id;
                  if (!this.state.checkInputs)
                    this.props.inputValue(id,"yes");
                  else
                    this.props.inputValue(id,"no");
                }}
                checked={this.state.checkInputs}
              />)
              :
              this.props.item_type=="Enum" ?
              (<Picker
                style={{width:"100%",backgroundColor:'white'}}
                itemStyle={{textAlign: 'center'}}
                selectedValue={this.state.enum}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({enum: itemValue});
                  var id = this.props.item_id;
                  this.props.inputValue(id,itemValue);
                }}>
                <Picker.Item label="Select" value=""/>
                {this.props.item.enum.split(',').map((key)=> {
                  return <Picker.Item key={key} label={key} value={key}/>
                })}
              </Picker>)
              :null}
        {this.props.item_type=="Range" ?
          (<View style={{ flex: 1,flexDirection:"row" , alignItems: 'stretch',alignItems:'center', justifyContent: 'center' }}>
            {/*<Slider
                          style={{flex:0.92}}
                          value={this.state.range}
                          onValueChange={value => {
                            this.setState({ range:value });
                            var id = this.props.item_id;
                            this.props.inputValue(id,value.toString());
                          }}
                          step={1}
                          minimumValue={Number(this.props.item.min_range)}
                          maximumValue={Number(this.props.item.max_range)}
                        />*/}
            <Button
              onPress={this.rangeMinus}
              buttonStyle={{paddingHorizontal:0,paddingVertical:3,flex:0.1}}
              disabled={Number(this.state.range)<=Number(this.props.item.min_range)?true:false}
              icon={{
                name: "remove",
                size: 15,
                color: "white"
              }}/>
              <TextInput
                keyboardType="numeric"
                value={this.state.range.toString()}
                onChangeText={txt => {
                  const text = txt.replace(/!(^[+-]?[0-9]+)/ig,'');
                  this.setState({range: text});
                  if (Number(text)>=Number(this.props.item.min_range) && Number(text)<=Number(this.props.item.max_range)) {
                    this.setState({valid:true});
                    this.props.valid(true);
                  }
                  else{
                    this.setState({valid:false});
                    this.props.valid(false);
                  }
                  var id = this.props.item_id;
                  this.props.inputValue(id,text);
                }}
                style={{
                  backgroundColor:this.state.valid?"white":"red",
                  textAlign:"center",
                  fontSize: 14,
                  marginHorizontal:3,
                  flex:0.8}}/>
            {/*<Text style={{textAlign:"center",marginHorizontal:3,flex:0.8}}>{this.state.range}</Text>*/}
            <Button
              onLongPress={this.rangePlus}
              onPress={this.rangePlus}
              buttonStyle={{paddingHorizontal:0,paddingVertical:3,flex:0.1}}
              disabled={Number(this.state.range)>=Number(this.props.item.max_range)?true:false}
              icon={{
                name: "add",
                size: 15,
                color: "white"
              }}/>
          </View>):null}
          </View>
        </View>
        <View style={{overflow: 'hidden'}}>
          {this.props.fields.map((prop, key) => {
            if(key%2==0){
              return (
                <View key={key} style={{flexDirection:'row'}}>
                  <Text style={{fontSize: 12,fontFamily:AppStyles.fontName.semiBold}}>
                    {this.props.fields[key]}: </Text>
                  <Text style={{fontSize: 12,paddingRight:15,fontFamily:AppStyles.fontName.main}}>
                    {this.props.fields[key+1]}</Text>
                </View>
              );
            }
          })}
        </View>
      </View>
    );
  }
}