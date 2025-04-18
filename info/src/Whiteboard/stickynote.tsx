import React, { useEffect, useState } from "react";
import { docRef, useUser, getDocData, useruid, createdoc, nestedcol, nesteddoc} from "../base/UserContext.tsx";
import { auth, db } from "../base/firebase";
import { collection, doc, getDoc, addDoc, Timestamp, updateDoc } from "firebase/firestore";
import "./sticky.css"

interface StickyNote {
    content: string;
    color: string;
    left: number;
    top: number;
    width: number;
    height: number;
}

const Sticky: React.FC<{ note: StickyNote, idd: string }> = ({ note, idd }) => {
    const { user, userData } = useUser();
    var xsize = 0;
    var ysize = 0;
    

    function touchstart(e: React.MouseEvent<HTMLDivElement>) {
        xsize = parseFloat(e.currentTarget.style.height.replace("px", "")) / 2;
        ysize = parseFloat(e.currentTarget.style.width.replace("px", "")) / 2;
        e.currentTarget.style.zIndex = "1000";
        e.preventDefault();
    }
    function touchmove(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        const isMouseDown = e.buttons === 1;
        if (isMouseDown) {
            (e.currentTarget as HTMLDivElement).style.left = `${e.clientX - 50}px`;
            (e.currentTarget as HTMLDivElement).style.top = `${e.clientY - 50}px`;
        }
        
    }

    function touchend(e: React.MouseEvent<HTMLDivElement>) {
        e.currentTarget.style.zIndex = "1";
        e.preventDefault();
        const ref = nesteddoc("Sticky-notes", e.currentTarget.id);
        console.log(e.currentTarget.id)
        updateDoc(ref, { left: e.currentTarget.style.left, top: e.currentTarget.style.top });
    }


    return (
        <div
            id={idd}
            style={{
                
                backgroundColor: note.color,
                position: "absolute",
                left: note.left,
                top: note.top,
                width: note.width,
                height: note.height,
                // transition: "left 0.02s, top 0.02s",
            }}
            onMouseDown = {(e) => { touchstart(e) }}
            onMouseMove = {(e) => { touchmove(e)}}
            onMouseUp = {(e) => { touchend(e) }}
            onMouseLeave={(e => { touchend(e) })}

            className="sticky-note">

            <p style={{fontSize:"100%"}}>
                {note.content}
            </p>
            
        </div>
    );
};

export default Sticky;