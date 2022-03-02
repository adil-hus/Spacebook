import React, {Component} from 'react';
import {View, SafeAreaView, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AccountScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          isLoading: true,
          listData: [],
          first_name: "",
          last_name: "",
          email: ""
        }
    }

    getUserInfo = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
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

    updateUserInfo = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
            method: 'PATCH',
            headers: {
            'X-Authorization':  value,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
            })
          })
        .then((response) => {
            if(response.status === 200){
                this.getUserInfo();
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
            console.log("User updated information: ", responseJson);
            this.props.navigation.navigate("Login");
        })
        .catch((error) => {
              console.log(error);
        })
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
    });
        this.getUserInfo();
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
            <Text>Loading...</Text>
          </View>
        );
    }else{
      return (
          <SafeAreaView style={styles.container}>
            <View>
                    <Text style={styles.text1}> First Name: {this.state.listData['first_name']}</Text>
                    <Text style={styles.text1}> Last Name: {this.state.listData['last_name']}</Text>
                    <Text style={styles.text1}> Email: {this.state.listData['email']}</Text>
                    <TextInput
                      style={styles.inputText1}
                      placeholder="Update your First Name..."
                      onChangeText={(first_name) => this.setState({first_name})}
                      value={this.state.first_name}
                    />
                    <TextInput
                      style={styles.inputText1}
                      placeholder="Update your Last Name..."
                      onChangeText={(last_name) => this.setState({last_name})}
                      value={this.state.last_name}
                    />
                    <TextInput
                      style={styles.inputText1}
                      placeholder="Update your Email..."
                      onChangeText={(email) => this.setState({email})}
                      value={this.state.email}
                    />
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => this.updateUserInfo()}>
                      <Text style={styles.text1}>Update</Text>
                    </TouchableOpacity>
            </View>
          </SafeAreaView>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingHorizontal: 10,
      backgroundColor: 'midnightblue'
  },
  button1: {
      justifyContent: 'center',
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 4,
      backgroundColor: 'midnightblue'
  },
  text1: {
      paddingVertical: 5,
      paddingHorizontal: 5,
      textAlign: "left",
      color: "white",
      fontSize: 20,
      fontWeight: "bold"
  },
  inputText1: {
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
      padding:5, 
      borderWidth:1, 
      margin:5
      }
  }
)

  export default AccountScreen;
