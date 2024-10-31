import { useContext, useEffect, useState } from 'react';
import { getAllUsers, getLiveChannelsByUsername, updateUserChats, updateUserTeams } from '../../services/users.services';
import AppContext from '../../providers/AppContext';
import Channel from '../../components/Channel/Channel';
import { Channel as IChannel, User } from '../../types/Interfaces';
import ChatParticipants from '../../components/ChatParticipants/ChatParticipants';
import ChannelsList from '../../components/ChannelsList/ChannelsList';
import { toast } from 'react-toastify';
import { createChat, getChatByName } from '../../services/channels.services';
import { useNavigate } from 'react-router-dom';
import './LoggedUser.css';
import {addTeamToDB, getTeamByName} from "../../services/teams.services";
import useStatusTracking from "../../hooks/useStatusTracking";
import ManipulateUsersLists from "../../components/ManipulateUsersLists/ManipulateUsersLists";
import {
    MAX_CHANNEL_NAME_LENGTH, MAX_TEAM_NAME_LENGTH,
    MIN_CHANNEL_NAME_LENGTH,
    MIN_NUMBER_OF_CHAT_PARTICIPANTS, MIN_TEAM_NAME_LENGTH
} from "../../common/constants";

const LoggedUser = (): JSX.Element => {
    const { appState,
        isTeamView,
        isDetailedChatClicked,
        isCreateChatClicked,
        setIsCreateChatClicked,
        setIsDetailedChatClicked,
        setIsTeamView,
    } = useContext(AppContext);
    const userDetails: User = appState.userData!;

    const [currentChat, setCurrentChat] = useState<IChannel>({
        id: '',
        title: '',
        participants: [],
        messages: [],
        isPublic: false,
        teamID: '',
        lastActivity: new Date(),
    });

    const [channels, setChannels] = useState<IChannel[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [initialParticipants, setInitialParticipants] = useState<User[]>([]);
    const [addedParticipants, setAddedParticipants] = useState<User[]>([]);
    const [title, setTitle] = useState<string>('');

    const navigate = useNavigate();
    useStatusTracking(userDetails);

    useEffect(() => {
        if (appState.userData?.username) {
            const unsubscribe = getLiveChannelsByUsername(appState.userData.username,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const userChatsNames = Object.keys(snapshot.val());
                        const channelsObjPr = userChatsNames.map((chatName) => {
                            return getChatByName(chatName)
                                .then((snapshotChanObj) => {
                                    if (snapshot.exists()) {
                                        const dbObject: object = snapshotChanObj.val();
                                        const id: string = Object.keys(dbObject)[0];
                                        const channel: IChannel = Object.values(dbObject)[0];

                                        channel.id = id;
                                        return channel;
                                    } else {
                                        return {} as IChannel;
                                    }
                                });
                        });

                        Promise.all(channelsObjPr)
                            .then((values) => {
                                const sortedChannels: IChannel[] = values
                                    .sort((chan1, chan2) => +chan1.lastActivity < +chan2.lastActivity ? 1 : -1);
                                setChannels(sortedChannels);
                            });
                    }
                });

            return () => unsubscribe();
        }
    }, [appState.userData?.username]);

    useEffect(() => {
        getAllUsers()
            .then((snapshot) => {
                const allUsers: User[] = Object.values(snapshot.val());

                setAllUsers(allUsers);
                setInitialParticipants(allUsers);
            })
            .catch(console.error);
    }, []);

    const createChatFunc = () => {
        if (title.length < MIN_CHANNEL_NAME_LENGTH || title.length > MAX_CHANNEL_NAME_LENGTH) {
            return toast.warning(`The name of the chat must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH} symbols`);
        }

        if (addedParticipants.length === MIN_NUMBER_OF_CHAT_PARTICIPANTS) {
            return toast.warning('Please add at least one participant in the chat!');
        }

        const userIDs = addedParticipants.map((user) => user.username);

        getChatByName(title)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    return toast.warning('This chat name is already taken! Please choose a different one.');
                } else {
                    createChat(title, [...userIDs, userDetails?.username!])
                        .then((res) => {
                            setCurrentChat(res);
                            toast.success('Successful chat creation!');
                            setIsCreateChatClicked(!isCreateChatClicked);

                            [...userIDs, userDetails?.username!].map((participant) => updateUserChats(participant, title));
                        })
                        .catch((err) => toast.warning(`Something went wrong  ${err.message}`));

                    setInitialParticipants(allUsers);
                    setAddedParticipants([]);
                    setIsDetailedChatClicked(true);
                    setTitle('');
                }
            });
    };

    const createTeam = () => {
        if (title.length < MIN_TEAM_NAME_LENGTH || title.length > MAX_TEAM_NAME_LENGTH) {
            return toast.warning(`The name of the team must be between ${MIN_TEAM_NAME_LENGTH} and ${MAX_TEAM_NAME_LENGTH} symbols`);
        }

        const owner = userDetails?.username;

        getTeamByName(title)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    return toast.warning(`This name ${title} already exists!`);
                } else {
                    const membersIds = addedParticipants.map((user) => user.username);

                    addTeamToDB(title.trim(), owner!, membersIds)
                        .then(() => {
                            [...membersIds, owner].forEach((username) => updateUserTeams(username!, title));
                            toast.success('You have successfully created a Team!');
                        })
                        .catch(console.error);
                }
            })
            .then(() => {
                setIsTeamView(!isTeamView);
                setTitle('');
                navigate(`/teams/${title}`);
            })
            .catch(console.error);
    };

    return (
        <div className="landing-page">
            <ChannelsList props={{ channels, setCurrentChat }} />

            <div className="main-container">
                <>
                    {isCreateChatClicked &&
                        <>
                            <input type="text" className={'create-chat-title'} name="team-name" placeholder='Please, add a title...' required defaultValue='' onChange={(e) => setTitle(e.target.value.trim())} />
                            <button className='create-a-team' onClick={createChatFunc}>Create a Chat</button>
                            <ManipulateUsersLists
                                leftSide={initialParticipants}
                                setLeftSide={setInitialParticipants}
                                rightSide={addedParticipants}
                                setRightSide={setAddedParticipants} />
                        </>
                    }

                    {isDetailedChatClicked &&
                        <Channel currentChannel={currentChat} />
                    }

                    {isTeamView &&
                        <>
                            <input type="text" className={'create-chat-title'} name="team-name" placeholder='Please, add a title...' required defaultValue='' onChange={(e) => setTitle(e.target.value.trim())} />
                            <button className='create-a-team' onClick={createTeam}>Create a Team</button>
                            <ManipulateUsersLists
                                leftSide={initialParticipants}
                                setLeftSide={setInitialParticipants}
                                rightSide={addedParticipants}
                                setRightSide={setAddedParticipants} />
                        </>
                    }
                </>
            </div>
            <ChatParticipants currentChannel={currentChat} allUsers={allUsers} />
        </div>
    );
};

export default LoggedUser;
