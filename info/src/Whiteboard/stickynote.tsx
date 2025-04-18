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
    // var xsize = 0;
    // var ysize = 0;
    

    function touchstart(e: React.MouseEvent<HTMLDivElement>) {
        // xsize = parseFloat(e.currentTarget.style.height.replace("px", "")) / 2;
        // ysize = parseFloat(e.currentTarget.style.width.replace("px", "")) / 2;
        const parent = e.currentTarget.parentElement;
        if (parent) {
            parent.style.zIndex = "1000"
        }
        e.preventDefault();
    }
    function touchmove(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        const isMouseDown = e.buttons === 1;
        if (isMouseDown) {
            const parent = (e.currentTarget as HTMLDivElement).parentElement;
            if (parent) {
                parent.style.top = `${e.clientY - 10}px`;
                parent.style.left = `${e.clientX - 10}px`;
            }
        }
        
    }

    function touchend(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        const parent = e.currentTarget.parentElement;
        if (parent) {
            parent.style.zIndex = "1"
        const ref = nesteddoc("Sticky-notes", parent.id);
        console.log(parent.id)
        updateDoc(ref, { left: parent.style.left, top: parent.style.top });
        }
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
            className="sticky-note">

                <div className="sticknote-mover" 
                    onMouseDown = {(e) => { touchstart(e) }}
                    onMouseMove = {(e) => { touchmove(e)}}
                    onMouseUp = {(e) => { touchend(e) }}
                    onMouseLeave={(e => { touchend(e) })}
                ></div>
                <div className="stickynote-expander"></div>
                <p style={{fontSize:"100%"}}>
                {note.content}
                </p>
            
        </div>
    );
};

export default Sticky;