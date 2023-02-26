import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import credentials from './credentials';

export const App = initializeApp (credentials.config);
export const db = getFirestore (App);
