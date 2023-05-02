import { useState ,useEffect} from 'react'
import { useForm } from "react-hook-form";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import Service from "../../../src/services/caseaccess.service";
import {convertDate} from "../../../src/services/convert_text.service";

const MySwal = withReactContent(Swal);

const Fill_casefinal = () => {
const { register, handleSubmit, setValue  } = useForm();
const [caseresult, setCaseresult] = useState({});
const [judlist, setJudlist] = useState([]);


useEffect(()=>{ Service.getJud_List().then(res => setJudlist(res)).catch(err => console.log(err)); },[]);
useEffect(()=>{
    if(caseresult.blackcase){
        let lastword = 'บัดนี้คดีได้ถึงที่สุดแล้ว จึงได้ออกหนังสือสำคัญฉบับนี้ไว้เพื่อเป็นหลักฐาน';
        let Datedecide = convertDate(caseresult.date_decide).date;
        let d = convertDate(new Date()).date;
        let Day_arr = d.split(" ");

        setValue("Casetype",caseresult.casetype);
        setValue("Blackcase",caseresult.blacknum);
        setValue("Redcase",`${caseresult.casetext}${caseresult.rednum}/${caseresult.redyear}`);
        setValue("Datedecide",Datedecide);
        setValue("Plaint",caseresult.plaint);
        setValue("Plaintiff",caseresult.plaintiff);
        setValue("Defendant",caseresult.defendant);
        setValue("Datebook",`วันที่ ${Day_arr[0]} เดือน ${Day_arr[1]} พุทธศักราช ${Day_arr[2]}`);
        setValue("Lastremark",`${caseresult.succ_remark} ${Datedecide} ${lastword}`);
        // console.log(caseresult);
    }
},[caseresult,setValue]);

const btn_jud = (list) => {

    if (!Array.isArray(list)) {
        return null ; 
    }
    return( <>
        { list.map( (value,index) => (
            <button className='btn btn-primary btn-sm my-1 mx-1' key={index}
            onClick={()=>setValue("Judname",value)}> 
            {/* {value} </button> */}
            {value.substring(0, 15) + '....'} </button>
        ))}
    </>);
}

const handleSearch = () => {
    let search_input = document.getElementById('search_input').value ;
    let text_search = search_input.length > 0 ? search_input : null ;
    setCaseresult({});

    MySwal.fire({ html : <div>
      <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
      <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });

    Service.getCerJud(text_search)
    .then( res => {
        if(res){
            setCaseresult(res.data);
            MySwal.close();
          } else {
            MySwal.fire({ title:'ไม่พบข้อมูล',icon: 'error', timer: 3000  });
            setCaseresult({});
          }
    }).catch( err =>{
        setCaseresult({});
        MySwal.fire({ title:'ไม่พบข้อมูล',html:<div><h6>{err.message}</h6></div>,icon: 'error', timer: 3000  });
    });
}

const onSubmit = (data) => {
    if(data.Judname.length < 1){ MySwal.fire({ title:'ระบุผู้พิพากษา',icon: 'error', timer: 3000  }); return;}
    MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    Service.getReport_CerJud(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))
}

const handleKeyDown = (event) => { if (event.keyCode === 13) { handleSearch(); } }

return (<>

    <div className='row justify-content-center mt-3 font-saraban'>
    <div className='col-5 text-center'>
        <h4>หนังสือรับรองคดีถึงที่สุด</h4>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">ระบุเลขคดีดำ</span>
        </div>
        <input type="text" className="form-control" style={{ textAlign: 'center' }} 
        onKeyDown={handleKeyDown} id="search_input" />
        <button className='btn btn-dark mx-1' onClick={ ()=> handleSearch() } > ค้นหา </button>
      </div>
      </div>
    </div>

    
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="form-group">
    <div className='row mt-1 font-saraban'>
            <div className='col-1'></div>
            <div className='col-3'>
            <label htmlFor="Casetype">ประเภทคดี</label>
            <input type="text" className="form-control" name="Casetype"  
                {...register("Casetype")} />

            <label htmlFor="Blackcase">หมายเลขคดีดำ </label>
            <input type="text" className="form-control" name="Blackcase"  
                {...register("Blackcase")} />

            <label htmlFor="Redcase">หมายเลขคดีแดง</label>
            <input type="text" className="form-control text-danger" name="Redcase"  
                {...register("Redcase")} />

            <label htmlFor="Datedecide">วันที่ได้มีหรืออ่านคำพิพากษา</label>
            <input type="text" className="form-control text-danger" name="Datedecide"  
                {...register("Datedecide")} />

            <label htmlFor="Judname">ผู้พิพากษา</label>
            <input type="text" className="form-control" name="Judname"  
                {...register("Judname")} />

            </div>


            <div className='col-7'>
            <label htmlFor="Plaint">เรื่อง(ข้อหา)</label>
            <textarea  type="text" className="form-control" name="Plaint" rows="1"  
                {...register("Plaint")} />

            <label htmlFor="Plaintiff">ชื่อโจทก์</label>
            <textarea  type="text" className="form-control" name="Plaintiff" rows="1"    
                {...register("Plaintiff")} />

            <label htmlFor="Defendant">ชื่อจำเลย</label>
            <textarea  type="text" className="form-control" name="Defendant" rows="1"    
                {...register("Defendant")} />

            <label htmlFor="Datebook">ออกให้ ณ วันที่</label>
            <input type="text" className="form-control" name="Datebook"  
                {...register("Datebook")} />

            <label  htmlFor="Lastremark">ข้อความช่วงท้าย</label>
            <textarea  type="text" className="form-control" name="Lastremark" rows="3"    
                {...register("Lastremark")} />

            <button className="form-control btn btn-success mt-2" type="submit">สร้างเอกสาร</button>
            </div>

    </div>
    </div>
    </form>
    
    <div className='row justify-content-center mt-1 font-saraban'>
     { judlist.data && 
         <div className='col-12 text-center'>
            <p> - เลือกผู้พิพากษาลงนาม</p>
             {btn_jud(judlist.data)}
         </div> 
     }
    </div>

    </>) ;
}


export default Fill_casefinal;