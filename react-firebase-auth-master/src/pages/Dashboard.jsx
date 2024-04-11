import { getAuth } from "firebase/auth";


const auth = getAuth();
const user = auth.currentUser;

import '../styles/Dashboard.css'

export const Dashboard = () => {
  
  return (
    <div>
        <ul>
            <li>
                <h2>{user.displayName}</h2>
              
                </li>
        </ul>
    </div>
  );
};
