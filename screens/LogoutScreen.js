import { Alert,  AsyncStorage } from "react-native";

const Logout = {
  showAlert: (props) => {
    Alert.alert(
      'Alert',
        'Your login token expired or another login from the same user has been detected!',
        [
          {text: 'Logout', onPress: () => {
            Logout.logout(props);
          }}
        ],
        {cancelable: false},
    );
  },
  logout: (props) => {
    try {
      AsyncStorage.clear();
    }catch(exception) {}
    props.navigation.navigate('Login');
  }
}

export default Logout;