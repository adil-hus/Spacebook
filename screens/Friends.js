import React, {Component} from 'react';
import {View, Text, ActivityIndicator, FlatList, StyleSheet, SafeAreaView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsScreen extends Component {
    constructor(props){
        super(props);
  
        this.state = {
            isLoading: true,
            listData: [],
      }
    }

    getAllFriends = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/friends", {
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

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
    });
        this.getAllFriends();
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
          <View>
            <FlatList
              data={this.state.listData}
              renderItem={({item}) => (
              <Text style={styles.text1}>{item.user_givenname + " " + item.user_familyname}</Text>
              )}
            />
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
    text1: {
        paddingVertical: 10,
        textAlign: "center",
        color: "white",
        fontSize: 20,
        fontWeight: "bold"
        } 
    }
)

  export default FriendsScreen;

