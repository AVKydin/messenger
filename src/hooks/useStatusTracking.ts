import { User } from '../types/Interfaces';
import { useIdleTimer } from 'react-idle-timer';
import { UserStatus } from '../common/user-status.enum';
import { getLiveStatus, updateUserStatus } from '../services/users.services';
import { useContext, useEffect } from 'react';
import AppContext from '../providers/AppContext';

const useStatusTracking = (loggedInUser: User) => {
    const { setState } = useContext(AppContext);
    useEffect(() => {
        const unsubscribe = getLiveStatus(loggedInUser.username, (snapshot) => {
            if (snapshot.val() !== UserStatus.OFFLINE) {
                setState((currentState) => {
                    currentState.userData!.status = snapshot.val();
                    return currentState;
                });
            }
        });

        return () => unsubscribe();
    }, [loggedInUser, setState]);

    const onIdle = () => {
        if (loggedInUser.status === UserStatus.DO_NOT_DISTURB || loggedInUser.status === UserStatus.IN_A_MEETING) {
            return;
        }

        updateUserStatus(loggedInUser.username, UserStatus.AWAY).catch(console.error);
    };

    const onActive = () => {
        if (loggedInUser.status === UserStatus.DO_NOT_DISTURB || loggedInUser.status === UserStatus.IN_A_MEETING) {
            return;
        }

        updateUserStatus(loggedInUser.username, UserStatus.ONLINE).catch(console.error);
    };

    const onAction = () => {
        if (loggedInUser.status === UserStatus.DO_NOT_DISTURB || loggedInUser.status === UserStatus.IN_A_MEETING) {
            return;
        }

        updateUserStatus(loggedInUser.username, UserStatus.ONLINE).catch(console.error);
    };

    useIdleTimer({
        onIdle: onIdle,
        onActive: onActive,
        onAction: onAction,
        timeout: 1000 * 5 * 60,
    });
};
export default useStatusTracking;
