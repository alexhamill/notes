import React, { useEffect, useState } from "react";
import { docRef, useUser, getDocData, useruid, createdoc, nestedcol, nesteddoc} from "../base/UserContext.tsx";
import { auth, db } from "../base/firebase";
import { collection, doc, getDoc, addDoc, Timestamp, updateDoc } from "firebase/firestore";
import Head from "../components/head.tsx";
import Sticky from "./stickynote.tsx";



const Whiteboard: React.FC = () => {
    const [Stickynotes, setStickynotes] = React.useState<any[]>([]);
    const { user, userData } = useUser();
    const [rerender, setRender] = useState(false);
    const [date, setDate] = useState(new Date());
    
    useEffect(() => {
        
        if (!user) return;
            getDocData("Sticky-notes").then((data) => {
                setStickynotes(data);
            });
    }, );

        function addnote(e: React.MouseEvent<HTMLDivElement>) {
            console.log("clicked")
            e.preventDefault();
            const createdoc = async () => {
                const docRef = await addDoc(nestedcol("Sticky-notes"), { useruid: useruid(), content: "", top: "100px", left: "100px", width: "100px", height: "100px", color: "#f0f0f0" }); 
                console.log("Document created with ID:", docRef.id);
            };
            createdoc();
        }

    return(
        <div>
            <div onClick={(e) => {addnote(e)}} style={{position:"absolute", left:"300px", top:"300px", width:"150px", height:"50px", backgroundColor:"#f0f0f0"}}>
                <p>+ new note</p>
            </div>
            {Stickynotes.map((note) => (

                <Sticky
                    key={note.id}
                    note={note}
                />
            ))}

        </div>
    );
}

export default Whiteboard;