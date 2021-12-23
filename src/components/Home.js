import {StackActions} from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ActionButton from 'react-native-action-button';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {asyncRemoveCurrentUser} from '../redux/action';
import Card from './Card';

export const dark = {
  background: '#2C3A47',
  foreground: 'black',
  text: '#ffd32a',
};

const Home = ({navigation}) => {
  // const state = useSelector(state => state);
  // console.log(state);

  const currentUser = useSelector(state => state.currentUser);
  const userId = currentUser?.userId;
  const notes = useSelector(state =>
    state.notes[userId] ? state.notes[userId] : [],
  );
  console.log(notes);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   getNotes();
  // }, []);

  const logoutHandler = () => {
    // try {

    //   console.log('logoutHandler');
    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   navigation.dispatch(StackActions.replace('Login'));
    // }

    dispatch(asyncRemoveCurrentUser());
    navigation.dispatch(StackActions.replace('Login'));
  };

  // const getNotes = async () => {
  //   try {
  //     console.log('Users : ', JSON.parse(await AsyncStorage.getItem('users')));
  //     console.log(
  //       'currentuser : ',
  //       JSON.parse(await AsyncStorage.getItem('currentuser')),
  //     );
  //     console.log('notes : ', JSON.parse(await AsyncStorage.getItem('notes')));
  //     console.log('\n');
  //     console.log('\n');

  //     const currentuserid = JSON.parse(
  //       await AsyncStorage.getItem('currentuser'),
  //     ).userid;

  //     let oldnotesofcurrentuserid = await AsyncStorage.getItem('notes');
  //     oldnotesofcurrentuserid = oldnotesofcurrentuserid
  //       ? JSON.parse(oldnotesofcurrentuserid)[currentuserid]
  //       : [];
  //     //check if oldnotesofcurrentuserid is undefined
  //     if (oldnotesofcurrentuserid) {
  //       setNotes(oldnotesofcurrentuserid);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const newNoteId = () => {
    return uuid.v4().toString();
  };

  const showAlert = () =>
    Alert.alert(
      'Are you sure you want to logout of this app?',
      '',
      [
        {
          text: 'No',
          onPress: () => {
            console.log('Cancelled');
          },
        },
        {
          text: 'Yes',
          onPress: () => logoutHandler(),
        },
      ],
      {cancelable: true},
    );

  const LogoutIcon = () => {
    return <Icon name="log-out-outline" size={34} color={dark.text} />;
  };

  const AddIcon = () => {
    return (
      <View>
        <Icon name="add-outline" size={34} color={dark.text} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={[styles.header, styles.header]}>
        <View style={[styles.rightLeftContainer]}>
          {/* <Pressable onPress={() => logoutHandler()}>
            <Text style={styles.logout}>Logout</Text>
          </Pressable> */}
        </View>
        <View style={styles.centerContainer}>
          <Text style={[styles.headerText, styles.title]}>Notes</Text>
        </View>
        <View style={styles.rightLeftContainer}>
          <Pressable style={styles.button} onPress={() => showAlert()}>
            <LogoutIcon />
          </Pressable>
        </View>
      </View>
      <View style={[styles.Body, styles.body]}>
        <ScrollView>
          {notes.map(note => {
            // console.log(note);
            return (
              <Card
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                navigation={navigation}
              />
            );
          })}
        </ScrollView>
        <ActionButton
          buttonTextStyle={{color: '#ffd32a', fontSize: 34}}
          buttonColor="black"
          onPress={() => {
            navigation.navigate('NoteForm', {
              id: newNoteId(),
              title: '',
              content: '',
              notes: notes,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flex: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: dark.foreground,
  },
  rightLeftContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 3,
  },
  headerText: {
    fontSize: 23,
    textAlign: 'center',
  },
  Body: {
    flex: 15,
    backgroundColor: dark.background,
  },
  button: {
    marginLeft: 5,
    marginRight: 5,
    alignSelf: 'center',
  },
  title: {
    color: dark.text,
  },
  logout: {
    marginLeft: 7,
    fontSize: 15,
    color: dark.text,
  },
});

export default Home;
