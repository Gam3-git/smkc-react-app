import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'

import Service from "../services/admin.service";

const EditUser = () => {  

  const navigate = useNavigate();
  const {state} = useLocation();

  const [userData, setUserData] = useState([]);
  const [userDataVS, setUserDataVS] = useState([]);
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState(true);
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
  
  useEffect(()=>{ 
    if(!state){  navigate('/'); 
    } else { 
      Service.getUserId(state.id).then((res) => { setUserData(res.data); });
      Service.getUserVS(state.id).then((res) => { setUserDataVS(res.data); });
    }
  },[ state, navigate ]);

  useEffect(()=>{
    setValue('IDUser', userData.id_user);
    setValue('PersonalId', userData.person_id);
    setValue('NameUser', userData.name_u);
    setValue('Position', userData.position);
    setValue('Department', userData.department);
    setValue('Orderposition', userData.order_position);
    setValue('Role', userData.role);
    setValue('Username', userData.user_n);
    setValue('PassOld', userData.pass_w);
    setValue('WorkStatus', userData.work_status);
  },[userData,setValue]);

  useEffect(()=>{
    if(typeof userDataVS === 'object' && userDataVS !== null ){
      setValue('IDVS', userDataVS.id_uvs);
      setValue('v31', userDataVS.year_vs);
      setValue('v32', userDataVS.type1_bn);
      setValue('v33', userDataVS.type1_bn + 10 );
      setValue('v34', userDataVS.type1_tn);
      setValue('v35', userDataVS.type2_tn);
      setValue('v36', userDataVS.type3_tn);
      setValue('v37', userDataVS.type4_tn);
      setValue('v38', userDataVS.late_total);;
      setValue('v39', userDataVS.last_type_p);
      setValue('v40', userDataVS.date_lb1);
      setValue('v41', userDataVS.date_lb2);
      setValue('v42', userDataVS.num_lb);
    }
  },[userDataVS,setValue]);



  const InputP = (props) => {

    return (
      <>
        <p className="text-center text-muted"> 
          User Edit : ID { props.user.id_user } </p> 
      </>
    );
  }

  const onSubmit = (data) => {

    if(data.PersonalId.length < 13) { 
      setSuccessful(false); 
      setMessage("ระบุเลขบัตรให้ครบ 13 หลัก"); 
      setTimeout( () => { setMessage(""); }, 3000 ); 
      return; }
      
      if(!data.Password){ data.Password = null; }

      Service.editUser( data.IDUser, data.PersonalId, data.NameUser, data.Position, data.Department, 
        data.Orderposition, data.Role, data.Username, data.Password, data.WorkStatus, data.PassOld)
      .then( response => {

        setMessage(response.data.message);
        setSuccessful(true);  
        setTimeout( () => { navigate(-1); }, 2500);
        
      }, error => {

          const resMessage = (error.response && error.response.data &&
          error.response.data.message) || error.message || error.toString();

          setMessage(resMessage);
          setSuccessful(false);

      }); 
  }



  const onSubmit2 = () => {
    const data = getValues();
    Service.editUserVS(data).then(res => {
      Swal.fire( `สำเร็จ : ${res.data.message}`, '', 'success' );
    }).catch(err => { 
      console.log(err.response.data.message);
      Swal.fire(err.response.data.message,'','error');
    });
  }

    return (

    <div className='row'>
    
        <div className='col-md-2'></div>
        <div className='col-md-8 my-1'>
        <div className="card mt-5">
        <div className="card-body">
        
        {userData &&  ( <InputP user = {userData} /> ) }
           
           { message && (
               <div className="form-group text-center mt-2">
               <div className = { successful ? "alert alert-success" : "alert alert-danger" } role="alert">
                   { message }
               </div>
               </div>
           )}

           <form onSubmit={handleSubmit(onSubmit)}>
           <div className="form-group">
           <div className='row'>

           <div className='col-md-6'>
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

            <input type="hidden" name="IDUser" {...register("IDUser")}/>      
            <input type="hidden" name="PassOld" {...register("PassOld")}/>

            </div>

            <div className='col-md-6'>

            <label htmlFor="Orderposition">ลำดับอาวุโส</label>
            { errors.Orderposition && <span className ="text-danger"> กรุณาระบุ </span> }
            <input type="number" className="form-control" name="Orderposition"  
                {...register("Orderposition", { required: true })} />

            <label htmlFor="Role">Role</label>
            {errors.Role && <span className ="text-danger"> กรุณาระบุ </span>}
            <select className="form-select" name="Role" {...register("Role", { required: true })} >
                <option value={1} >Admin</option>
                <option value={2}>User</option>
                <option value={3}>Oper</option>
              </select>
            
            <label htmlFor="Username">Username</label>
            { errors.Username && <span className ="text-danger"> กรุณาระบุ </span> }
            <input type="text" className="form-control" name="Username"  
                {...register("Username", {required: true})} />

            <label htmlFor="Password">Password (ระบุกรณีเปลี่ยนรหัส)</label>
            <input type="text" className="form-control" name="Password"  
                {...register("Password")} />

            <label htmlFor="WorkStatus"> สถานะการทำงาน </label>
            {errors.WorkStatus && <span className ="text-danger"> กรุณาระบุ </span>}
            <select className="form-select" name="WorkStatus" {...register("WorkStatus", { required: true })} >
                <option value={0}> ไม่ใช้งาน </option>
                <option value={1}> ใช้งาน </option>
              </select>

            </div>

            </div>
            </div>
                <button className="form-control btn btn-warning mt-2" type="submit"> แก้ไขข้อมูลผู้ใช้ </button>
            </form>
            
    
    </div>
    </div>
        </div>
        <div className='col-md-2'></div>

        <div className='col-md-2'></div>
        <div className='col-md-8 my-1'>
        
          <div className="form-group">
              <div className="card">
              <div className="card-header bg-dark text-light text-center"> ตั้งค่าวันลาพักผ่อน ลาป่วย, ลากิจส่วนตัว, ลาคลอดบุตร </div>
              <div className="card-body bg-light">
                  <div className='row justify-content-center'>
                  <div className='col-3'>
                          <input type="hidden" name="IDVS" {...register("IDVS")}/> 
                          <label htmlFor="v31">- ปีงบประมาณ -</label>
                          <input type="text" className="form-control" name="v31" disabled
                              {...register("v31")} />
                          <label htmlFor="v32">วันลาพักผ่อนสะสม</label>
                          <input type="text" className="form-control text-danger" name="v32" 
                              {...register("v32")} />
                          <label htmlFor="v33">วันลาพักผ่อนทั้งหมดปีนี้</label>
                          <input type="text" className="form-control" name="v33" disabled
                              {...register("v33")} />
                          <label htmlFor="v34">ลาพักผ่อนไปแล้ว (วัน)</label>
                          <input type="text" className="form-control" name="v34"
                              {...register("v34")} />
                      </div>
                      <div className='col-4'>
                          <label htmlFor="v35">ลาป่วยไปแล้ว (วัน) </label>
                          <input type="text" className="form-control" name="v35"  
                              {...register("v35")}  />
                          <label htmlFor="v36">ลากิจไปแล้ว (วัน)</label>
                          <input type="text" className="form-control" name="v36"  
                              {...register("v36")}  />
                          <label htmlFor="v37">ลาคลอดไปแล้ว (วัน)</label>
                          <input type="text" className="form-control" name="v37"
                              {...register("v37")} />
                          <label htmlFor="v38">สายไปแล้ว (ครั้ง)</label>
                          <input type="text" className="form-control" name="v38"
                                  {...register("v38")} />
                          <button className="form-control btn btn-dark mt-4" type="button"
                            onClick={ () => onSubmit2() }
                          >ปรับปรุงข้อมูล</button>
                      </div>

                      <div className='col-4'>
                      <label htmlFor="v39">1) ประเภทการลาครั้งก่อน </label>
                          <select className="form-select" {...register("v39")} >
                              <option value="2">ลาป่วย</option>
                              <option value="3">ลากิจ</option>
                              <option value="4">ลาคลอด</option>
                          </select>
                          <label htmlFor="v40">2) ตั้งแต่วันที่ (YYYY-MM-DD)</label>
                          <input type="text" className="form-control" name="v40"  
                          {...register("v40")} />
                          <label htmlFor="v41">3) ถึงวันที่ (YYYY-MM-DD)</label>
                          <input type="text" className="form-control" name="v41" 
                          {...register("v41")} />                         
                          <label htmlFor="v42">4) มีกำหนด (วัน)</label>
                          <input  type="text" className="form-control" name="v42"
                              {...register("v42")} />
                      </div>
                      
                  </div>
                  </div>
              </div>
          </div>
        

        </div>
    </div>


  );
}

export default EditUser;