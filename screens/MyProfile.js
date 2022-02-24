import React, {Component} from 'react';
import {View, Text, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: [],
        addPost: ""
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

    updatePost = async (post_id) => {
      const value = await AsyncStorage.getItem('@session_token');
      const user_id = await AsyncStorage.getItem('@user_id');
      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id, {
              method: 'patch',
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
            <Text>Loading..</Text>
          </View>
        );
      }else{
        return (
        <View>
          <View>                  
            <TextInput
              placeholder="Write your post..."
              onChangeText={(addPost) => this.setState({addPost})}
              value={this.state.addPost}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.postPost(this.state.addPost)}>
              <Text>Post</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.listData}
            renderItem={({item}) => (
                <View>      
                  <Text>{item.timestamp + '\n' + "New post from: " + item.author.first_name + " " + 
                  item.author.last_name + " \n" + item.text + '\n' + "Likes: " + item.numLikes}
                  </Text>
                  <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.updatePost(item.post_id)}>
                  <Text>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.deletePost(item.post_id)}>
                  <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
          />
        </View>
      )
    }
  }
}

    const styles = StyleSheet.create({
      button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10
    },
    input: {
      padding:5, 
      borderWidth:1, 
      margin:5
    }
  }
)

  export default ProfileScreen;

