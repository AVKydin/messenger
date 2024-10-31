import React, { useEffect, useState } from 'react';
import { CreateMessageProps } from '../../types/Interfaces';
import './CreateMessage.css';

const CreateMessage = ({ handleSubmit, existingMessage }: CreateMessageProps) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (existingMessage) {
            setMessage(() => existingMessage);
        } else {
            setMessage(() => '');
        }
    }, [existingMessage]);

    const sendMessage = () => {
        console.log(message)
        handleSubmit(message);
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className='message-box'>
            <textarea className='message-textarea' placeholder='Write a message here...' value={message} onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)}></textarea>

            <button className='send-btn' value='' onClick={sendMessage}>Send</button>
        </div>
    );
};

export default CreateMessage;
