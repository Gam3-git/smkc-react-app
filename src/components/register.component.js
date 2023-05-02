import React, { useState } from 'react'
// import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as Icon from 'react-bootstrap-icons';

import AuthService from "../services/auth.service";

const Register = () => {

  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(true);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  const onSubmit = (data) => {
    if(data.PersonalId.length < 13) { setSuccessful(false); setMessage("ระบุเลขบัตรให้ครบ 13 หลัก"); return; }
      AuthService.register
      ( data.PersonalId, data.NameUser, data.Position, data.Department, data.Username, data.Password )
      .then( response => {
        setMessage(response.data.message);
        setSuccessful(true);
        reset({ PersonalId: '', NameUser:'', Position:'', Department:'', Username:'', Password:'' });
        setTimeout(function() { setMessage(""); }, 3000);  
      }, error => {
          const resMessage =
          (error.response && error.response.data &&
          error.response.data.message) || error.message || error.toString();

          setMessage(resMessage);
          setSuccessful(false);
      });
  }

  return (
    <div className='row'>

    <div className='col-md-4'></div>

        <div className='col-md-4'>
        <div className="card mt-5">
        <div className="card-body">

            <p className="text-center"><Icon.PersonPlusFill color="DodgerBlue" size={50}  /></p> 
            <p className="text-center text-muted">ลงทะเบียนผู้ใช้ไหม่</p> 
            { message && (
                <div className="form-group mt-2">
                <div className = { successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                    { message }
                    {/* { successful ? <Navigate to={'/'} />  : null } */}
                </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">

            <label htmlFor="PersonalId">หมายเลขบัตรประชาชน</label>
            { errors.PersonalId && <span className ="text-danger"> กรุณาระบุ ไม่เกิน 13 หลัก </span> }
            <input type="text" className="form-control" name="PersonalId"  
                {...register("PersonalId", {required: true, maxLength: 13})} />

            <label htmlFor="NameUser">คำนำหน้า ชื่อ-นามสกุล</label>
            { errors.NameUser && <span className ="text-danger"> กรุณาระบุ </span> }
            <input type="text" className="form-control" name="NameUser"  
                {...register("NameUser", {required: true, maxLength: 100})} />

            <label htmlFor="Position">ตำแหน่ง</label>
            { errors.Position && <span className ="text-danger"> กรุณาระบุ </span> }
            <input type="text" className="form-control" name="Position"  
                {...register("Position", {required: true, maxLength: 200})} />

            <label htmlFor="Department">แผนก / ส่วน</label>
            { errors.Department && <span className ="text-danger"> กรุณาระบุ </span> }
            <input type="text" className="form-control" name="Department"  
                {...register("Department", {required: true, maxLength: 200})} />

            <label htmlFor="Username">Username (ชื่อผู้ใช้)</label>
            { errors.Username && <span className ="text-danger"> กรุณาระบุ </span> }
            <input type="text" className="form-control" name="Username"  
                {...register("Username", {required: true, maxLength: 20})} />

            <label htmlFor="Password">Password (รหัสผ่าน)</label>
            {errors.Password && <span className ="text-danger"> กรุณาระบุ </span>}
            <input type="text" className="form-control" name="Password" 
                {...register("Password", {required: true, maxLength: 20})} />

            <button className="form-control btn btn-primary mt-2" type="submit">ลงทะเบียนผู้ใช้</button>

            </div>
            </form>
    
    </div></div></div>

    </div>
  );

}

export default Register
