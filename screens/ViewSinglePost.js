import React, {Component} from 'react';
import {View, SafeAreaView, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ViewSinglePostScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            isLoading: true,
            listData: [],
            addPost: "",
            amendPost: ""
        }
    }

    getSinglePost = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
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
                throw 'Can only view the posts of yourself or your friends';
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

    updatePost = async (post_id, post) => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
            method: 'PATCH',
            headers: {
            'X-Authorization':  value,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({text:post})
        })
        .then((response) => {
            if(response.status === 200){
                this.getSinglePost();
            }else if(response.status === 400){
                throw 'Bad Request';
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else if(response.status === 403){
                throw 'Forbidden - you can only update your own posts';
            }else if(response.status === 404){
                throw 'Not Found';
            }else if(response.status === 500){
                throw 'Server Error';
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
    });
    this.getSinglePost();
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
                                    <Text style={styles.text1}>
                                    {item.timestamp + '\n' + "New post from: " + item.author.first_name + " " + 
                                    item.author.last_name + " \n" + item.text + '\n' + "Likes: " + item.numLikes}
                                    </Text>
                                    <TextInput
                                    style={styles.inputText1}
                                    placeholder="Update your post..."
                                    onChangeText={(amendPost) => this.setState({amendPost})}
                                    value={this.state.amendPost}
                                    />
                                    <TouchableOpacity
                                    style={styles.button1}
                                    onPress={() => this.updatePost(item.post_id, this.state.amendPost)}>
                                    <Text style={styles.text1}>Update</Text>
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
        paddingVertical: 5,
        paddingHorizontal: 5,
        textAlign: "left",
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
    },
    inputText1: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        padding:5, 
        borderWidth:1, 
        margin:5
    }
})

  export default ViewSinglePostScreen;

