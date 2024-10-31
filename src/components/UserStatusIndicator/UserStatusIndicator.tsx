import { useEffect, useState } from 'react';
import { UserStatus as UserStatusEnum } from '../../common/user-status.enum';
import { getLiveStatus } from '../../services/users.services';
import { User } from '../../types/Interfaces';
import './UserStatusIndicator.css';

interface UserStatusProps {
    user: User,
}

const UserStatusIndicator = ({ user }: UserStatusProps) => {
    const [color, setColor] = useState('');

    useEffect(() => {
        const unsubscribe = getLiveStatus(user.username, (snapshot) => {
            const currentStatusInDB: UserStatusEnum = snapshot.val();

            if (currentStatusInDB === UserStatusEnum.ONLINE) setColor('#83D350');
            if (currentStatusInDB === UserStatusEnum.AWAY) setColor('#FBCE02');
            if (currentStatusInDB === UserStatusEnum.DO_NOT_DISTURB) setColor('#BC0000');
            if (currentStatusInDB === UserStatusEnum.IN_A_MEETING) setColor('#680003');
            if (currentStatusInDB === UserStatusEnum.OFFLINE) setColor('#4a4949');
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <span className='user-status' style={{ backgroundColor: color }}></span>
    );
};

export default UserStatusIndicator;
