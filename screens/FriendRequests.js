import React, {Component} from 'react';
import {FlatList, Button, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestsScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      listData: []
    }
  }

      getData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
              method: 'get',
              'headers': {
              'X-Authorization':  value,
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                  this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                listData: responseJson
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }

      add = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
          method: 'post',
          'headers': {
          'X-Authorization':  value,
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                  this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                listData: responseJson
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }

      delete = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
          method: 'delete',
          'headers': {
          'X-Authorization':  value,
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                  this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                listData: responseJson
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }


  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
    this.getData();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
        this.props.navigation.navigate('Login');
    }
  };

  render(){
    return (
        <ScrollView>
              <FlatList
                  data={this.state.listData}
                  renderItem={({item}) => (
                    <Text>
                    </Text>
                    )}
              />
            <Button
                title="Add"
                onPress={() => this.add()}
            />
            <Button
                title="Delete"
                onPress={() => this.delete()}
            />
        </ScrollView>
    )
  }
}
export default FriendRequestsScreen;