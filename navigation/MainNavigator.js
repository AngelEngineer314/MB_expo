import React from 'react';
import { Platform,
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';

import {
  withNavigation,
  DrawerItems,
  DrawerActions,
  createStackNavigator,
  createBottomTabNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  createAppContainer,
  NavigationActions} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import LoginScreen from '../screens/LoginScreen';
import ProductionScreen from '../screens/ProductionScreen';
import ProjectionScreen from '../screens/ProjectionScreen';
import WastageScreen from '../screens/WastageScreen';
import TillFloatScreen from '../screens/TillFloatScreen';
import ANZDepositScreen from '../screens/ANZDepositScreen';
import VoucherScreen from '../screens/VoucherScreen';
import ConclusionScreen from '../screens/ConclusionScreen';
import ListDetailScreen from '../screens/ListDetailScreen';
import ListsScreen from '../screens/ListsScreen';
import SurveysListScreen from '../screens/SurveysListScreen';
import SurveyDetailScreen from '../screens/SurveysDetailScreen';
import DashboardScreen from '../screens/DashboardScreen';
import RecipeScreen from '../screens/RecipeScreen';
import CounterScreen from '../screens/CounterScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Menu from "./Menu";
import DrawerItem from "../components/DrawerItem";

const { width } = Dimensions.get("screen");

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {
    defaultNavigationOptions : ({navigation}) => ({
      headerStyle: {
        backgroundColor: "#fff",
      },
      headerTintColor: '#230A59',
      headerTitleStyle: {
        fontSize: 18,
        fontFamily: "Quicksand-SemiBold"
      },
      headerLeft: (
        <Icon
          style={{fontSize:18,padding:15}}
          name="bars"
          color="#230A59"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      ),
    }),
  },
});

const LoginStack = createStackNavigator(
  {
    Login: LoginScreen,
  },
  config
);

LoginStack.navigationOptions = {
  tabBarVisible: false,
};

LoginStack.path = '';

const ProductionStack = createStackNavigator(
  {
    Production: ProductionScreen,
  },
  config
);

ProductionStack.navigationOptions = {
  tabBarLabel: 'Production',
    tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      selected="#230A59"
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
      activeTintColor: '#230A59',
  },
};

ProductionStack.path = '';

const ProjectionStack = createStackNavigator(
  {
    Projection: ProjectionScreen,
  },
  config
);

ProjectionStack.navigationOptions = {
  tabBarLabel: 'Projection',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      selected="#230A59"
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
      activeTintColor: '#230A59',
  },
};

ProjectionStack.path = '';

const WastageStack = createStackNavigator(
  {
    Wastage: WastageScreen,
  },
  config
);

WastageStack.navigationOptions = {
  tabBarLabel: 'Wastage',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      selected="#230A59"
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
      activeTintColor: '#230A59',
  },
};

WastageStack.path = '';

const RecipeStack = createStackNavigator(
  {
    Recipe: RecipeScreen,
  },
  config
);

RecipeStack.navigationOptions = {
  tabBarLabel: 'Recipes',
};

RecipeStack.path = '';

const tabNavigator2 = createBottomTabNavigator({
  ProjectionStack,
  ProductionStack,
  WastageStack,
});

tabNavigator2.path = '';

const TillFloatStack = createStackNavigator(
  {
    TillFloat: TillFloatScreen,
  },
  config
);

TillFloatStack.navigationOptions = {
  tabBarLabel: 'Till Float',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      selected="#230A59"
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
      activeTintColor: '#230A59',
  },
};

TillFloatStack.path = '';

const ANZDepositStack = createStackNavigator(
  {
    ANZDeposit: ANZDepositScreen,
  },
  config
);

ANZDepositStack.navigationOptions = {
  tabBarLabel: 'ANZ Deposit Bag',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      selected="#230A59"
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
      activeTintColor: '#230A59',
  },
};

ANZDepositStack.path = '';

const VoucherStack = createStackNavigator(
  {
    Voucher: VoucherScreen,
  },
  config
);

VoucherStack.navigationOptions = {
  tabBarLabel: 'Voucher',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      selected="#230A59"
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
      activeTintColor: '#230A59',
  },
};

VoucherStack.path = '';

const ConclusionStack = createStackNavigator(
  {
    Conclusion: ConclusionScreen,
  },
  config
);

ConclusionStack.navigationOptions = {
  tabBarLabel: 'Conclusion',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      selected="#230A59"
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
      activeTintColor: '#230A59',
  },
};

ConclusionStack.path = '';

const ListsStack = createStackNavigator(
  {
    Lists: ListsScreen,
    ListDetail: ListDetailScreen,
  },
  config
);

ListsStack.path = '';

const SurveysStack = createStackNavigator(
  {
    Surveys: SurveysListScreen,
    SurveyDetail: SurveyDetailScreen,
  },
  config
);

SurveysStack.path = '';

const DashboardStack = createStackNavigator(
  {
    Dashboard: DashboardScreen,
  },
  config
);

DashboardStack.navigationOptions = {
  tabBarLabel: 'Dashboard',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      selected="#230A59"
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
  tabBarOptions: {
      activeTintColor: '#230A59',
  },
};

DashboardStack.path = '';

const tabNavigator = createBottomTabNavigator({
  VoucherStack,
  TillFloatStack,
  ANZDepositStack,
  ConclusionStack,
});

tabNavigator.path = '';

const CounterStack = createStackNavigator(
  {
    Counter: CounterScreen,
  },
  config
);

CounterStack.path = '';

const BusinessTabStack = createStackNavigator(
  {
    BusinessTab: tabNavigator,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);

BusinessTabStack.path = '';

const BusinessStack = createStackNavigator(
  {
    Counter: CounterStack,
    Business: BusinessTabStack
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    }
  }
);

BusinessStack.path = '';

// drawer stack
const DrawerStack = createDrawerNavigator(
  {
    Dashboard: {
      screen: DashboardStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} title="Dashboard" />
        )
      })
    },
    StockEntry: {
      screen: tabNavigator2,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="StockEntry" title="Stock Entry" />
        )
      })
    },
    BusinessEntry: {
      screen: BusinessStack,
      navigationOptions: ({navigation}) => ({
        drawerLabel: ({ focused }) => (
          <TouchableOpacity onPress={() => navigation.navigate({
            routeName: "Counter"
          })} style={{flexDirection: 'row'}}>
            <DrawerItem focused={focused} screen="Counter" title="Business Entry" />
         </TouchableOpacity>
        )
      })
    },
    Lists: {
      screen: ListsStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Lists" title="Lists" />
        )
      })
    },
  },
  Menu
);

const RootStack = createStackNavigator(
  {
    Drawer: DrawerStack,
    Lists: ListsStack,
    Surveys: SurveysStack,
    Recipe: RecipeStack
  },
  {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
  }
);

RootStack.path = '';

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('@app:email');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'Root' : 'Login');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Root: RootStack,
      Login: LoginStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);

