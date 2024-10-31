import { useContext } from 'react';
import AppContext from '../../providers/AppContext';
import LoggedUser from '../LoggedUser/LoggedUser';
import Register from '../../views/Register/Register';

const HomePage = (): JSX.Element => {
    const { appState } = useContext(AppContext);
    const user = appState.user;

    return (
        <>
            {!user ?
                <Register /> :
                <LoggedUser />}
        </>
    );
};

export default HomePage;
