import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import { AppStyles } from "../constants/AppStyles";

class DrawerItem extends React.Component {
 
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case "Dashboard":
        return (
          <Icon
            name="home"
            size={20}
            color={focused ? "white" : "#230A59"}
          />
        );
      case "Projection":
        return (
          <Icon
            name="product-hunt"
            size={20}
            color={focused ? "white" : "#230A59"}
          />
        );
      case "Production":
        return (
          <Icon
            name="product-hunt"
            size={20}
            color={focused ? "white" : "#230A59"}
          />
        );
      case "Wastage":
        return (
          <Icon
            name="trash"
            size={20}
            color={focused ? "white" : "#230A59"}
          />
        );
      case "Business Entry":
        return (
          <Icon
            name="money"
            size={20}
            color={focused ? "white" : "#230A59"}
          />
        );
      case "Stock Entry":
        return (
          <Icon
            name="product-hunt"
            size={20}
            color={focused ? "white" : "#230A59"}
          />
        );
      case "Lists":
        return (
          <Icon
            name="list"
            size={20}
            color={focused ? "white" : "#230A59"}
          />
        );
      case "Logout":
        return <Icon />;
      default:
        return null;
    }
  };

  render() {
    const { focused, title } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];

    return (
      <View style={[containerStyles,{flexDirection:'row'}]}>
        <View style={{flex:0.1, alignItems:'center', marginRight: 5 }}>
          {this.renderIcon()}
        </View>
        <View style={{flexDirection:'row', flex:0.9, alignItems:'center', justifyContent:'center'}}>
          <Text
            style={[focused ? styles.textFocused : styles.textNormal]}>
            {title}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14
  },
  textFocused: {
    padding:0,
    color:"#fff",
    fontSize: 16,
    fontFamily: AppStyles.fontName.semiBold,
  },
  textNormal: {
    padding:0,
    color:"#230A59",
    fontSize: 16,
    fontFamily: AppStyles.fontName.main,
  },
  activeStyle: {
    backgroundColor: "#230A59",
    borderRadius: 4
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
