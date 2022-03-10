import React, {Component} from 'react';
import {View, Text, ActivityIndicator, FlatList, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
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
            }else if(response.status === 403){
                throw 'Can only view the friends of yourself or your friends';
            }else if(response.status === 404){
                throw 'Not Found';
            }else if(response.status === 500){
                throw 'Server Error';
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

    sendToFriendAccount = async (id) => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/" + id + "/post", {
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
            console.log("Send user to friend: ", responseJson);
            this.props.navigation.navigate("ViewFriendPosts");
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
        this.getAllFriends();
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
                        <Text>Loading...</Text>
                </View>
            );
        }else{
            return (
                <SafeAreaView style={styles.container}>
                    <View>
                        <FlatList
                            data={this.state.listData}
                            renderItem={({item}) => (
                                <View>
                                    <Text style={styles.text1}>{item.user_givenname + " " + item.user_familyname}</Text>
                                    <TouchableOpacity
                                        style={styles.button1}
                                        onPress={() => this.props.navigation.navigate("ViewFriendPosts", {"friend_id": item.user_id})}>
                                        <Text style={styles.text1}>View</Text>
                                    </TouchableOpacity>
                                </View>
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
    },
    button1: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: 'midnightblue'
    }
})

  export default FriendsScreen;

