import React, {Component} from 'react';
import {SafeAreaView,View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, ScrollView} from 'react-native';
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
          <SafeAreaView style={styles.container}>
            <ScrollView>
              <TextInput
                style={styles.inputText1}
                placeholder="Enter Name"
                onChangeText={(lookForFriend) => this.setState({lookForFriend})}
                value={this.state.lookForFriend}
              />
              <TouchableOpacity
                style={styles.button1}
                onPress={() => this.loadFriend()}>
                <Text style={styles.text2}>Find</Text>
              </TouchableOpacity>
              <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                  <View>
                    <Text style={styles.text1}>{item.user_givenname} {item.user_familyname}</Text>
                      <TouchableOpacity
                        style={styles.button2}
                        onPress={() => this.sendRequest(item.user_id)}>
                        <Text style={styles.text2}>Send Request</Text>
                      </TouchableOpacity>
                  </View>
                )}
              />
            </ScrollView>
          </SafeAreaView>
      );
    }
  }
}

const styles = StyleSheet.create({
    container: {
            flex: 1,
            paddingHorizontal: 10,
            backgroundColor: 'midnightblue'
    },
    inputText1: {
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 20,
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            padding:5, 
            borderWidth:1, 
            margin:5
    },
    button1: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 4,
            backgroundColor: 'midnightblue',
    },
    button2: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 4,
            backgroundColor: 'midnightblue',
            borderWidth:1, 
    },
    text1: {
            paddingVertical: 5,
            color: "white",
            fontSize: 20,
            fontWeight: "bold"
    },
    text2: {
            paddingVertical: 5,
            textAlign: "center",
            color: "white",
            fontSize: 15,
            fontWeight: "bold"
        }
    }
)

export default SearchScreen;