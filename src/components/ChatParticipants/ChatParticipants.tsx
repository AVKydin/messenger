import { deleteUserFromChat, removeUserFromChannel } from '../../services/channels.services';
import { ToastContainer, toast } from 'react-toastify';
import { ChatParticipantsProps, User } from '../../types/Interfaces';
import { useContext } from 'react';
import AppContext from '../../providers/AppContext';
import { uid } from 'uid';
import UserComponent from '../User/User';
import './ChatParticipants.css';

const ChatParticipants = ({ currentChannel, allUsers, owner }: ChatParticipantsProps): JSX.Element | null => {
    const { appState,
        isDetailedChatClicked,
        setIsCreateChatClicked,
        setIsDetailedChatClicked,
        setIsTeamView,
    } = useContext(AppContext);

    const userUsername = appState.userData?.username;

    const URL = window.location.href;

    if (owner && currentChannel.participants.includes(owner?.username) &&
        allUsers.every((user) => user.username !== owner?.username)) {
        allUsers = [...allUsers, owner];
    }

    const leaveChat = () => {
        deleteUserFromChat(userUsername, currentChannel.title)
            .then(() => {
                toast.success(`You have successfully been removed from chat ${currentChannel.title}!`);
                setIsDetailedChatClicked(false);
                const currentUserIndex = currentChannel.participants.indexOf(userUsername!);

                removeUserFromChannel(currentChannel.id, currentUserIndex);
            })
            .catch(((err) => {
                toast.error('Sorry, something went wrong with leaving the chat!');
                console.error(err.message);
            }));
    };

    const mappingParticipants = (participant: User, key: string) => {
        return <div key={key}>
            <UserComponent props={{ user: participant }} />
        </div>;
    };

    const loadTeamDetails = () => {
        setIsDetailedChatClicked(false);
        setIsCreateChatClicked(false);
        setIsTeamView(true);
    };

    const currentChannelUsers = allUsers
        .filter((user) => currentChannel.participants.includes(user.username));

    return (
        isDetailedChatClicked ?
            <div className='participants-list'>
                    <>
                        <h4>Participants of chat:</h4><div className='participants'>
                        {currentChannelUsers.map((participant) => mappingParticipants(participant, uid()))}
                    </div>

                        <div className='manage-participants-btns'>
                            {URL.includes('/teams/') ?
                                <button className='add-btn' onClick={() => loadTeamDetails()}><span>Team details</span></button> :
                                null}
                            <br />
                            <button onClick={() => leaveChat()} className='leave-btn'>Leave channel</button>
                        </div>
                    </>
                <ToastContainer
                    autoClose={2000}
                ></ToastContainer>
            </div> :
            <div className='participants-list'>
            </div>
    );
};

export default ChatParticipants;
