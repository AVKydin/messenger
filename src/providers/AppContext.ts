import { createContext } from 'react';
import { ApplicationContext } from '../types/Interfaces';

const AppContext = createContext<ApplicationContext>({} as ApplicationContext);

export default AppContext;
