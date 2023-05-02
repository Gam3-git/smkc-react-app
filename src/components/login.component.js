import React, { useState } from 'react'
import { useNavigate  } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Icon from 'react-bootstrap-icons';
import LoginID from "./subcomponents/loginid.component";
import ResetPass from "./subcomponents/resetpass.component";

import AuthService from "../services/auth.service";

const Login = () => {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetpass, setResetpass] = useState(false);
  const [loginid, setLoginid] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();

  const handleLogin = (data) => {
    console.log(errors);
    setMessage("");
    setLoading(true);

    AuthService.login ( data.Username, data.Password )
    .then( () => {  
      navigate("/");
      window.location.reload();
    }, error => {
        const resMessage =
        (error.response && error.response.data &&
        error.response.data.message) || error.message || error.toString();

        setMessage(resMessage);
        setLoading(false);
    });
  }

  const OpenResetPass = () =>{ setResetpass(!resetpass); }
  const OpenLoginId = () =>{ setLoginid(!loginid); }

  return (
    <div className='row'>

        <div className='col-md-4'></div>

        <div className='col-md-4'>
        <div className="card mt-5">
        <div className="card-body">
            <p className="text-center"><Icon.LayersFill color="goldenrod" size={50}  /></p> 
            <p className="text-center">LOG IN</p> 
            <form onSubmit={handleSubmit(handleLogin)}>

            <div className="form-group">
            <label htmlFor="Username">Username (ชื่อผู้ใช้)</label>
                { errors.Username && <span className ="text-danger"> กรุณาระบุไม่เกิน 20 ตัวอักษร </span> }
            <input type="text" className="form-control" name="Username"  
                {...register("Username", {required: true, maxLength: 20})} />
            <br />
            <label htmlFor="Password" >Password (รหัสผ่าน)</label>
                {errors.Password && <span className ="text-danger"> กรุณาระบุไม่เกิน 20 ตัวอักษร </span>}
            <input type="password" className="form-control" name="Password" 
                {...register("Password", {required: true, maxLength: 20})} />

            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" name="ChkPerId" onChange={OpenLoginId} />
            <label className="form-check-label" htmlFor="ChkPerId"> เข้าระบบด้วยเลขบัตรประชาชน </label>
            </div>
            
            <div className="form-check form-switch">
            <input className="form-check-input" type="checkbox" role="switch" name="ResetPass" onChange= {OpenResetPass} />
            <label className="form-check-label" htmlFor="ResetPass"> Reset รหัสผ่าน </label>
            </div>

            <a href="#/" onClick={()=>{ navigate("/register"); }} > สมัครสมาชิก </a>



            <button className="form-control btn btn-primary mt-3" type="submit">
                { loading && ( <span className="spinner-border spinner-border-sm"></span> )}
             เข้าสู่ระบบ </button>
                    
            </div>
            
            { message && ( 
                <>
                <div className="form-group mt-2">
                <div className = "alert alert-danger" role="alert">
                    { message }
                    </div>
                </div>
                </>
            )}
            </form>
        </div>
        </div>
        </div>
        <div className='col-md-4'>
        { loginid ? (  <LoginID /> ) : null }
        { resetpass ? (  <ResetPass /> ) : null }
        </div>
       
    </div>
  );
}

export default Login