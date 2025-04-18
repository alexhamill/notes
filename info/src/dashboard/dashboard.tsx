import React from "react";
import { useUser } from "../base/UserContext.tsx";
// import { db } from "../base/firebase";
import Head from "../components/head.tsx";
import "./dash.css"
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";
const Dashboard: React.FC = () => {
  const { userData } = useUser();
  const auth = getAuth();
  const useruid = auth?.currentUser?.uid;
  console.log(useruid);
  return (
    <div>   
        <Head message={`Welcome ${userData?.firstname} ${userData?.lastname} `} />
        <Link to="/notes/todo">
          <button className="todo-button">Go to TODO</button>
        </Link>
        <Link to="/notes/Whiteboard">

          <button className="todo-button">Go to Whiteboard</button>
        </Link>
    </div>
  );
};

export default Dashboard;