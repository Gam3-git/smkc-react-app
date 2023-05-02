import React, { useState } from 'react'
import { useNavigate  } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Icon from 'react-bootstrap-icons';

import AuthService from "../../../src/services/auth.service";

const LoginID = () => {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();    

  const handleLoginID = (data) => {

    if(data.PersonID.length < 13) { setMessage("ระบุเลขบัตรให้ครบ 13 หลัก"); return; }

    console.log(errors);
    setMessage("");
    setLoading(true);

    AuthService.login_id ( data.PersonID )
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

  return (
        <div className="card mt-5">
        <div className="card-body">
            <p className="text-center"><Icon.PersonFill color="ForestGreen" size={50}  /></p>
            <p className='text-muted text-center'> Personal ID</p>  

            <form onSubmit={handleSubmit(handleLoginID)}>

            <div className="form-group">
            <label htmlFor="PersonID">หมายเลขบัตรประชาชน</label>
                { errors.PersonID && <span className ="text-danger"> กรุณาระบุไม่เกิน 13 ตัวอักษร </span> }
            <input type="text" className="form-control" name="PersonID"  
                {...register("PersonID", {required: true, maxLength: 13})} />

            <button className="form-control btn btn-success mt-3" type="submit">
                { loading && ( <span className="spinner-border spinner-border-sm"></span> )}
            เข้าสู่ระบบด้วย 13 หลัก </button>
                    
            </div>
            
            { message && (
                <div className="form-group mt-2">
                <div className = "alert alert-danger" role="alert">
                    { message }
                    </div>
                </div>
            )}
            
            </form>
        </div>
        </div>

  );
}

export default LoginID