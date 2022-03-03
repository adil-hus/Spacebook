import React, {Component} from 'react';
import {View, SafeAreaView, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          isLoading: true,
          listData: [],
          addPost: "",
          amendPost: ""
        }
    }

    getAllPosts = async () => {
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

    postPost = async (post) => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post", {
            method: 'post',
            'headers': {
            'X-Authorization':  value,
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({text:post})
        })
        .then((response) => {
            if(response.status === 201){
                this.getAllPosts();
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
                console.log(error);
        })
    }

    likePost = async (user_id, post_id) => {
      const value = await AsyncStorage.getItem('@session_token');
      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
          method: 'post',
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
                this.getAllPosts();
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
              console.log(error);
        })
    }

    deletePost = async (post_id) => {
        const value = await AsyncStorage.getItem('@session_token');
        const user_id = await AsyncStorage.getItem('@user_id');
        return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
            method: 'delete',
            'headers': {
            'X-Authorization':  value,
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.getAllPosts();
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
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
        this.getAllPosts();
    });
        this.getAllPosts();
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
              <View>
                <TextInput
                  style={styles.inputText1}
                  placeholder="Write your post..."
                  onChangeText={(addPost) => this.setState({addPost})}
                  value={this.state.addPost}
                />
                <TouchableOpacity
                  style={styles.button1}
                  onPress={() => this.postPost(this.state.addPost)}>
                  <Text style={styles.text1}>Post</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={this.state.listData}
                renderItem={({item}) => (
                  <View>                   
                    <Text style={styles.text1}>
                      {item.timestamp + '\n' + "New post from: " + item.author.first_name + " " + 
                      item.author.last_name + " \n" + item.text + '\n' + "Likes: " + item.numLikes}
                    </Text>
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => this.props.navigation.navigate("ViewSinglePost", {"user_id": item.user_id})}>
                      <Text style={styles.text1}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => this.likePost(item.author.user_id, item.post_id)}>
                      <Text style={styles.text1}>Like</Text>
                    </TouchableOpacity>
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
                    <TouchableOpacity
                      style={styles.button1}
                      onPress={() => this.deletePost(item.post_id)}>
                      <Text style={styles.text1}>Delete</Text>
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
  button1: {
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

  export default HomeScreen;

