import React from "react";
import { useUser } from "../base/UserContext.tsx";
import { db } from "../base/firebase";
import Head from "../components/head.tsx";
import "./dash.css"

const Dashboard: React.FC = () => {
  const { user, userData } = useUser();
  return (
    <div>   
        <Head message={`Welcome ${userData?.name}`} />
        
    </div>
  );
};

export default Dashboard;