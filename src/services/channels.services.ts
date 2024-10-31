import { ref, get, push, update, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';
import { User } from '../types/Interfaces';

export const getChatById = async (id: string | null) => {
    const result = await get(ref(db, `channels/${id}`));
    if (!result.exists()) {
        throw new Error(`Channel with id ${id} does not exist!`);
    }
    const chat = result.val();
    chat.id = id;
    chat.date = new Date(chat.date);
    if (!chat.participants) {
        chat.participants = {};
    } else {
        chat.participants = Object.values(chat.participants);
    }
    return chat;
};

export const createChat = async (title: string, participants: string[] | User[]) => {
    const result_2 = await push(ref(db, 'channels'), {
        title,
        participants,
        messages: [],
        lastActivity: Date.now(),
        isPublic: false,
    });
    return await getChatById(result_2.key);
};

export const deleteUserFromChat = (username: string | undefined, chatName: string) => {
    return update(ref(db), {
        [`users/${username}/channels/${chatName}`]: null,
    });
};

export const getChatByName = (chatName: string) => {
    return get(query(ref(db, 'channels'), orderByChild('title'), equalTo(chatName)));
};

export const removeUserFromChannel = (channelID: string, userIndex: number) => {
    return update(ref(db), {
        [`channels/${channelID}/participants/${userIndex}`]: null,
    });
};

export const updateChannelLastActivity = (channelID: string, date: number) => {
    return update(ref(db), {
        [`channels/${channelID}/lastActivity`]: date,
    });
};
