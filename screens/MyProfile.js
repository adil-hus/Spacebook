import React, {Component} from 'react';
import {View, Text, ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {
    constructor(props){
      super(props);
  
      this.state = {
        isLoading: true,
        listData: []
      }
    }

    getUserName = async () => {
      const value = await AsyncStorage.getItem('@session_token');
      const user_id = await AsyncStorage.getItem('@user_id');
      return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
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

    componentDidMount() {
      this.unsubscribe = this.props.navigation.addListener('focus', () => {
        this.checkLoggedIn();
      });
      this.getUserName();
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
          <Text style={styles.title}>My Profile</Text>
          </View>
          <FlatList
            data={this.state.listData}
            renderItem={({item}) => (
                <View>
                  <Text>{item.timestamp + '\n' + "New post from: " + item.author.first_name + " " + 
                  item.author.last_name + " \n" + item.text + '\n' + "Likes: " + item.numLikes}
                  </Text>
                </View>
              )}
          />
        </View>
      )
    }
  }
}

    const styles = StyleSheet.create({
      title: {
        paddingVertical: 8,
        borderWidth: 4,
        borderColor: "#20232a",
        borderRadius: 6,
        backgroundColor: "#61dafb",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold"
    }
  }
)

  export default ProfileScreen;

