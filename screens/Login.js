import React, { Component } from 'react';
import { SafeAreaView, TouchableOpacity, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    login = async () => {

        if(this.state.email.match(/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/)){
            //email is valid
        }
        else{
            alert("Email is not valid.");
            return false;
        }

        if(this.state.password.length < 6){
            alert("Password is too short, has to be 6 characters or more");
            return false;
        }    

        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else if(response.status === 500){
                throw 'Server Error';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('@user_id', responseJson.id);
                this.props.navigation.navigate("RestOfApp");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    render(){
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <TextInput
                        style={styles.inputText1}
                        placeholder="Enter your email..."
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                    />
                    <TextInput
                        style={styles.inputText1}
                        placeholder="Enter your password..."
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        style={styles.button1}
                        onPress={() => this.login()}>
                        <Text style={styles.text1}>Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 10,
        backgroundColor: 'midnightblue'
    },
    button1: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: 'midnightblue'
    },
    text1: {
        paddingVertical: 20,
        textAlign: "center",
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
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
        }
    }
)

export default LoginScreen;