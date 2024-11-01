import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../providers/AppContext';
import { getLiveUserByUsername, updateUserStatus } from '../../services/users.services';
import { ToastContainer } from 'react-toastify';
import { User } from '../../types/Interfaces';
import InitialsAvatar from 'react-initials-avatar';
import UserStatusIndicator from '../UserStatusIndicator/UserStatusIndicator';
import OutsideClickHandler from 'react-outside-click-handler';
import { UserStatus } from '../../common/user-status.enum';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';
import {logOut} from "../../services/auth.services";
import {useNavigate} from "react-router-dom";

const Header = (): JSX.Element => {
    const { appState, setState
    } = useContext(AppContext);
    const user = appState.user;
    const userUsername = appState.userData?.username;

    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [userData, setUserData] = useState<User>({} as User);
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState<HTMLElement>();
    const [width, setWidth] = useState(window.innerWidth);
    const [isNavMenu, setIsNavMenu] = useState(true);

    useEffect(() => {
        const handleWidth = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleWidth);

        return () => window.removeEventListener('resize', handleWidth);
    }, []);

    useEffect(() => {
        if (appState.userData?.username) {
            const unsubscribe = getLiveUserByUsername(appState.userData.username,
                (snapshot) => {
                    setUserData((snapshot.val()));
                });

            return () => unsubscribe();
        }
    }, [appState.userData?.username]);

    useEffect(() => {
        activeButton?.classList.add('active-header-button');
    }, [activeButton?.classList]);

    const handleStatusClick = (e: React.MouseEvent<HTMLElement>) => {
        activeButton?.classList.remove('active-header-button');
        setActiveButton(e.currentTarget);
        setIsStatusOpen(!isStatusOpen);
    };

    const handleBusy = () => {
        updateUserStatus(userUsername!, UserStatus.DO_NOT_DISTURB).catch(console.error);
    };

    const handleOnline = () => {
        updateUserStatus(userUsername!, UserStatus.ONLINE).catch(console.error);
    };

    const handleLogOut = () => {
        setState({
            user: null,
            userData: null,
        });

        logOut().catch(console.error);
        updateUserStatus(userUsername!, UserStatus.OFFLINE).catch(console.error);
        navigate('/');
    };

    return (
        <>
            <header id='header'>

                <button onClick={handleLogOut} className='header-btn' id='logout-btn'>Log out</button>
                {width < 1050 && user &&
                    <button className='send-btn' value='' onClick={() => setIsNavMenu(!isNavMenu)}>
                        <i className="fa-solid fa-bars  "></i>
                    </button>}

                {user ?

                    <div className='header-avatar'>
                        <div style={{textDecoration: 'none'}}>
                            {userData.imgURL ?
                                <img src={userData.imgURL} alt='avatar' className='user-avatar-header'/> :
                                <InitialsAvatar name={`${userData.firstName} ${userData.lastName}`}
                                                className={'avatar-default-header'}/>
                            }
                        </div>
                        <button className='set-status-btn' onClick={handleStatusClick}><UserStatusIndicator
                            user={appState.userData!}/></button>
                        {isStatusOpen &&
                            <div className='dropdown-menu-status'>
                                <OutsideClickHandler
                                    onOutsideClick={() => setIsStatusOpen(false)}>
                                    <button onClick={handleBusy}>Busy</button>
                                    <button onClick={handleOnline}>Online</button>
                                </OutsideClickHandler>
                            </div>
                        }

                    </div> :
                    null}
            </header>
            <ToastContainer
                autoClose={2000}
            ></ToastContainer>
        </>
    );
};

export default Header;
