import React, {Component} from 'react';
import {SafeAreaView, FlatList, TouchableOpacity, Text, StyleSheet, View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class FriendRequestsScreen extends Component {
	constructor(props){
		super(props);

		this.state = {
			isLoading: true,
			listData: []
		}
	}

	getRequest = async () => {
		const value = await AsyncStorage.getItem('@session_token');
		return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
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
		});
			console.log(this.state.listData);
		})
		.catch((error) => {
			console.log(error);
		})
	}

	add = async (user_id) => {
		const value = await AsyncStorage.getItem('@session_token');
		return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
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

	delete = async (user_id) => {
		const value = await AsyncStorage.getItem('@session_token');
		return fetch("http://localhost:3333/api/1.0.0/friendrequests/" + user_id, {
			method: 'delete',
			'headers': {
			'X-Authorization':  value,
			}
		})
		.then((response) => {
			if(response.status === 200){
				return response.json()
			}else if(response.status === 401){
				this.props.navigation.navigate("Login");
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

	componentDidMount() {
		this.unsubscribe = this.props.navigation.addListener('focus', () => {
		this.checkLoggedIn();
	});
		this.getRequest();
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
									<Text style={styles.text1}>{"New request from " + item.first_name + " " + item.last_name}</Text>
									<TouchableOpacity
										style={styles.button1}
										onPress={() => this.add(item.user_id)}>
										<Text style={styles.text2}>Accept</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.button1}
										onPress={() => this.delete(item.user_id)}>
										<Text style={styles.text2}>Reject</Text>
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
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 12,
		paddingHorizontal: 32,
		borderRadius: 4,
		backgroundColor: 'midnightblue'
	},
	text1: {
		paddingVertical: 10,
		textAlign: "center",
		color: "white",
		fontSize: 20,
		fontWeight: "bold"
	},
	text2: {
		paddingVertical: 10,
		textAlign: "center",
		color: "white",
		fontSize: 20,
		fontWeight: "bold"
	}
})

export default FriendRequestsScreen;