import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ChkUser } from "../services/chkuser.service";

const Profile = () =>  {

  const [userData, setUserData] = useState([]);
  const [userReady, setUserReady] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = ChkUser();
    if(user){
      setUserData(user);
      setUserReady(true); 
    } else {
      setUserData({});
      setUserReady(false);
      navigate('/login');
    }

  }, [navigate]);

  return (
    <>
    <div className="App-header">
    
      { userReady ?  
              <>
              <p> Id:{" "} {userData.id}  Profile : {userData.name} </p>
              <p> ตำแหน่ง :{" "} {userData.position} </p>
              <p> แผนก/ส่วน :{" "} {userData.department} </p>
              <p> Token:{" "}
                { userData.accessToken.substring(0, 20)} ...{" "}
                { userData.accessToken.substr(userData.accessToken.length - 20)}
              </p>             
              <p> Role :{" "} {userData.roles} </p>
              </>
            
      : <p> NULL </p>  
      }  
    </div> 
    </>
  );
}

export default Profile;