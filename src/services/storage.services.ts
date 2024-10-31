import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { addMessageImage } from './messages.services';
import { updateUserAvatar } from './users.services';

const storage = getStorage();
export const uploadImage = (file: File, username: string) => {
    const storageRefAvatars = ref(storage, `avatars/${username}`);
    const uploadTask = uploadBytesResumable(storageRefAvatars, file);
    return uploadTask.on('state_changed',
        (_) => { },
        (error) => {
            toast.error('Something went wrong with the upload!');
            console.error(error.message);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    updateUserAvatar(username, downloadURL);
                })
                .catch((error) => console.error(error));
        });
};

export const uploadImageMessage = (file: File, channelID: string, username: string) => {
    const storageRefAvatars = ref(storage, `messages/${channelID}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRefAvatars, file);
    return uploadTask.on('state_changed',
        (_) => {
        },
        (error) => {
            toast.error('Something went wrong with the upload!');
            console.error(error.message);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => {
                    addMessageImage(channelID, username, downloadURL);
                })
                .catch((error) => console.error(error));
        });
};

