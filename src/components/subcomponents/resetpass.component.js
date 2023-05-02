import React, { useState } from 'react'
// import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Icon from 'react-bootstrap-icons';

import AuthService from "../../../src/services/auth.service";

const ResetPass = () => {

  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  const onSubmit = (data) => {

      AuthService.resetpass
      ( data.PersonalId, data.Username, data.Password )
      .then( response => {
        setMessage(response.data.message);
        setSuccessful(true);
        reset({ PersonalId: '', Username:'', Password:'' });
        setTimeout(function() { setMessage(""); window.location.reload(); }, 1500);  
      }, error => {
          const resMessage =
          (error.response && error.response.data &&
          error.response.data.message) || error.message || error.toString();

          setMessage(resMessage);
          setSuccessful(false);
      });
  }

  return (

        <div className="card mt-5">
        <div className="card-body">

            <p className='text-center'><Icon.ExclamationTriangleFill color="red" size={50}  /></p> 
            <p className='text-muted text-center'> ระบุ 13 หลัก และระบุ UserName และ Password ใหม่</p> 

            { message && (
                <div className="form-group mt-2">
                <div className = { successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                    { message }
                </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">

            <label htmlFor="PersonalId">หมายเลขบัตรประชาชน</label>
            { errors.PersonalId && <span className ="text-danger"> กรุณาระบุ ไม่เกิน 13 หลัก </span> }
            <input type="text" className="form-control" name="PersonalId"  
                {...register("PersonalId", {required: true, maxLength: 13})} />

            <label htmlFor="Username">Username (ชื่อผู้ใช้)</label>
            { errors.Username && <span className ="text-danger"> กรุณาระบุ </span> }
            <input type="text" className="form-control" name="Username"  
                {...register("Username", {required: true, maxLength: 20})} />

            <label htmlFor="Password">Password (รหัสผ่าน)</label>
            {errors.Password && <span className ="text-danger"> กรุณาระบุ </span>}
            <input type="text" className="form-control" name="Password" 
                {...register("Password", {required: true, maxLength: 20})} />

            <button className="form-control btn btn-danger mt-2" type="submit">Reset</button>

            </div>
            </form>
    
    </div></div>
    
  );

}

export default ResetPass
