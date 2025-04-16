import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser, getAuth } from "firebase/auth";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; // your Firebase config
import { query, getDocs } from "firebase/firestore";

// Define a shape for your Firestore user data
interface UserData {
  firstname?: string;
  lastname?: string;
  email?: string;
  role?: string;
}

interface UserContextType {
  user: FirebaseUser | null;
  userData: UserData | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  userData: null,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, userData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export const useruid = () => getAuth().currentUser?.uid;

export const docRef =  () => doc(db, "users", useruid() || "");

export const nestedcol = (collectionName: string) => collection(db, "users", useruid() || "", collectionName);

export const nesteddoc = (collectionName: string, docId: string) => {
  const path = ["users", useruid() || "", collectionName, docId];
  const docRef = doc(db, path.join("/"));
  return(docRef);
};

export const getNestedDocument = (pathSegments: string[]) => {
  return doc(db, pathSegments.join("/"));
};



export const getDocData = async (collectionName: string): Promise<any[]> => {
  const collectionRef = collection(db, "users", useruid() || "", collectionName);
  const querySnapshot = await getDocs(query(collectionRef));
  const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return data;
};

export const getDocDataAsArray = async (docRef: any): Promise<any[]> => {
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data() as Record<string, unknown>;
    console.log("Document data:", data);
    return Object.entries(data).map(([key, value]) => ({ key, value }));
  }
  console.warn("Document does not exist or no data found.");
  return [];
};

export const createdoc = async (collectionName: string) => {
  const collectionRef = collection(db, "users", useruid() || "", collectionName); 
  const docRef = await addDoc(collectionRef, { useruid: useruid() }); 
  console.log("Document created with ID:", docRef.id);
};