import React, {Component} from 'react';
import {View, Text, FlatList} from 'react-native';
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
          'headers': {
            'X-Authorization':  value,
            method: 'get'
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

  add(user_id){
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/{user_id}" + user_id, {
        method: 'post'
      })
      .then((response) => {
          this.getData();
      })
      .then((response) => {

        Alert.alert("Request accepted")

      })
      .catch((error) =>{
        console.log(error);
      });
  }

  delete(user_id){
    return fetch("http://localhost:3333/api/1.0.0/friendrequests/{user_id}" + user_id, {
        method: 'delete'
      })
      .then((response) => {
          this.getData();
      })
      .then((response) => {

        Alert.alert("Request deleted")

      })
      .catch((error) =>{
        console.log(error);
      });
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