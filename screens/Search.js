import React, {Component} from 'react';
import {View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
          isLoading: true,
          listData: [],
          lookForFriend: ""
        }
      }

      loadFriend = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/search?q=" + this.state.lookForFriend, {
                method: 'get',
                'headers': {
                'X-Authorization':  value,
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json();
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

      sendRequest = async (user_id) => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", {
          method: 'post',
          'headers': {
          'X-Authorization':  value,
              }
            })
            .then((response) => {
                if(response.status === 201){
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
        this.loadFriend();
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
            <TextInput
              placeholder="Enter Name"
              onChangeText={(lookForFriend) => this.setState({lookForFriend})}
              value={this.state.lookForFriend}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.loadFriend()}>
              <Text>Find</Text>
            </TouchableOpacity>
              <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View>
                        <Text>{item.user_givenname} {item.user_familyname}</Text>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={() => this.sendRequest(item.user_id)}>
                          <Text>Send Request</Text>
                        </TouchableOpacity>
                        </View>
                    )}
                  />
            </View>
          );
        }
        
      }
    }

    const styles = StyleSheet.create({
      button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
    },
      input: {
        padding:5, 
        borderWidth:1, 
        margin:5
    }
  }
)

export default SearchScreen;