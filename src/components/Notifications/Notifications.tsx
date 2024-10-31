import { useContext, useEffect, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { getLiveMessages } from '../../services/messages.services';
import { Channel, Message } from '../../types/Interfaces';
import './Notifications.css';

interface NotificationProps {
    currentChannel: Channel,
    activeChannel: Channel,
}

const Notifications = ({ currentChannel, activeChannel }: NotificationProps) => {
    const [isNotif, setIsNotif] = useState(false);

    const { appState } = useContext(AppContext);
    const currentUser = appState.userData?.username;

    useEffect(() => {
        let messagesCount = currentChannel.messages ? Object.keys(currentChannel.messages).length : 0;

        const unsubscribe = getLiveMessages(currentChannel.id, (snapshot) => {
            if (!snapshot.exists()) return;

            const messages: Message[] = Object.values(snapshot.val());

            if (currentChannel.id === activeChannel.id) {
                setIsNotif(false);
                return;
            }

            if (messages[messages.length - 1].author === currentUser) {
                messagesCount = messages.length;
                setIsNotif(false);
                return;
            }

            if (messagesCount === messages.length) {
                setIsNotif(false);
                return;
            }

            messagesCount = messages.length;
            setIsNotif(true);
        });

        if (currentChannel.id === activeChannel.id) {
            setIsNotif(false);
        }
        return () => unsubscribe();
    }, [currentChannel, activeChannel, currentUser]);

    return (
        <>
            {isNotif ?
                <span className='notif-icon'><i className='fa-solid fa-bell'></i></span> :
                null
            }
        </>
    );
};

export default Notifications;
