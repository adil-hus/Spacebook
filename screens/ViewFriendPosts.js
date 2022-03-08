import React, {Component} from 'react';
import {View, SafeAreaView, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ViewFriendPostsScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          isLoading: true,
          listData: [],
        }
    }

    getPosts = async (id) => {
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
            let { friend_id } = this.props.route.params;
              this.getPosts(friend_id);
          }else if(response.status === 401){
            this.props.navigation.navigate("Login");
          }else if(response.status === 403){
            throw 'Forbidden - you have already liked this post';
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

  removeLikeFromPost = async (user_id, post_id) => {
    const value = await AsyncStorage.getItem('@session_token');
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/post/" + post_id + "/like", {
        method: 'delete',
        'headers': {
        'X-Authorization':  value,
        }
    })
    .then((response) => {
        if(response.status === 200){
          let { friend_id } = this.props.route.params;
            this.getPosts(friend_id);
        }else if(response.status === 401){
          this.props.navigation.navigate("Login");
        }else if(response.status === 403){
          throw 'Forbidden - you have not liked this post';
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
          let { friend_id } = this.props.route.params;
        this.checkLoggedIn();
        this.getPosts(friend_id);
    });
    let { friend_id } = this.props.route.params;
        this.getPosts(friend_id);
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
                  <Text style={styles.text1}>{item.timestamp + '\n' + "New post from: " + item.author.first_name + " " + 
                    item.author.last_name + " \n" + item.text + '\n' + "Likes: " + item.numLikes}
                  </Text>
                  <TouchableOpacity
                      style={styles.button1}
                      onPress={() => this.likePost(item.author.user_id, item.post_id)}>
                    <Text style={styles.text1}>Like</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={styles.button1}
                      onPress={() => this.removeLikeFromPost(item.author.user_id, item.post_id)}>
                    <Text style={styles.text1}>Unlike</Text>
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
        }
    }
)

  export default ViewFriendPostsScreen;

