import React from "react";
import { useUser } from "../base/UserContext.tsx";
import { db } from "../base/firebase";

const Dashboard: React.FC = () => {
  const { user, userData } = useUser();
  return (
    <div>
        <h1>Welcome {userData?.name}</h1>
    </div>
  );
};

export default Dashboard;