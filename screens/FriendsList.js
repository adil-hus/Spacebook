import React, {Component} from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendsListScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
          isLoading: true,
          listData: []
        }
      }
    
      getData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/{user_id}/friends", {
              'headers': {
                'X-Authorization':  value,
                method: 'get'
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
        this.getData();
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
              <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View>
                          <Text>{item.user_givenname} {item.user_familyname}</Text>
                        </View>
                    )}
                    keyExtractor={(item,index) => item.user_id.toString()}
                  />
            </View>
          );
        }
        
      }
    }

export default FriendsListScreen;