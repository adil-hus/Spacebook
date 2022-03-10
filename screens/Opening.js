import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Image} from 'react-native';

class OpeningScreen extends Component{
    render(){
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={require('./logo.png')}
                />
                <TouchableOpacity
                    style={styles.button1}
                    onPress={() => this.props.navigation.navigate("Login")}>
                    <Text style={styles.text1}>Welcome back Cutie</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button2}
                    onPress={() => this.props.navigation.navigate("Signup")}>
                    <Text style={styles.text2}>Don't have an account? Sign Up, you know you want to!</Text>
                </TouchableOpacity>
            </View>
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
    logo: {
        justifyContent: "center",
        alignItems: "center",
        width: 350,
        height: 350,
    },
    button1: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'midnightblue'
    },
    button2: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'midnightblue'
    },
    text1: {
        paddingVertical: 8,
        color: "#20232a",
        textAlign: "center",
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
    },
    text2: {
        paddingVertical: 20,
        color: "#20232a",
        textAlign: "center",
        color: "white",
        fontSize: 30,
        fontWeight: "bold"
        }
    }
)

export default OpeningScreen;