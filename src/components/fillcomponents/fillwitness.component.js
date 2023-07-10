import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import Service from "../../../src/services/case160.service";
// import {convertDate} from "../../../src/services/convert_text.service";

const MySwal = withReactContent(Swal);

const Fill_witness = () => {
const { register, handleSubmit, reset, setValue, getValues   } = useForm();
const [caseresult, setCaseresult] = useState([]);
// const [zonedata, setZonedata] = useState(false);

useEffect(()=>{
    if( caseresult.caseId ){
        const options = { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Bangkok" };
        let day_book = new Date().toLocaleDateString('th-TH', options);
        setValue("Daybook",day_book);
        setValue("Blackcase", caseresult.caseId.blackFullCaseName);
        setValue("Plaintiff",caseresult.caseId.prosDesc);
        setValue("Defendant",caseresult.caseId.accuDesc);
        setValue("Plaint",caseresult.caseId.alleDesc);
        setValue("Defendant_all", caseresult.caseId.otherDesc );
        setValue("Defendant_name", caseresult.caseId.accuDesc );
        setValue("appoint",'สืบพยาน' );
    } 
},[caseresult,setValue]);

const handleSearch = () => {
    reset();
    setCaseresult([]); 
    MySwal.fire({ html : <div>
      <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
      <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });

    let search_input = document.getElementById('search_input').value ;
    let caseBlack = search_input.length > 0 ? search_input : null ;
    if( caseBlack === null){ return MySwal.fire({ title:'ระบุข้อมูลค้นหา',icon: 'error', timer: 3000  }); }
    if( caseBlack.length > 0 ){
        let TopicCase = caseBlack.match(/[ก-๙a-zA-Z.\s]+/)[0].trim();
        let numCase = caseBlack.match(/\d+/g);
        if (numCase) {
          numCase = [TopicCase, ...numCase];
        } else {
          MySwal.fire({ title:'ไม่พบข้อมูลคดี', icon: 'error', timer: 3000 }); return;
        }
        if(numCase.length !== 3){ MySwal.fire({ title:'ไม่พบข้อมูลคดี', icon: 'error', timer: 3000 }); return; }
        if(numCase[2].length !== 4){ MySwal.fire({ title:'ระบุปี 4 หลัก', icon: 'error', timer: 3000 }); return; }

        let Service_call = Service.getSearchCase( numCase, 1 ); 
        Service_call.then(res => { 
            MySwal.close();
            // console.log(res);
            setCaseresult( res );
            // setZonedata(true);
        }).catch(error => { 
            console.log(error);
            setCaseresult(error);
            // setZonedata(false);
            MySwal.fire({  title:'ไม่พบข้อมูลคดี', html : <div> <h6> {error.message} </h6> </div>,icon: 'error',timer: 3000  });
  
        });
      } else { 
        MySwal.fire({ title:'กรุณาระบุเลขคดี', icon:'question', width:'20%', showConfirmButton: false, timer: 3000 });
        setCaseresult([]);
      }

}

// const CreateSelDef = (props) => {
//     let data = (props.data);
    
//     if(data.length > 0){
//     return( <>
//     <div className='row justify-content-center mt-2 '>
//     { data.map((value, index) => ( 
//         <div className='col-3 text-center mb-2' key={index}>
//             <div className="card">
//                 <div className="card-header bg-warning">
//                     { value.defendant_name }
//                 </div>
//                 <div className="card-body bg-light">
//                     <h6>วันนัด : { convertDate(value.appoint_day).date }</h6>
//                     <button className="btn btn-warning"
//                     onClick={() => { Detailclick(value); 
//                         // setZonedata(false);
//                      }}
//                     >เลือก</button>
//                     <button className="btn btn-dark mx-1"
//                     onClick={() => { setZonedata(false); }}
//                     >ปิด</button>
//                 </div>
//             </div>
//         </div> ))}
//     </div>
//     </> );
//     }
// }


// const Detailclick = (data) => {
//     if(data){
//         let street_fill = data.street || '';
//         let squad_fill = data.squad || '';
//         let alley_fill = data.alley || '';
//         let alley2_fill = data.alley2 || '';
//         let app_day = convertDate(data.appoint_day).date || '' ;

//         setValue("Defendant_name",data.defendant_name );
//         setValue("appoint_day",app_day );
//         setValue("appoint_time",data.appoint_time );
//         setValue("appoint",'สืบพยาน' );
//         setValue("houseno",data.houseno || '');
//         setValue("squad",squad_fill);
//         setValue("street",street_fill);
//         setValue("alley",alley_fill+' '+ alley2_fill);
//         setValue("canton",data.canton || '');
//         setValue("district",data.district || '');
//         setValue("province",data.province || '');
//         setValue("post",data.post || '75000');
//     }
// }


const onSubmit = (data) => {
    // console.log(data);
    MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    data.form_type = 1;
    Service.getReport_Word(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))

}
const onSubmitdata2 = () =>{
    const data = getValues();
    MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    data.form_type = 2;
    Service.getReport_Word(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))
}
const onSubmitdata3 = () =>{
    const data = getValues();
    MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    data.form_type = 3;
    Service.getReport_Word(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))
}

const handleKeyDown = (event) => { if (event.keyCode === 13) { handleSearch(); } }

const appoint_set = (num) => {
    switch(num){
        case 1 : setValue("appoint",'สืบพยานโจทก์' ); break;
        case 2 : setValue("appoint",'สืบพยานจำเลย' ); break;
        case 3 : setValue("appoint",'สืบพยานโจทก์และจำเลย' ); break;
        default : setValue("appoint",'สืบพยานโจทก์และจำเลย' ); 
    }
}

