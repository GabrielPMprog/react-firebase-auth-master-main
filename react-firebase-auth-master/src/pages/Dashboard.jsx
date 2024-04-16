import { getAuth } from "firebase/auth";


const auth = getAuth();
const user = auth.currentUser;

import '../styles/Dashboard.css'

export const Dashboard = () => {
  
  return (
    <div>
        <ul>
            <li>
                <h2>Adm Login</h2>
              
                </li>
        </ul>
    </div>
  );
};
