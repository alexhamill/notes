import React, { useEffect, useState, useRef  } from "react";
import { docRef, useUser, getDocData, useruid, createdoc, nestedcol, nesteddoc} from "../base/UserContext.tsx";
import { auth, db } from "../base/firebase";
import { collection, doc, getDoc, addDoc, Timestamp, updateDoc } from "firebase/firestore";
import "./sticky.css"
import 'bootstrap-icons/font/bootstrap-icons.css';


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
    const x = useRef(0);
    const y = useRef(0);

    

    function touchstart(e: React.MouseEvent<HTMLDivElement>) {
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
    function expandstart(e: React.MouseEvent<HTMLDivElement>) {
        x.current = e.clientX;
        y.current = e.clientY;
        const parent = e.currentTarget.parentElement;
        if (parent) {
            parent.style.zIndex = "1000"
        }
        e.preventDefault();
    }
    function expandmove(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        const isMouseDown = e.buttons === 1;
        if (isMouseDown) {
            const parent = (e.currentTarget as HTMLDivElement).parentElement;
            const rect = parent?.getBoundingClientRect();
            if (parent && rect) {
                const dy = e.clientY - y.current;
                const dx = e.clientX - x.current;
                const currentHeight = parseFloat(parent.style.height) || 0;
                const currentWidth = parseFloat(parent.style.width) || 0;
                parent.style.height = `${currentHeight + dy}px`;
                parent.style.width = `${currentWidth + dx}px`;
            }
            x.current = e.clientX;
            y.current = e.clientY;
        }
        
    }

    function expandend(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        x.current = 0;
        y.current = 0;
        const parent = e.currentTarget.parentElement;
        if (parent) {
            parent.style.zIndex = "1"
        const ref = nesteddoc("Sticky-notes", parent.id);
        console.log(parent.id)
        updateDoc(ref, { width: parent.style.width, height: parent.style.height });
        }
    }
    useEffect(() => {
        const inputElement = document.getElementById(`input${idd}`);
        if (inputElement) {
            inputElement.textContent = note.content;
        }
    }, []);
    function savecontent(e: React.ChangeEvent<HTMLParagraphElement>) {
        const inputElement = document.getElementById(`input${idd}`);
        if (inputElement) {
            const ref = nesteddoc("Sticky-notes", idd);
            updateDoc(ref, { content: inputElement.textContent });
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
                ><i className="bi bi-arrows-move"></i></div>
                <div className="stickynote-expander"
                    onMouseDown = {(e) => { expandstart(e) }}
                    onMouseMove = {(e) => { expandmove(e)}}
                    onMouseUp = {(e) => { expandend(e) }}
                    onMouseLeave={(e => { expandend(e) })}
                ><i className="bi bi-arrows-angle-expand"></i></div>
                <p 
                    contentEditable 
                    className="imput" 
                    onInput={(e) => savecontent(e as unknown as React.ChangeEvent<HTMLParagraphElement>)} 
                    id={`input${idd}`} 
                    style={{fontSize:"100%", width:"100%", height:"100%", overflow:"hidden", margin:"0px"}}
                >
                </p>
            
        </div>
    );
};

export default Sticky;