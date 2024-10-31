import { useContext, useState } from 'react';
import { uid } from 'uid';
import AppContext from '../../providers/AppContext';
import { User, UsersListProps } from '../../types/Interfaces';
import UserComponent from '../User/User';
// @ts-ignore
import Add from '../../assets/images/Add.png';
// @ts-ignore
import Delete from '../../assets/images/Delete.png';
import './ManipulateUsersLists.css';

const ManipulateUsersLists = ({ leftSide, setLeftSide, rightSide, setRightSide }: UsersListProps): JSX.Element => {
    const [searchTermLeft, setSearchTermLeft] = useState<string>('');
    const [searchTermRight, setSearchTermRight] = useState<string>('');

    const { appState } = useContext(AppContext);
    const currentUser = appState.userData?.username;

    const getUsersBySearchTerm = (searchTerm: string, users: User[]) => {
        return users.filter((user) =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.firstName.toLowerCase().includes(searchTerm) ||
            user.lastName.toLowerCase().includes(searchTerm));
    };

    const leftResult = getUsersBySearchTerm(searchTermLeft, leftSide);
    const rightResult = getUsersBySearchTerm(searchTermRight, rightSide);

    const handleAddUser = (user: User): void => {
        setRightSide([
            ...rightSide,
            user,
        ]);

        setLeftSide(leftSide.filter((u) => u.uid !== user.uid));
    };

    const handleRemoveUser = (user: User): void => {
        setRightSide(rightSide.filter((u) => u.uid !== user.uid));

        setLeftSide([
            ...leftSide,
            user,
        ]);
    };

    const mappingUserAddButton = (user: User): JSX.Element | undefined => {
        const buttonEl: JSX.Element =
            <button onClick={() => {
                handleAddUser(user);
            }} id='add-remove-user-btn'>
                <img src={Add} alt='add-btn' />
            </button>;
        if (user.username !== currentUser) {
            return <div key={uid()}>
                <UserComponent props={{ user, buttonEl }} />
            </div>;
        }
    };

    const mappingUserRemoveButton = (user: User): JSX.Element | undefined => {
        const buttonEl: JSX.Element =
            <button onClick={() => {
                handleRemoveUser(user);
            }} id='add-remove-user-btn'>
                <img src={Delete} alt='remove-btn' />
            </button>;
        if (user.username !== currentUser) {
            return <div key={uid()}>
                <UserComponent props={{ user, buttonEl }} />
            </div>;
        }
    };

    return (
        <div className='create-team-view'>
            <div className='create-team-wrapper'>
                <div id="create-team-form" >
                    <div className="search-users-create-team">
                        <input type="text" defaultValue="" placeholder='search Users...' onChange={(event) => setSearchTermLeft(event.target.value)} />
                    </div>
                </div>

                {/* LEFT SIDE */}
                <div className='users-container'>
                    {searchTermLeft ?
                        leftResult.length > 0 ?
                            leftResult.map(mappingUserAddButton) :
                            <p>No users found</p> :
                        leftSide.map(mappingUserAddButton)
                    }
                </div>
            </div >

            {/* RIGHT SIDE */}
            <div className='list-of-added-participants'>
                <input type="text" defaultValue="" placeholder='search Users...' onChange={(event) => setSearchTermRight(event.target.value)} />
                <div className='users-container-added'>
                    {searchTermRight ?
                        rightResult.length > 0 ?
                            rightResult.map(mappingUserRemoveButton) :
                            <p>No users found</p> :
                        rightSide.map(mappingUserRemoveButton)
                    }
                </div>
            </div>

        </div>
    );
};

export default ManipulateUsersLists;
