import React, { useEffect, useState, useRef } from "react";
import { docRef, useUser, getDocData, useruid, createdoc, nestedcol, nesteddoc} from "../base/UserContext.tsx";
import { auth, db } from "../base/firebase";
import { collection, doc, getDoc, addDoc, Timestamp, updateDoc, onSnapshot, query, where, DocumentData, QuerySnapshot } from "firebase/firestore";
import Head from "../components/head.tsx";
import Sticky from "./stickynote.tsx";

const CANVAS_PRESETS = [
    { name: "Small", width: 5000, height: 5000 },
    { name: "Medium", width: 10000, height: 10000 },
    { name: "Large", width: 20000, height: 20000 },
];

const Whiteboard: React.FC = () => {
    const [Stickynotes, setStickynotes] = React.useState<any[]>([]);
    const { user, userData } = useUser();
    
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [showSizeSettings, setShowSizeSettings] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 10000, height: 10000 });
    const [customSize, setCustomSize] = useState({ width: 10000, height: 10000 });
    const isDragging = useRef(false);
    const lastPosition = useRef({ x: 0, y: 0 });
    
    useEffect(() => {
        if (!user) return;

        // Set up real-time listener on the nested collection
        const notesCollection = collection(db, "users", useruid() || "", "Sticky-notes");
        const unsubscribe = onSnapshot(notesCollection, (snapshot: QuerySnapshot<DocumentData>) => {
            const notes = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setStickynotes(notes);
        });

        return () => unsubscribe();
    }, [user]);

    async function addnote(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        
        const canvasRect = document.querySelector('.whiteboard-canvas')?.getBoundingClientRect();
        if (!canvasRect) return;
        
        const x = (window.innerWidth / 2 - position.x) / zoom;
        const y = (window.innerHeight / 2 - position.y) / zoom;
        
        try {
            const notesCollection = nestedcol("Sticky-notes");
            const docRef = await addDoc(notesCollection, { 
                useruid: useruid(), 
                content: "", 
                top: `${y}px`, 
                left: `${x}px`, 
                width: "200px", 
                height: "200px", 
                color: "#feff9c",
                createdAt: Timestamp.now(),
                textcolor: "#000000",
                Fontsize: "1rem"
                        });
            
            // Note will be added automatically through the snapshot listener
        } catch (error) {
            console.error("Error adding note:", error);
        }
    }

    const handleZoom = (delta: number) => {
        setZoom(prev => Math.min(Math.max(.3, prev + delta), 2));
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            isDragging.current = true;
            lastPosition.current = { x: e.clientX, y: e.clientY };
            e.currentTarget.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging.current) {
            const deltaX = e.clientX - lastPosition.current.x;
            const deltaY = e.clientY - lastPosition.current.y;
            
            setPosition(prev => ({
                x: prev.x + deltaX,
                y: prev.y + deltaY
            }));
            
            lastPosition.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    const handleSizeChange = (width: number, height: number) => {
        setCanvasSize({ width, height });
        setShowSizeSettings(false);
    };

    const handleCustomSizeChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const width = Math.min(Math.max(1000, customSize.width), 50000);
        const height = Math.min(Math.max(1000, customSize.height), 50000);
        handleSizeChange(width, height);
    };

    return(
        <div 
            className="whiteboard-container"
            style={{
                width: '100vw',
                height: 'calc(100vh - 50px)',
                overflow: 'hidden',
                position: 'relative',
                backgroundColor: '#404040',
                marginTop: '50px'
            }}
        >
            <div 
                style={{
                    position: 'fixed',
                    top: '70px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    zIndex: 1000
                }}
            >
                <button
                    onClick={addnote}
                    style={{
                        backgroundColor: 'grey',
                        color: 'black',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <i className="bi bi-plus-lg"></i>
                    New Note
                </button>
                <div style={{
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                    backgroundColor: 'grey',
                    borderRadius: '4px',
                    padding: '4px'
                }}>
                    <button
                        onClick={() => handleZoom(-0.1)}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'black',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        <i className="bi bi-zoom-out"></i>
                    </button>
                    <span style={{ color: '#ffffff', padding: '0 8px' }}>
                        {Math.round(zoom * 100)}%
                    </span>
                    <button
                        onClick={() => handleZoom(0.1)}
                        style={{
                            backgroundColor: 'transparent',
                            color: 'black',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        <i className="bi bi-zoom-in"></i>
                    </button>
                </div>
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowSizeSettings(!showSizeSettings)}
                        style={{
                            backgroundColor: 'grey',
                            color: 'black',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}
                    >
                        <i className="bi bi-arrows-angle-expand"></i>
                        Canvas Size
                    </button>
                    {showSizeSettings && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0',
                                marginTop: '8px',
                                backgroundColor: '#404040',
                                padding: '16px',
                                borderRadius: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                minWidth: '200px'
                            }}
                        >
                            <div style={{ marginBottom: '12px', color: '#ffffff' }}>Presets:</div>
                            {CANVAS_PRESETS.map(preset => (
                                <button
                                    key={preset.name}
                                    onClick={() => handleSizeChange(preset.width, preset.height)}
                                    style={{
                                        backgroundColor: canvasSize.width === preset.width ? 'grey' : 'transparent',
                                        color: '#ffffff',
                                        border: '2px solid black',
                                        padding: '8px',
                                        width: '100%',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        marginBottom: '4px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {preset.name} ({preset.width}x{preset.height})
                                </button>
                            ))}
                            <div style={{ marginTop: '12px', marginBottom: '8px', color: '#ffffff' }}>Custom Size:</div>
                            <form onSubmit={handleCustomSizeChange} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <input
                                    type="number"
                                    value={customSize.width}
                                    onChange={(e) => setCustomSize(prev => ({ ...prev, width: parseInt(e.target.value) || 1000 }))}
                                    min="1000"
                                    max="50000"
                                    style={{
                                        backgroundColor: 'grey',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '4px'
                                    }}
                                    placeholder="Width (1000-50000)"
                                />
                                <input
                                    type="number"
                                    value={customSize.height}
                                    onChange={(e) => setCustomSize(prev => ({ ...prev, height: parseInt(e.target.value) || 1000 }))}
                                    min="1000"
                                    max="50000"
                                    style={{
                                        backgroundColor: 'grey',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '4px'
                                    }}
                                    placeholder="Height (1000-50000)"
                                />
                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: 'grey',
                                        color: '#ffffff',
                                        border: 'none',
                                        padding: '8px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginTop: '4px'
                                    }}
                                >
                                    Apply Custom Size
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            <div 
                className="whiteboard-canvas"
                style={{
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    width: `${canvasSize.width}px`,
                    height: `${canvasSize.height}px`,
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    cursor: isDragging.current ? 'grabbing' : 'grab',
                    backgroundColor: '#f8f8f8',
                    backgroundImage: `
                        linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {Stickynotes.map((note) => (
                    <Sticky
                        key={note.id}
                        note={note}
                        idd={note.id}
                    />
                ))}
            </div>
        </div>
    );
}

export default Whiteboard;