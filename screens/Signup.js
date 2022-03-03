import React, { Component } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, TextInput, Text, StyleSheet } from 'react-native';

class SignupScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        }
    }

    signup = () => {
        //Validation here...

        if(this.state.password.length < 5){
            alert("Password is too short, has to be 5 characters or more");
            this.render();
        }

        return fetch("http://localhost:3333/api/1.0.0/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 201){
                return response.json()
            }else if(response.status === 400){
                throw 'Failed validation';
            }else{
                throw 'Something went wrong';
            }
        })
        .then((responseJson) => {
               console.log("User created with ID: ", responseJson);
               this.props.navigation.navigate("Login");
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
                        placeholder="Enter your first name..."
                        onChangeText={(first_name) => this.setState({first_name})}
                        value={this.state.first_name}
                    />
                    <TextInput
                        style={styles.inputText1}
                        placeholder="Enter your last name..."
                        onChangeText={(last_name) => this.setState({last_name})}
                        value={this.state.last_name}
                    />
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
                        onPress={() => this.signup()}>
                        <Text style={styles.text1}>Create account</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button1}
                        onPress={() => this.props.navigation.navigate("Login")}>
                        <Text style={styles.text1}>Have you remembered your account details?</Text>
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

export default SignupScreen;