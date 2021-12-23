import AsyncStorage from '@react-native-async-storage/async-storage';

export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';
export const ADD_USERS = 'ADD_USERS';
export const FETCH_DATA = 'FETCH_DATA';
export const REMOVE_CURRENT_USER = 'REMOVE_CURRENT_USER';

export const ADD_NOTE = 'ADD_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const EDIT_NOTE = 'EDIT_NOTE';

export const updateCurrentUser = (userId, password) => {
  return {
    type: UPDATE_CURRENT_USER,
    userId: userId,
    password: password,
  };
};

export const addUsers = (userId, password) => {
  return {
    type: ADD_USERS,
    userId: userId,
    password: password,
  };
};
export const fetchData = (currentUser, users, notes) => {
  return {
    type: FETCH_DATA,
    currentUser: currentUser,
    users: users,
    notes: notes,
  };
};

export const removeCurrentUser = () => {
  return {
    type: REMOVE_CURRENT_USER,
  };
};

export const addNote = notes => {
  return {
    type: ADD_NOTE,
    notes: notes,
  };
};

export const deleteNote = notes => {
  return {
    type: DELETE_NOTE,
    notes: notes,
  };
};

export const editNote = notes => {
  return {
    type: EDIT_NOTE,
    notes: notes,
  };
};

export const asyncRemoveCurrentUser = navigation => {
  return async dispatch => {
    try {
      await AsyncStorage.removeItem('currentuser');
      console.log('asyncRemoveCurrentUser');
      dispatch(removeCurrentUser());
    } catch (error) {
      console.log(error);
    }
  };
};

export const asyncfetchData = () => {
  console.log('asyncfetchData');
  return async dispatch => {
    try {
      let currentUser = await AsyncStorage.getItem('currentuser');
      currentUser = currentUser ? JSON.parse(currentUser) : {};
      let users = await AsyncStorage.getItem('users');
      users = users ? JSON.parse(users) : [];
      let notes = await AsyncStorage.getItem('notes');
      notes = notes ? JSON.parse(notes) : {};
      dispatch(fetchData(currentUser, users, notes));
    } catch (error) {
      console.log(error);
    }
  };
};

export const asyncUpdateCurrentUser = (userId, password) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem(
        'currentuser',
        JSON.stringify({userId, password}),
      );
      console.log('asyncUpdateCurrentUser');
      dispatch(updateCurrentUser(userId, password));
    } catch (error) {
      console.log(error);
    }
  };
};

export const asyncAddUsers = (userId, password) => {
  return async (dispatch, getState) => {
    await AsyncStorage.setItem(
      'users',
      JSON.stringify([...getState().users, {userId, password}]),
    );
    dispatch(addUsers(userId, password));
  };
};

export const asyncAddNote = (id, title, content) => {
  return async (dispatch, getState) => {
    console.log('asyncAddNote');
    const currentUser = getState().currentUser;
    const notes = getState().notes;
    console.log(notes, currentUser);
    console.log(notes[currentUser.userId]);
    const notesOfCurrentUserId = notes[currentUser.userId]
      ? notes[currentUser.userId]
      : [];
    const newNotes = {
      ...notes,
      [currentUser.userId]: [...notesOfCurrentUserId, {id, title, content}],
    };

    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    AsyncStorage.getItem('notes').then(value => {
      console.log(value);
    });
    dispatch(addNote(newNotes));
  };
};

export const asyncDeleteNote = id => {
  return async (dispatch, getState) => {
    console.log('asyncDeleteNote');
    const currentUser = getState().currentUser;
    const notes = getState().notes;
    const notesOfCurrentUserId = notes[currentUser.userId]
      ? notes[currentUser.userId]
      : [];
    const newNotes = {
      ...notes,
      [currentUser.userId]: notesOfCurrentUserId.filter(note => note.id !== id),
    };
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    dispatch(deleteNote(newNotes));
  };
};

export const asyncEditNote = (id, title, content) => {
  return async (dispatch, getState) => {
    console.log('asyncEditNote');
    const currentUser = getState().currentUser;
    const notes = getState().notes;
    const notesOfCurrentUserId = notes[currentUser.userId]
      ? notes[currentUser.userId]
      : [];
    const newNotes = {
      ...notes,
      [currentUser.userId]: notesOfCurrentUserId.map(note =>
        note.id === id ? {id, title, content} : note,
      ),
    };
    await AsyncStorage.setItem('notes', JSON.stringify(newNotes));
    dispatch(editNote(newNotes));
  };
};
