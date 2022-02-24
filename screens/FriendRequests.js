import React, {Component} from 'react';
import {FlatList, TouchableOpacity, Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestsScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      listData: []
    }
  }

      getRequest = async () => {
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
              });
              console.log(this.state.listData);
            })
            .catch((error) => {
                console.log(error);
            })
      }

      add = async (user_id) => {
        const value = await AsyncStorage.getItem('@session_token');
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

      delete = async (user_id) => {
        const value = await AsyncStorage.getItem('@session_token');
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
    this.getRequest();
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

    render() {
      if (this.state.isLoading){
        return (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator/>
            <Text>Loading..</Text>
          </View>
        );
      }else{
        return (
        <View>
          <FlatList
            data={this.state.listData}
            renderItem={({item}) => (
                <View>      
                  <Text>{"New request from " + item.first_name + " " + item.last_name}</Text>
                  <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.add(item.user_id)}>
                  <Text>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.delete(item.user_id)}>
                  <Text>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
          />
        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
},
}
)

export default FriendRequestsScreen;