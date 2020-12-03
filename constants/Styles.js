'use strict';
import { AppStyles } from "./AppStyles";
// import { StyleSheet } from "react-native";

var React = require('react-native');
var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
// let style = StyleSheet.create({
  dateInput: {
    flexDirection:'row',
    borderWidth:0,
    marginRight:10,
  },
  dateTouchBody: {
    flex:1,
    width:'100%',
    margin:10,
    borderWidth:0,
  },
  dateText: {
    flex:1,
    textAlign:"right", 
    fontSize: 14, 
    color:'#fff',
    fontFamily: AppStyles.fontName.bold
  },
  container: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    backgroundColor: '#230A59',
  },
  card: {
    flex:0.995,
    width:'93%',
    paddingBottom:45,
    borderRadius: 10
  },
  btnContainer: {
    width: '30%',
    backgroundColor: '#5C73F2',
    borderRadius: 5,
    padding: 10,  
    marginTop: 20
  },
  btnText: {
    fontSize: 14,
    color: AppStyles.color.white,
    fontFamily: AppStyles.fontName.bold
  },
  content: {
    margin: 5,
    padding: 5,
    textAlign: "center",
    fontSize: AppStyles.fontSize.content,
    color: AppStyles.color.text
  },
  dateContainer: {
    margin: 5,
    flexDirection: "row"
  },
  date: {
    flex:1,
    textAlign:"right", 
    fontSize: 14, 
    color:'#fff',
    fontFamily: AppStyles.fontName.bold,
  },
  dataHead: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom:5,
    marginHorizontal:10,
  },
  data: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  list: {
    fontFamily: AppStyles.fontName.semiBold,
    textAlign: "center",
    padding:2,
    paddingBottom:4,
    marginTop:5,
    fontSize: 16,
    borderRadius:5,
  },
  listType1: {
    color:'#fff',
    backgroundColor: "#5C73F2",
  },

  //Login
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },  
  viewIconText:{
    flexDirection:'row',
    alignItems:'center',
    marginBottom: 20,
    fontFamily: AppStyles.fontName.bold,
  },
  loginContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: "#5C73F2",
    borderRadius: AppStyles.borderRadius.main,
    padding: 10,
    marginTop: 30
  },
  loginText: {
    fontFamily: AppStyles.fontName.bold,
    color: AppStyles.color.white
  },
  InputContainer: {
    width: AppStyles.textInputWidth.main,
    marginTop: 10,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: AppStyles.color.grey,
    borderRadius: AppStyles.borderRadius.small
  },
  body: {
    height: 42,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: AppStyles.fontName.bold,
    color: AppStyles.color.text,
  },


  //Dashboard
  card1: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#5C73F2", 
    borderColor: "#5C73F2",
    elevation:5,
    borderRadius: 5,
    aspectRatio: 1,
  },
  text1: {
    fontFamily: AppStyles.fontName.semiBold,
    textAlign: "center",
    fontSize: 18,
    color:'#fff',
  },
  card2: {
    marginTop:5,
    paddingVertical:5,
    backgroundColor: "#5C73F2", 
    borderColor: "#5C73F2",
    borderRadius: 5
  },
  text2: {
    paddingBottom:3,
    fontFamily: AppStyles.fontName.semiBold,
    textAlign: "center",
    fontSize: 18,
    color:'#fff',
  },

  //Production, Projection, Wastage
  list2: {
    fontFamily: AppStyles.fontName.semiBold,
    textAlign: "center",
    height:32,
    padding:2,
    marginTop:5,
    marginLeft:-10,
    marginRight:-10,
    fontSize: 16,
    borderRadius:5,
  },
  lastUpdate:{
    padding:0,
    margin:0,
    color:"#fff",
    fontSize: 12,
    fontFamily: AppStyles.fontName.semiBold,
  },

  //ProductView, ProjectionView, WastageView
  data: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataSelected:{
    marginVertical:5,
    borderWidth:.5,
    borderRadius:5,
  },
  textInput: {
    flex:0.22,
    fontSize: 14,
    textAlign: 'center',
    fontFamily: AppStyles.fontName.main,
    padding:0,
    borderRadius:5,
    borderBottomWidth: 1,
  },
  overlay: {
    borderRadius: AppStyles.borderRadius.small,
    elevation:5
  },
  btnText: {
    color: AppStyles.color.white,
    fontFamily: AppStyles.fontName.bold,
    fontSize:16,
  },
  comment: {
    fontSize: 14,
    height:130,
    borderRadius:5,
    padding:5,
    marginVertical:5,
    textAlignVertical:"top",
    borderWidth:1
  },


  //ANZDeposite, TillFloat
  headText: {
    flex:0.33,
    fontSize: 16,
    textAlign: 'center', 
    color: "#230A59", 
    fontFamily: AppStyles.fontName.bold
  },
  subText: {
    flex:0.33,
    fontSize:14,
    textAlign:'center',
    fontFamily: AppStyles.fontName.main
  },
  subtotalTitle: {
    flex:0.66,
    fontSize:16,
    textAlign:'right',
    fontFamily: AppStyles.fontName.bold
  },
  subtotalValue: {
    flex:0.33,
    fontSize: 16, 
    textAlign: 'center',
    fontFamily: AppStyles.fontName.bold
  },
  finaltotalTitle: {
    flex:0.66,
    fontSize: 18, 
    textAlign: 'right',
    fontFamily: AppStyles.fontName.bold
  },
  finaltotalValue: {
    flex:0.33,
    fontSize: 18, 
    textAlign: 'center',
    fontFamily: AppStyles.fontName.bold
  },

  //Conclusion

  //Recipe
  recipeCard: {
    flex:1,
    flexDirection: 'row'
  },

  //ListdetailView
  textInput2: {
    width:'100%',
    fontSize: 14 ,
    textAlign: 'center',
    fontFamily: AppStyles.fontName.main,
    padding:0,
    borderRadius:5,
    borderBottomWidth: 1,
  },
  checkbox: {
    padding:0,
    margin:0,
    paddingLeft:5,
  },
  
  dateLabelContainer: {
    margin: 5,
    flexDirection: "row",
    width: '100%',
    justifyContent: 'space-between',
  },
  
  dateLabelDisabled: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  
  dateTextDisabled: {
    fontSize: 14,
    color: '#fff',
    fontFamily: AppStyles.fontName.bold,
  },
  
  dateTouchBodyDisabled: {
    flex: 1,
    width: '100%',
    margin: 10,
    borderWidth: 0,
  },

});

// export default style;