import { ChannelProps, Message as IMessage } from '../../types/Interfaces';
import { useContext, useEffect, useRef, useState } from 'react';
import { editMessage, fromMessagesDocument, getLiveMessages } from '../../services/messages.services';
import CreateMessage from '../CreateMessage/CreateMessage';
import Message from '../Message/Message';
import { addMessage } from '../../services/messages.services';
import AppContext from '../../providers/AppContext';
import { updateChannelLastActivity } from '../../services/channels.services';
import { toast, ToastContainer } from 'react-toastify';
import Dropzone from 'react-dropzone';
import { uploadImageMessage } from '../../services/storage.services';
import './Channel.css';

const Channel = ({ currentChannel }: ChannelProps) => {
    const { appState } = useContext(AppContext);
    const user = appState.userData;

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [messageToBeEdited, setMessageToBeEdited] = useState<IMessage>();
    const [isInEditMode, setIsInEditMode] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsInEditMode(false);
        setMessageToBeEdited({} as IMessage);
    }, [currentChannel]);

    useEffect(() => {
        if (currentChannel.id === '') return;

        const unsubscribe = getLiveMessages(currentChannel.id, (snapshot) => {
            const processedMessages = fromMessagesDocument(snapshot);
            setMessages(processedMessages);
        });

        return () => unsubscribe();
    }, [currentChannel.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (selectedFiles.length === 0) {
            setPreviews([]);
            return;
        }

        const filePreviews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviews(filePreviews);

        return () => {
            filePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [selectedFiles]);

    const onSelectFiles = (acceptedFiles: File[]) => {
        setSelectedFiles(acceptedFiles);
    };

    const handleUploadFiles = () => {
        selectedFiles.forEach(file => {
            uploadImageMessage(file, currentChannel.id, user?.username!);
        });
        updateChannelLastActivity(currentChannel.id, Date.now()).catch(console.error);
        setSelectedFiles([]);
    };

    const handleCloseUploadFiles = () => {
        setPreviews([]);
        setSelectedFiles([]);
    };

    const handleEditMessage = (currentMessage: IMessage) => {
        setIsInEditMode(true);
        setMessageToBeEdited(currentMessage);
    };

    const handleSubmit = (message: string) => {
        if (message.trim().length > 0) {
            if (isInEditMode) {
                setIsInEditMode(false);
                editMessage(currentChannel?.id, messageToBeEdited?.id!, message)
                    .catch(console.error);
            } else {
                addMessage(currentChannel.id, user?.username!, message)
                    .then(() => updateChannelLastActivity(currentChannel.id, Date.now()))
                    .catch((err) => {
                        toast.error('Sorry, something went wrong');
                        console.error(err);
                    });
            }
        } else {
            toast.warning('Please enter a message!');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className='channel-container'>
            <h2>{currentChannel.title}</h2>

            <div className='messages-container'>
                {messages.length === 0 ?
                    <p>Be the first to start a conversation</p> :
                    <>
                        {messages.map((message, key) => <Message currentChannel={currentChannel}
                                                                 message={message} handleEditMessage={handleEditMessage} key={key}
                                                                 toBeEdited={messageToBeEdited === message} />)}

                        <div ref={messagesEndRef}></div>
                    </>
                }
            </div>

            {previews.length > 0 &&
                <div className='files-upload'>
                    {previews.map((preview, index) => (
                        <div className='file-upload' key={index}>
                            <img src={preview} alt={`selected file ${index + 1}`} className='sample-upload' />
                        </div>
                    ))}
                    <button type='submit' className='send-btn' value='' onClick={handleUploadFiles}>Upload</button>
                    <button type='submit' className='close-btn' value='' onClick={handleCloseUploadFiles}>Close</button>
                </div>
            }

            <Dropzone onDrop={onSelectFiles} multiple={true}>
                {({ getRootProps, getInputProps }) => (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p className='drag-n-drop'>Drag 'n' drop your pictures, or click to select multiple files!</p>
                        </div>
                    </section>
                )}
            </Dropzone><br /><br />

            <CreateMessage handleSubmit={handleSubmit} existingMessage={messageToBeEdited?.content} />
            <ToastContainer autoClose={2000} />
        </div>
    );
};

export default Channel;
