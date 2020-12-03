import React from "react";
import { DrawerItems } from "react-navigation";
import {
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  AsyncStorage,
  SafeAreaView,
  Alert,
  Image
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import Logout from '../screens/LogoutScreen.js';

const { width } = Dimensions.get("screen");

const Drawer = props => (
  <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
    <View style={styles.header}>
      <Image style={styles.logo} source={require("../assets/images/icon.png")}/>
    </View>
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <DrawerItems {...props} />
    </ScrollView>
    <TouchableOpacity onPress={()=>
      Alert.alert(
        'Log out',
        'Do you want to logout?',
        [
          {text: 'Cancel', onPress: () => {return null}},
          {text: 'Confirm', onPress: () => {
            Logout.logout(props);
          }},
        ],
        { cancelable: false }
      )  
    }>
      <Text style={{
        borderTopWidth:1,
        borderColor:"#230A59",
        padding:10,
        textAlign:'center',
        color:"#230A59",
        fontSize: 16,
        fontFamily: "Quicksand-SemiBold"}}>
        Logout</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const Menu = {
  contentComponent: props => <Drawer {...props} />,
  drawerBackgroundColor: "white",
  drawerWidth: width * 0.7,
  contentOptions: {
    activeTintColor: "white",
    inactiveTintColor: "#000",
    activeBackgroundColor: "transparent",
    itemStyle: {
      width: width * 0.7,
      backgroundColor: "transparent"
    },
    labelStyle: {
      fontSize: 16,
      marginLeft: 12,
      fontWeight: "normal"
    },
    itemsContainerStyle: {
      paddingVertical: 16,
      paddingHorizonal: 12,
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
      overflow: "hidden"
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 28,
    flex:0.05,
    paddingBottom: 16,
    paddingTop: 16 * 3,
    justifyContent: 'center'
  },
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14
  },
  textFocused: {
    padding:0,
    color:"#fff",
    fontSize: 16,
    fontFamily: "Quicksand-SemiBold",
  },
  textNormal: {
    padding:0,
    color:"#230A59",
    fontSize: 16,
    fontFamily: "Quicksand-Regular",
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

export default Menu;
