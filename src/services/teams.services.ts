import { equalTo, get, orderByChild, query, ref, push, DatabaseReference } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Team } from '../types/Interfaces';

export const getTeamByName = (name: string) => {
    return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)));
};

export const addTeamToDB = async (name: string, owner: string, members: string[] | []): Promise<DatabaseReference> => {
    const team: Team = {
        name: name,
        owner: owner,
        members: members || [],
        channels: [],
    };

    return push(ref(db, 'teams'), team);
};



