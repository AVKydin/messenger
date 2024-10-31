import { set, ref, get, query, orderByChild, equalTo, update, onValue, DataSnapshot } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createUserByUsername = (firstName: string, lastName: string, phoneNumber: string,
                                     username: string, email: string | null, uid: string) => {
    console.log(firstName, lastName, uid)
    return set(ref(db, `users/${username}`),
        { firstName, lastName, phoneNumber, username, email, uid, teams: [], channels: [], friends: [] },
    );
};

export const getUserByUsername = (username: string) => {
    return get(ref(db, `users/${username}`));
};

export const getLiveChannelsByUsername = (username: string, listen: (_snapshot: DataSnapshot) => void) => {
    return onValue(ref(db, `users/${username}/channels`), listen);
};

export const getLiveTeamsByUsername = (username: string, listen: (_snapshot: DataSnapshot) => void) => {
    return onValue(ref(db, `users/${username}/teams`), listen);
};

export const getLiveUserByUsername = (username: string, listen: (_snapshot: DataSnapshot) => void) => {
    return onValue(ref(db, `users/${username}`), listen);
};

export const getUserData = (uid: string) => {
    return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getAllUsers = () => {
    return get(query(ref(db, 'users')));
};

export const updateUserTeams = (username: string, teamName: string) => {
    const updateTeams: { [index: string]: boolean } = {};
    updateTeams[`/users/${username}/teams/${teamName}`] = true;
    return update(ref(db), updateTeams);
};

export const updateUserAvatar = (username: string, imgURL: string) => {
    const updateImgURL: { [index: string]: string } = {};
    updateImgURL[`/users/${username}/imgURL`] = imgURL;
    return update(ref(db), updateImgURL);
};

export const updateUserChats = (username: string, chatName: string) => {
    const updateChats: { [index: string]: boolean } = {};
    updateChats[`/users/${username}/channels/${chatName}`] = true;
    return update(ref(db), updateChats);
};

export const updateUserStatus = (username: string, status: string) => {
    return update(ref(db), {
        [`users/${username}/status`]: status,
    });
};

export const getLiveStatus = (username: string, listen: (_snapshot: DataSnapshot) => void) => {
    return onValue(ref(db, `users/${username}/status`), listen);
};
