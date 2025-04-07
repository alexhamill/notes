import React from "react";
import { useUser } from "../base/UserContext.tsx";


const TODO: React.FC = () => {
    const { user, userData } = useUser();
    console.log(user);
    console.log(userData);
    return (
        <div>

        </div>

    );
}

export default TODO;