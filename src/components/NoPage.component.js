import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import AuthService from "../services/auth.service";

const NoPage = () => {  

  const navigate = useNavigate();
  const logout = () => {
    AuthService.logout();
    navigate("/");
    window.location.reload();
  }


    return (
    <div className="App-header">
    <p> 404 PAGE NOT FOUND </p>
      <Link to="/">
        <button className="btn btn-secondary btn-lg" onClick={logout}> Home </button>
      </Link>
    </div>
  );
}

export default NoPage;