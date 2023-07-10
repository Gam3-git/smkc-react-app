import { useState ,useEffect} from 'react'
import { useForm } from "react-hook-form";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import Service from "../../../src/services/case160.service";
import {convertDate} from "../../../src/services/convert_text.service";

const MySwal = withReactContent(Swal);

const Fill_casefinal = () => {
const { register, handleSubmit, setValue  } = useForm();
const [caseresult, setCaseresult] = useState( [] );

useEffect(()=>{
    if(caseresult.caseId){
        let lastword = 'บัดนี้คดีได้ถึงที่สุดแล้ว จึงได้ออกหนังสือสำคัญฉบับนี้ไว้เพื่อเป็นหลักฐาน';
        let Datedecide = convertDate(caseresult.caseRed.judgeDate).date;
        let Day_arr = Datedecide.split(" ");

        switch(caseresult.caseBlack.caseTypeId){
            case 1 : setValue("Casetype", "อาญา"); break;
            case 2 : setValue("Casetype", "แพ่ง"); break;
            default : setValue("Casetype", "อาญา");
        }

        setValue("Blackcase",caseresult.caseId.blackFullCaseName);
        setValue("Redcase",caseresult.caseId.redFullCaseName ? caseresult.caseId.redFullCaseName : "-" );
        setValue("Datedecide",Datedecide);
        setValue("Plaint",caseresult.caseId.alleDesc);
        setValue("Plaintiff",caseresult.caseId.prosDesc);
        setValue("Defendant",caseresult.caseId.accuDesc);
        setValue("Datebook",`วันที่ ${Day_arr[0]} เดือน ${Day_arr[1]} พุทธศักราช ${Day_arr[2]}`);
        setValue("Lastremark",`ศาลชั้นต้นมีคำสั่ง ${Datedecide} ${lastword}`);
        setValue("Defendant_all", caseresult.caseId.otherDesc );
    }
},[caseresult,setValue]);


const handleSearch = () => {
    setCaseresult( [] );
    MySwal.fire({ html : <div>
      <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
      <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });

    let search_input = document.getElementById('search_input').value ;
    let caseBlack = search_input.length > 0 ? search_input : null ;
    
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
        }).catch(error => { 
            console.log(error);
            setCaseresult(error);
            MySwal.fire({  title:'ไม่พบข้อมูลคดี', html : <div> <h6> {error.message} </h6> </div>,icon: 'error',timer: 3000  });
  
        });
      } else { 
        MySwal.fire({ title:'กรุณาระบุเลขคดี', icon:'question', width:'20%', showConfirmButton: false, timer: 3000 });
        setCaseresult([]);
      }

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
        <input type="text" className="form-control" 
            style={{ textAlign: 'center' }} 
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

            <button className="form-control btn btn-success my-2" type="submit">สร้างเอกสาร</button>

            <label  htmlFor="Defendant_all">ข้อมูลคู่ความทั้งหมดในคดี </label>
            <textarea  type="text" className="form-control" name="Defendant_all" rows="4"    
                {...register("Defendant_all")} />
            </div>

    </div>
    </div>
    </form>
    

    </>) ;
}


export default Fill_casefinal;