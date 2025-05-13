import React, { useEffect, useState, useRef  } from "react";
import { docRef, useUser, getDocData, useruid, createdoc, nestedcol, nesteddoc} from "../base/UserContext.tsx";
import { auth, db } from "../base/firebase";
import { collection, doc, getDoc, addDoc, Timestamp, updateDoc } from "firebase/firestore";
import "./sticky.css"
import 'bootstrap-icons/font/bootstrap-icons.css';

const COLORS = [
    { name: "Pink", value: "#ff7eb9" },
    { name: "Dark Pink", value: "#ff65a3" },
    { name: "Light Blue", value: "#7afcff" },
    { name: "Light Yellow", value: "#feff9c" },
    { name: "Yellow", value: "#fff740" }
];

interface StickyNote {
    content: string;
    color: string;
    left: number | string;
    top: number | string;
    width: number | string;
    height: number | string;
    textColor: string;
    Fontsize: number;
}

interface StickyProps {
    note: StickyNote;
    idd: string;
}

const Sticky: React.FC<StickyProps> = ({ note, idd }) => {
    const { user, userData } = useUser();
    const noteRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const isResizing = useRef(false);
    const startPos = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });
    const initialSize = useRef({ width: 0, height: 0 });
    const [showSettings, setShowSettings] = useState(false);
    const [currentColor, setCurrentColor] = useState(note.color || "#2d2d42");
    const [customColor, setCustomColor] = useState("#feff9c");

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const canvas = document.querySelector('.whiteboard-canvas');
            if (!canvas) return;
            
            // Get the current transform matrix of the canvas
            const transform = window.getComputedStyle(canvas).transform;
            const matrix = new DOMMatrix(transform);
            const scale = matrix.a; // This gives us the scale (zoom level)
            
            if (isDragging.current && noteRef.current) {
                const deltaX = (e.clientX - startPos.current.x) / scale;
                const deltaY = (e.clientY - startPos.current.y) / scale;
                
                const newX = initialPos.current.x + deltaX;
                const newY = initialPos.current.y + deltaY;
                
                noteRef.current.style.left = `${newX}px`;
                noteRef.current.style.top = `${newY}px`;
            }
            else if (isResizing.current && noteRef.current) {
                const deltaX = (e.clientX - startPos.current.x) / scale;
                const deltaY = (e.clientY - startPos.current.y) / scale;
                
                const newWidth = Math.max(200, initialSize.current.width + deltaX);
                const newHeight = Math.max(200, initialSize.current.height + deltaY);
                
                noteRef.current.style.width = `${newWidth}px`;
                noteRef.current.style.height = `${newHeight}px`;
            }
        };

        const handleMouseUp = () => {
            if (noteRef.current) {
                noteRef.current.style.zIndex = "1";
                
                const ref = nesteddoc("Sticky-notes", idd);
                if (isDragging.current) {
                    updateDoc(ref, { 
                        left: noteRef.current.style.left,
                        top: noteRef.current.style.top
                    });
                }
                else if (isResizing.current) {
                    updateDoc(ref, { 
                        width: noteRef.current.style.width,
                        height: noteRef.current.style.height
                    });
                }
            }
            isDragging.current = false;
            isResizing.current = false;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [idd]);

    const handleMoveStart = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        
        if (noteRef.current) {
            isDragging.current = true;
            noteRef.current.style.zIndex = "1000";
            
            startPos.current = { x: e.clientX, y: e.clientY };
            initialPos.current = {
                x: parseFloat(noteRef.current.style.left) || 0,
                y: parseFloat(noteRef.current.style.top) || 0
            };
        }
    };

    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        
        if (noteRef.current) {
            isResizing.current = true;
            noteRef.current.style.zIndex = "1000";
            
            startPos.current = { x: e.clientX, y: e.clientY };
            initialSize.current = {
                width: parseFloat(noteRef.current.style.width) || 200,
                height: parseFloat(noteRef.current.style.height) || 200
            };
        }
    };

    const handleColorChange = async (color: string) => {
        if (noteRef.current) {
            setCurrentColor(color);
            const ref = nesteddoc("Sticky-notes", idd);
            await updateDoc(ref, { color: color });
            setShowSettings(false);
        }
    };

    return (
        <div
            ref={noteRef}
            id={idd}
            style={{
                backgroundColor: currentColor,
                position: "absolute",
                left: note.left,
                top: note.top,
                width: note.width,
                height: note.height,
                minWidth: "200px",
                minHeight: "200px",
                boxShadow: "0 3px 6px rgba(0,0,0,0.3)",
                borderRadius: "2px",
                color: typeof note.textColor === "string" ? note.textColor : "#000000",
                fontSize: note.Fontsize
            }}
            className="sticky-note"
        >
            <div 
                className="sticknote-mover" 
                onMouseDown={handleMoveStart}
            >
                <i className="bi bi-arrows-move"></i>
            </div>
            <div 
                className="stickynote-expander"
                onMouseDown={handleResizeStart}
            >
                <i className="bi bi-arrows-angle-expand"></i>
            </div>
            <div
                className="stickynote-settings"
                onClick={() => setShowSettings(!showSettings)}
            >
                <i className="bi bi-gear-fill" style={{ color: "#ffffff", fontSize: "1rem"}}></i>
            </div>
            {showSettings && (
                <div
                    className="stickynote-settings-menu"
                    style={{
                        position: "absolute",
                        top: "20px",
                        right: "-10px",
                        backgroundColor: "rgba(58, 58, 79, 0.95)",
                        borderRadius: "4px",
                        padding: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        zIndex: 3,
                        minWidth: "140px"
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <div style={{ marginBottom: "10px", color: "#ffffff", fontSize: "14px" }}>Presets:</div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", width: "120px", marginBottom: "16px" }}>
                        {COLORS.map(color => (
                            <div
                                key={color.value}
                                onClick={() => handleColorChange(color.value)}
                                style={{
                                    width: "25px",
                                    height: "25px",
                                    backgroundColor: color.value,
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    border: currentColor === color.value ? "2px solid #ffffff" : "none"
                                }}
                                title={color.name}
                            />
                        ))}
                    </div>
                    <div style={{ marginBottom: "8px", color: "#ffffff", fontSize: "14px" }}>Custom Color:</div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <input
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            style={{
                                width: "40px",
                                height: "40px",
                                padding: "0",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                backgroundColor: "transparent"
                            }}
                        />
                        <input
                            type="text"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            style={{
                                backgroundColor: "#3a3a4f",
                                color: "#ffffff",
                                border: "none",
                                padding: "8px",
                                borderRadius: "4px",
                                width: "80px",
                                fontSize: "14px"
                            }}
                            placeholder="#000000"
                        />
                    </div>
                    <button
                        onClick={() => handleColorChange(customColor)}
                        style={{
                            backgroundColor: "#3a3a4f",
                            color: "#ffffff",
                            border: "none",
                            padding: "8px",
                            borderRadius: "4px",
                            cursor: "pointer",
                            width: "100%",
                            marginTop: "8px",
                            fontSize: "14px"
                        }}
                    >
                        Apply Color
                    </button>
                </div>
            )}
            <div 
                contentEditable 
                className="imput" 
                style={{
                    fontSize: "100%",
                    width: "100%",
                    height: "calc(100% - 30px)",
                    overflow: "auto",
                    margin: "15px 0",
                    padding: "0 10px",
                    boxSizing: "border-box",
                    backgroundColor: "transparent",
                    textAlign: "center"
                }}
                onBlur={(e) => {
                    const ref = nesteddoc("Sticky-notes", idd);
                    updateDoc(ref, { content: e.currentTarget.innerText });
                }}
                // onMouseLeave={(e) => {
                //     const ref = nesteddoc("Sticky-notes", idd);
                //     updateDoc(ref, { content: e.currentTarget.innerText });
                // }}
            >
                {note.content}
            </div>
        </div>
    );
};

export default Sticky;