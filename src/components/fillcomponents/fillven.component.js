import { useState, useEffect  } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import Service from "../../../src/services/ven.service";
import { convertDate } from "../../../src/services/convert_text.service";
import { ChkUser} from "../../../src/services/chkuser.service";


const MySwal = withReactContent(Swal);

const Fill_ven = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue } = useForm();
    const [userlist, setUserlist] = useState([]);
    const [userData, setUserData] = useState({});

useEffect(() => {
    const user = ChkUser();
    if(user){
        Service.UserVen(user.user_n).then(res => {
            setUserData(res.data);
            // console.log(res.data);
        }).catch(err => {
            // console.log(err.response.data.message);
            setUserData({});
            // localStorage.removeItem("user");
            // navigate('/login');
            // window.location.reload();
        });
    } else {
        navigate('/home');
    }
}, [navigate]);

useEffect(()=>{
    Service.UserList().then( res => {
        setUserlist(res.data);
    }).catch( err => console.log(err.message));
},[]);


const onSubmit = (data) => {
    // console.log(data);
    MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    data.form_type = 4;
    Service.getReport_Word(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))

}


return (<>
    <div className='row justify-content-center mt-3 font-saraban'>
    <div className='text-center'>
            <h4>รายการ เวรนอกเวลา ประจำตัว </h4>
            <hr />
        <div className='row'>
            <div className='col-8'>
                <ListVen data={ userData } />
            </div>
            <div className='col-4 bg-light' style={{ visibility: 'hidden' }} >
                <br />
                <ListUser data={ userlist } />
            </div>
        </div>
        <hr />
    </div>
    </div>

    <form onSubmit={handleSubmit(onSubmit)} style={{ visibility: 'hidden' }}>
    <div className="form-group">
    <div className='row font-saraban'>
            <div className='col-1'></div>
            <div className='col-3'>

                <label htmlFor="Daybook">วันที่หนังสือแลกเวร</label>
                <input type="text" className="form-control text-danger" name="Daybook"  
                    {...register("Daybook")} />

                <label htmlFor="Redcase">คำสั่งเลขที่ </label>
                <input type="text" className="form-control" name="Redcase"  
                    {...register("Redcase")} />

                <label htmlFor="Redcase">คำสั่งลงวันที่ </label>
                <input type="text" className="form-control" name="Redcase"  
                    {...register("Redcase")} />

                <label htmlFor="Plaintiff">เปลี่ยนเวรวันที่</label>
                <input  type="text" className="form-control" name="Plaintiff"    
                    {...register("Plaintiff")} />

                    <button className="form-control btn btn-success mt-2" type="submit">สร้างเอกสาร</button>
            </div>
            
            <div className='col-7 bg-light'> 
            <label htmlFor="Topic">หนังสือเรื่อง </label> 
                <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                    onClick={ ()=>
                    setValue("Topic",'ขออนุมัติเปลี่ยนการปฏิบัติงานศาลเปิดทำการศาลและพิจารณาคำร้องขอปล่อยชั่วคราวในวันหยุดราชการและออกหมายค้นหมายจับ' ) } 
                >[แขวง/ประกัน]</button>
                <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                    onClick={ ()=>
                    setValue("Topic",'ขออนุมัติเปลี่ยนการปฏิบัติงานหมายค้นหมายจับนอกเวลาราชการ' ) } 
                >[ค้น/จับ]</button>
                <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                    onClick={ ()=>
                    setValue("Topic",`ขออนุมัติเปลี่ยนการปฏิบัติงานในกรณีเปิดทำการศาลนอกเวลาราชการ เพื่อดำเนินการเกี่ยวกับการเลือกตั้งและเพิกถอนสิทธิสมัครรับเลือกตั้งหรือสิทธิเลือกตั้งในการเลือกตั้งสมาชิกสภาท้องถิ่นหรือผู้บริหารท้องถิ่น พ.ศ.2562 (สมาชิกสภาองค์การบริหารส่วนตำบลและนายกองค์การบริหารส่วนตำบล)` ) } 
                >[เลือกตั้ง]</button>
                <textarea type="text" className="form-control" name="Topic" rows={3}
                    {...register("Topic")} />
  
                    <div className='row'>
                        <div className='col-6'>
                        <label htmlFor="Defendant">เปลี่ยนเวรให้</label>
                        <input  type="text" className="form-control text-primary" name="Defendant"    
                            {...register("Defendant")} />
                        <label htmlFor="Plaint">ผู้อนุมัติ</label>
                        <input  type="text" className="form-control" name="Plaint"  
                            {...register("Plaint")} />
                        </div>
                        <div className='col-6'>
                        <label htmlFor="Defendant">ตำแหน่ง</label>
                        <input  type="text" className="form-control text-primary" name="Defendant"    
                            {...register("Defendant")} />
                        <label htmlFor="Plaint">ตำแหน่ง</label>
                        <input  type="text" className="form-control" name="Plaint"  
                            {...register("Plaint")} />
                        </div>
                    </div>
                
            </div>

    </div>
    </div>
    </form>

    </>) ;
}

const ListUser = (props) => {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionChange = (selectedOption) => {
      setSelectedOption(selectedOption);
    };
  
    const handleButtonClick = () => {
      if (selectedOption) {
        const dataId = selectedOption.value.user_id;
        const dataDep = selectedOption.value.dep;
        alert(`Selected option data-id: ${dataId}, data-dep: ${dataDep}`);
      } else {
        console.log('No option selected');
      }
    };
  
    const data = props.data;
    const options = data.map((value) => ({
      value: value,
      label: value.fname + value.name + ' ' + value.sname,
    }));
  
    return (
      <>
        <label htmlFor="userlist">zone รายชื่อ บุคคล (ทดสอบ)</label>
        <Select
          className="form-control"
          styles={{ container: (provided) => ({ ...provided, textAlign: 'center' }) }}
          name="userlist"
          id="userlist"
          options={options}
          value={selectedOption}
          onChange={handleOptionChange}
          isSearchable={true}
          placeholder="ระบุชื่อ - สกุล"
        />
        <button className="btn btn-warning" onClick={handleButtonClick}>
          เลือก
        </button>
      </>
    );
}

const ListVen = (props) => {
    const data = props.data;
    return( <div className='table-responsive'>
        <h5>ข้อมูลเวรนอกเวลาประจำเดือน </h5>
        <table className="table table-bordered table-sm">
            <thead><tr>
                <th scope="col">#id</th>
                <th scope="col" style={{width:"30%"}}>วันที่เวร</th>
                <th scope="col">ประเภทเวร</th>
                <th scope="col">สถานะ</th>
                <th scope="col">หมายเหตุ</th>
            </tr></thead>
            <tbody>
            { data.length > 0 && 
                data.map((value, index) => ( <tr key={index} >
                    <th scope="row"> {value.id} <br /> {value.DN}</th>
                    <td> {convertDate(value.ven_date).week} <br /> เวลา {value.ven_time} </td>
                    <td style={{ backgroundColor: value.color, color: 'white' }}> {value.ven_com_name} 
                    <br /> <h6>{value.u_role}</h6> </td>
                    <td> {value.status} </td>
                    <td> 
                        -
                    </td>
                </tr> ))}
            </tbody>
            </table>
     </div> );
}

export default Fill_ven;