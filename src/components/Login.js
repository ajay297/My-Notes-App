import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  asyncAddUsers,
  asyncfetchData,
  asyncUpdateCurrentUser,
} from '../redux/action';

const Login = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const users = useSelector(state => state.users);

  // AsyncStorage.getItem('currentUser').then(value => {
  //   console.log('value', value);
  // });

  const dispatch = useDispatch();

  useEffect(() => {
    async function checkCurrentUser() {
      const currentUser = await AsyncStorage.getItem('currentuser');
      console.log('currentUser1', currentUser);
      dispatch(asyncfetchData());
      console.log('currentUser2', currentUser);
      if (!currentUser) {
        navigation.navigate('Login');
        return;
      }
      navigation.navigate('Home');
    }
    checkCurrentUser();
  }, []);
  const handleLogin = async () => {
    const user = users.find(
      user => user.userId === userId && user.password === password,
    );
    //current user update
    dispatch(asyncUpdateCurrentUser(userId, password));
    if (!user) {
      await dispatch(asyncAddUsers(userId, password));
      Alert.alert('Success!', 'New user registered.');
    } else {
      Alert.alert('Success!', 'User logged in.');
    }

    navigation.dispatch(StackActions.replace('Home'));
  };

  const {colors} = useTheme();

  return (
    <View style={styles.body}>
      <Text style={styles.title}>LOGIN</Text>
      <TextInput
        style={styles.input}
        placeholder={'User Id'}
        onChangeText={text => setUserId(text)}
      />
      <TextInput
        style={styles.input}
        placeholder={'Password'}
        secureTextEntry={true}
        onChangeText={text => setPassword(text)}
      />
      <Pressable
        onPress={() => handleLogin(userId, password)}
        style={styles.loginButton}>
        <Text style={styles.text}>LOGIN</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 16,
    paddingTop: 120,
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    marginBottom: 48,
    fontSize: 35,
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    marginVertical: 8,
    backgroundColor: '#e8e8e8',
    width: '100%',
    padding: 20,
    borderRadius: 8,
    color: 'black',
  },
  loginButton: {
    marginVertical: 32,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 17,
    borderRadius: 8,
    backgroundColor: '#ffd32a',
  },
  text: {
    color: 'white',
    fontWeight: '500',
    fontSize: 20,
  },
});

export default Login;
