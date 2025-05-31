import {
    doc,
    setDoc,
    getDoc,
    serverTimestamp
} from "firebase/firestore";
import { firestore } from "./init";

// export const saveUserData = async (user) => {
//     const userRef = doc(firestore, "users", user.uid);

//     await setDoc(userRef, {
//         id: user.uid,
//         email: user.email,
//         lastLogin: serverTimestamp(),
//         created: serverTimestamp()
//     }, { merge: true });
// };

export const saveUserData = async (user, isNewUser = false) => {
  const userRef = doc(firestore, "users", user.uid);
  
  const userData = {
    id: user.uid,
    email: user.email,
    lastLogin: serverTimestamp()
  };

  if (isNewUser) {
    userData.created = serverTimestamp();
  }

  await setDoc(userRef, userData, { merge: true });
};

export const fetchUserData = async (userId) => {
    const userRef = doc(firestore, "users", userId);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        const data = snapshot.data();
        return {
            id: data.id,
            lastLogin: data.lastLogin.toDate(),
            created: data.created?.toDate()
        };
    }
    return null;
};

export const updateLastLogin = async (userId) => {
    const userRef = doc(firestore, "users", userId);
    await setDoc(userRef, {
        lastLogin: serverTimestamp()
    }, { merge: true });
};