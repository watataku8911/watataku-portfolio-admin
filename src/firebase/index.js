import firebase from "./firebase.config"

import "firebase/auth";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

export const auth = firebase.auth();
export const db = firebase.firestore();
export const functions = firebase.functions();
export const storage = firebase.storage();
export const fb = firebase;
export const FirebaseFieldValue = firebase.firestore.FieldValue
export const FirebaseTimestamp = firebase.firestore.Timestamp;