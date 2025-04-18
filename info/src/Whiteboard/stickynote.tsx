import React, { useEffect, useState } from "react";
import { docRef, useUser, getDocData, useruid, createdoc, nestedcol, nesteddoc} from "../base/UserContext.tsx";
import { auth, db } from "../base/firebase";
import { collection, doc, getDoc, addDoc, Timestamp, updateDoc } from "firebase/firestore";
import "./sticky.css"

interface StickyNote {
    idd: string;
    content: string;
    color: string;
    left: number;
    top: number;
    width: number;
    height: number;
}

const Sticky: React.FC<{ note: StickyNote }> = ({ note }) => {
    const { user, userData } = useUser();

    function touchstart(e: React.MouseEvent<HTMLDivElement>) {
        console.log("touchstart")
        e.preventDefault();
    }
    function touchmove(e: React.MouseEvent<HTMLDivElement>) {
        console.log("touchmove")
        e.preventDefault();
        e.currentTarget.style.left = `${e.clientX}px`;
        e.currentTarget.style.top = `${e.clientY}px`;
    }
    function touchend(e: React.MouseEvent<HTMLDivElement>) {
        console.log("touchend")
        e.preventDefault();
    }

    return (
        <div
            id={note.idd}
            style={{
                
                backgroundColor: note.color,
                position: "absolute",
                left: note.left,
                top: note.top,
                width: note.width,
                height: note.height,
            }}
            onMouseDown = {(e) => { touchstart(e) }}
            onMouseMove = {(e) => { touchmove(e)}}
            onMouseUp = {(e) => { touchend(e) }}

            className="sticky-note">

            <p style={{fontSize:"10%"}}>
                {note.content}
            </p>
            
        </div>
    );
};

export default Sticky;