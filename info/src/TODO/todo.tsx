import React, { useEffect, useState } from "react";
import { docRef, useUser, getDocData, useruid, createdoc, nestedcol, nesteddoc} from "../base/UserContext.tsx";
import { auth, db } from "../base/firebase";
import { collection, doc, getDoc, addDoc, Timestamp, updateDoc } from "firebase/firestore";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./todo.css";
import Head from "../components/head.tsx";



const TODO: React.FC = () => {
    const [events, setEvents] = React.useState<any[]>([]);
    const { user, userData } = useUser();
    const [rerender, setRender] = useState(false);
    const [date, setDate] = useState(new Date());
    
    useEffect(() => {
        
        if (!user) return;
            getDocData("Todo").then((data) => {
                setEvents(data.filter((event) => event.completed === false).sort((a, b) => {
                    const dateA = a.Date?.toDate().getTime() || 0;
                    const dateB = b.Date?.toDate().getTime() || 0;
                    return dateA - dateB;
                }));
            });
    }, );

    function adddoc(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const task = document.getElementById("addtask") as HTMLDivElement;
        task.classList.toggle("closed");
    }

    function create(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const createdoc = async () => {
            const docRef = await addDoc(nestedcol("Todo"), { useruid: useruid(), Task: (document.getElementById("name") as HTMLInputElement)?.value, Description: (document.getElementById("description") as HTMLInputElement)?.value, Date: Timestamp.fromDate(new Date((document.getElementById("date") as HTMLInputElement)?.value)), Share: (document.getElementById("share") as HTMLInputElement)?.value , completed: false }); 
            console.log("Document created with ID:", docRef.id);
          };
        
        createdoc();
        const task = document.getElementById("addtask") as HTMLDivElement;
        task.classList.toggle("closed");
    }

    function compleateevent(e: React.MouseEvent<HTMLDivElement>) {
        const idd = e.currentTarget.id;
        const element = document.getElementById(idd);
        console.log(1);
        if (element) {
            console.log(element);
            element.classList.toggle("completed");
        }
        const ref = nesteddoc("Todo", e.currentTarget.id);
        const card = events.find(event => event.id === e.currentTarget.id);
        if (card) {
            setTimeout(() => {
            updateDoc(ref, { completed: !card.completed });
            }, 500);
        }
    }

    function quickadd(e: React.KeyboardEvent<HTMLInputElement>) {
        const createdoc = async () => {
            const docRef = await addDoc(nestedcol("Todo"), { useruid: useruid(), Task: e.currentTarget.value , Description: "" , Date: Timestamp.fromDate(new Date()), Share: "" , completed: false }); 
            console.log("Document created with ID:", docRef.id);
          };
        createdoc();
        e.currentTarget.value = "";
    }

    return (
        <div id="todobody">
            
            <Head message="Todo" />
            <div className="outer-list-con">
                <div className="car">
                    <input type="text" id="newcard" placeholder="Quick Add Task" onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                quickadd(e);
                                }}}/>
                </div>
                    {events.map((card) => (
                        <div key={card.id} id={card.id} className="card" onClick={e => compleateevent(e)}>
                            <p>
                                <strong>{card.Task} </strong> 
                                {card.Description} 
                                {card.Date ? card.Date.toDate().toLocaleDateString() : ""} 
                                {card.Date ? ` (${Math.ceil((card.Date.toDate().getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left)` : ""}
                                {card.Share === "" ? "" : ` shared with: ${card.Share}`}
                            </p>
                        </div>
                    ))}
            </div>
            <div id="addtask" className="addtask closed">
            <button onClick={e => adddoc(e)} style={{padding:"2px", backgroundColor:"grey", position:"absolute"}}><strong>x</strong></button>
            <Head message="Add Task" />
                <form>
                    <label htmlFor="name">Task</label><br/>
                    <input className="input" id="name" type="text" placeholder="Add a task" /><br/>
                    <label htmlFor="description">Description</label><br/>
                    <input className="input" id="description" type="text" placeholder="Add a description" /><br/>
                    <label htmlFor="date">Date</label><br/>
                    <input className="input" id="date" type="date" placeholder="Add a date" /><br/>
                    <label htmlFor="share">Share</label><br/>
                    <input className="input" id="share" type="email" placeholder="Add another person" /><br/>
                </form> 
                <button onClick={e => create(e)} style={{margin:"5px"}} >Create</button>
            </div>

            <button onClick={e => adddoc(e)} style={{backgroundColor: "lightblue"}}>+ new task</button>
        </div>
        
    );
};

export default TODO;