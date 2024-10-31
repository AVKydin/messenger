import { useContext } from 'react';
import AppContext from '../providers/AppContext';
import { Navigate, useLocation } from 'react-router-dom';

interface Props {
    children: JSX.Element
}

const Authenticated = ({ children }: Props) => {
    const { appState } = useContext(AppContext);
    const user = appState.user;
    const location = useLocation();

    if (!user) {
        return <Navigate to="/home-page" state={{ from: location }} />;
    }

    return children;
};

export default Authenticated;
