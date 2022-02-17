import React, { Component } from 'react';
import {Text, Button, ScrollView} from 'react-native';

class HomeScreen extends Component{
    render(){
        return (
            <ScrollView>
                <Text
                style={{paddingVertical: 8,
                borderWidth: 4,
                borderColor: "#20232a",
                borderRadius: 6,
                backgroundColor: "#61dafb",
                color: "#20232a",
                textAlign: "center",
                fontSize: 30,
                fontWeight: "bold"}}>
                SpaceBook
            </Text>
            <Button
                    title="Welcome back Cutie"
                    color="darkred"
                    onPress={() => this.props.navigation.navigate("Login")}
            />
            <Button
                    title="Don't have an account? Sign Up, you know you want to!"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate("Signup")}
            />
            </ScrollView>
        )
    }
}

export default HomeScreen;