return (<>
    <div className='row justify-content-center mt-3 font-saraban'>
    <div className='col-6 text-center'>
            <h4>หนังสือ แจ้งติดตามพยาน </h4>
        <div className="input-group">
            <div className="input-group-prepend">
            <span className="input-group-text"> ระบุเลขคดีดำ </span>
            </div>
            <input type="text" className="form-control" style={{ textAlign: 'center' }} 
            onKeyDown={handleKeyDown} id="search_input" />
            <button className='btn btn-dark mx-1' onClick={ ()=> handleSearch() } > ค้นหา </button>
        </div>
    </div>
    {/* { zonedata && caseresult && <CreateSelDef data={caseresult}/> } */}
    </div>

    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="form-group">
    <div className='row font-saraban'>
            <div className='col-1'></div>
            <div className='col-3'>

                <label htmlFor="Daybook">วันที่หนังสือ</label>
                <input type="text" className="form-control text-danger" name="Daybook"  
                    {...register("Daybook")} />

                <label htmlFor="Blackcase">หมายเลขคดีดำ </label>
                <input type="text" className="form-control" name="Blackcase"  
                    {...register("Blackcase")} />
                    
                <label htmlFor="Plaintiff">โจทก์</label>
                <textarea  type="text" className="form-control" name="Plaintiff"    
                    {...register("Plaintiff")} />

                <label htmlFor="Defendant">จำเลย</label>
                <textarea  type="text" className="form-control" name="Defendant"    
                    {...register("Defendant")} />

                <label htmlFor="Plaint">ข้อหา</label>
                <textarea  type="text" className="form-control" name="Plaint"  
                    {...register("Plaint")} />
                    <button className="form-control btn btn-success mt-2" type="submit">แจ้งยืนยันวันนัด</button>
                    <button className="form-control btn btn-success mt-1" type="button"
                        onClick={ ()=> onSubmitdata2()}
                    >ติดตามพยาน</button>
                    <button className="form-control btn btn-success mt-1" type="button"
                        onClick={ ()=> onSubmitdata3()}
                    >แจ้งเตือนพยาน</button>
            </div>
            
            <div className='col-7 bg-light'> 

                <p className='bg-dark text-light mt-2'> -- ข้อมูลจำเลย สำหรับส่งหนังสือ -- </p>

                    
                <div className='row'>
                    <div className='col-9'>
                        <label htmlFor="Defendant_name">ชื่อจำเลย สำหรับหนังสือ</label>
                        <input  type="text" className="form-control" name="Defendant_name"    
                        {...register("Defendant_name")} />
                    </div>
                    <div className='col-3'>
                        <label htmlFor="BookNo">เลขหนังสือส่ง</label>
                        <input  type="text" className="form-control" name="BookNo"    
                        {...register("BookNo")} />
                    </div>
                    <div className='col-4 mt-1'> 
                    <label htmlFor="appoint_day">วันนัด</label>
                        <input type="text" className="form-control" name="appoint_day"  
                            {...register("appoint_day")} />
                    </div>
                    <div className='col-2 mt-1'> 
                    <label htmlFor="appoint_time">เวลา</label>
                        <input type="text" className="form-control" name="appoint_time"  
                            {...register("appoint_time")} />
                    </div>
                    <div className='col-6'> 
                    <label htmlFor="appoint">รายละเอียดนัดสืบ</label>
                    <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                     onClick={ ()=>appoint_set(1)} >[จ]</button>
                    <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                     onClick={ ()=>appoint_set(2)} >[ล]</button>
                    <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                     onClick={ ()=>appoint_set(3)} >[จ,ล]</button>
                        <input type="text" className="form-control" name="appoint"  
                            {...register("appoint")} />
                    </div>
                    <div className='col-2'>
                        <label htmlFor="houseno">บ้านเลขที่</label>
                        <textarea type="text" className="form-control" name="houseno"  
                            {...register("houseno")} />
                        <label htmlFor="squad">หมู่ที่</label>
                        <input type="text" className="form-control" name="squad"  
                            {...register("squad")} />
                        </div>

                        <div className='col-5'>
                        <label htmlFor="street">ถนน</label>
                        <input type="text" className="form-control" name="street"  
                            {...register("street")} />
                        <label htmlFor="canton">ตำบล/แขวง</label>
                        <input type="text" className="form-control" name="canton"  
                            {...register("canton")} />
                        <label htmlFor="province">จังหวัด</label>
                        <input type="text" className="form-control" name="province"  
                            {...register("province")} />
                        </div>

                        <div className='col-5'>
                        <label htmlFor="alley">ตรอก/ซอย</label>
                        <input type="text" className="form-control" name="alley"  
                            {...register("alley")} />
                        <label htmlFor="district">อำเภอ/เขต</label>
                        <input type="text" className="form-control" name="district"  
                            {...register("district")} />
                        <label htmlFor="post">ไปรษณีย์</label>
                        <input type="text" className="form-control" name="post"  
                            {...register("post")} />

                    </div>
                    <label  htmlFor="Defendant_all">ข้อมูลคู่ความทั้งหมดในคดี </label>
                        <textarea  type="text" className="form-control" name="Defendant_all" rows="4"    
                        {...register("Defendant_all")} />
                </div>

            </div>

    </div>
    </div>
    </form>
    {/* <h6 className='text-center text-muted mt-3'>***** ใช้สำหรับคดีอาญาที่ออกหมายเรียกแล้ว เท่านั้น (โดยมีวันนัด ตั้งแต่วันปัจจุบัน เป็นต้นไป) *****</h6> */}
    

    </>) ;
}


export default Fill_witness;