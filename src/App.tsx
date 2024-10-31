import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import AppContext from './providers/AppContext';
import Login from './views/Login/Login';
import { AuthStateHook, useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { getUserData } from './services/users.services';
import NotFound from './views/NotFound/NotFound';
import { iAppState } from './types/Interfaces';
import './App.css';
import { IdleTimerProvider } from 'react-idle-timer';
import HomePage from "./views/HomePage/HomePage";

function App() {
  const [appState, setState] = useState<iAppState>({
    user: null,
    userData: null,
  });

  const [isTeamView, setIsTeamView] = useState(false);
  const [isDetailedChatClicked, setIsDetailedChatClicked] = useState(false);
  const [isCreateChatClicked, setIsCreateChatClicked] = useState(false);
  const [isMeetingClicked, setIsMeetingClicked] = useState(false);

  const [user]: AuthStateHook = useAuthState(auth);

  useEffect(() => {
    if (user === null || user === undefined) return;

    getUserData(user.uid)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            throw new Error('Something went wrong!');
          }

          setState({
            user,
            userData: snapshot.val()[Object.keys(snapshot.val())[0]],
          });
        })
        .catch(console.error);
  }, [user]);

  return (
      <div className="App">
        <BrowserRouter>
          <AppContext.Provider value={{
            appState,
            setState,
            isTeamView,
            setIsTeamView,
            setIsCreateChatClicked,
            isCreateChatClicked,
            setIsDetailedChatClicked,
            isDetailedChatClicked,
            isMeetingClicked,
            setIsMeetingClicked,
          }}>
            <IdleTimerProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Navigate to="/home-page" />} />
                <Route path="home-page" element={<HomePage />} />
                <Route path="login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </IdleTimerProvider>
          </AppContext.Provider>
        </BrowserRouter>
      </div>
  );
}

export default App;
