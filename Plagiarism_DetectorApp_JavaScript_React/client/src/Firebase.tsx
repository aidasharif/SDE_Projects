import 'firebase/database';
import firebase from 'firebase'
 
/**
* To initialize Firebase in our app, we add the Firebase project configuration here.
* this config object is taken from our project's apps from 
* the Firebase console's Project settings page.
*/
var firebaseConfig = {
    //Here's the format of a config object with all services enabled (these values are automatically populated)
    apiKey: "AIzaSyA_C58L8bYP7Gz38D5jce2y68tLQqE5li8",
    authDomain: "plagiarism-username.firebaseapp.com",
    databaseURL: "https://plagiarism-username.firebaseio.com",
    projectId: "plagiarism-username",
    storageBucket: "plagiarism-username.appspot.com",
    messagingSenderId: "817523274570",
    appId: "1:817523274570:web:4f83b5a291dc26bfab07b3",
    measurementId: "G-5MT4Q7C0GJ"
};
 
const fire=firebase.initializeApp(firebaseConfig)

//Access Firebase firestor services using shorthand notation
export const db=firebase.firestore()
export default fire

