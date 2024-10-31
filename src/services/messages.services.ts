import { DataSnapshot, get, onValue, push, ref, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Message } from '../types/Interfaces';

export const getLiveMessages = (chatId: string, listen: (_snapshot: DataSnapshot) => void) => {
    return onValue(ref(db, `channels/${chatId}/messages`), listen);
};

export const fromMessagesDocument = (snapshot: DataSnapshot): Message[] => {
    if (!snapshot.exists()) return [];

    const messagesDocument = snapshot.val();
    return Object.keys(messagesDocument).map((key) => {
        const message = messagesDocument[key];

        return {
            ...message,
            id: key,
            createdOn: new Date(message.createdOn),
            likedBy: message.likedBy ? Object.keys(message.likedBy) : [],
        };
    });
};

export const addMessage = async (chatId: string, username: string, content: string) => {
    const res = await push(ref(db, `channels/${chatId}/messages`), {
        author: username,
        content,
        createdOn: Date.now(),
        likedBy: [],
    });
    return await getMessageById(chatId, res.key);
};

export const addMessageImage = async (chatId: string, username: string, fileURL: string) => {
    const res = await push(ref(db, `channels/${chatId}/messages`), {
        author: username,
        content: '',
        fileURL: fileURL,
        createdOn: Date.now(),
        likedBy: [],
        image: true,
    });
    return await getMessageById(chatId, res.key);
};

export const editMessage = (chatId: string, messageId: string, content: string) => {
    return update(ref(db), {
        [`channels/${chatId}/messages/${messageId}/content`]: content,
    });
};

export const getMessageById = async (chatId: string, messageId: string | null) => {
    const res = await get(ref(db, `channels/${chatId}/messages/${messageId}`));
    if (!res.exists()) {
        throw new Error(`Message with id ${messageId} does not exist!`);
    }
    const message_1 = res.val();
    message_1.id = messageId;
    message_1.createdOn = new Date(message_1.createdOn);
    if (!message_1.likedBy) {
        message_1.likedBy = [];
    } else {
        message_1.likedBy = Object.keys(message_1.likedBy);
    }
    return message_1;
};

export const deleteMessage = (chatId: string, messageId: string) => {
    return remove(ref(db, `channels/${chatId}/messages/${messageId}`));
};
