import { useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';
import Service from "../services/caseaccess.service";
import {convertDate} from "../services/convert_text.service";

const MySwal = withReactContent(Swal);

const CasePost = () => {
const [caseresult, setCaseresult] = useState([]);

const handleSearch = (num) => {
    let post_input = document.getElementById('post_input').value ;
    let text_search = post_input.length > 0 ? post_input : null ;
    setCaseresult([]);
    MySwal.fire({ html : <div>
      <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
      <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    Service.getPostCase(num,text_search)
    .then( res => {
        if(res.data.length > 0){
            setCaseresult(res.data);
            MySwal.close();
          } else {
            MySwal.fire({ title:'ไม่พบข้อมูล',icon: 'error', timer: 3000  });
            setCaseresult([]);
          }
    }).catch( err =>{
        setCaseresult([]);
        MySwal.fire({ title:'ไม่พบข้อมูลคดีประจำวัน',html:<div><h6>{err.message}</h6></div>,icon: 'error', timer: 3000  });
    });
}
 
const CardViewDetail = (props) => {
    let CardData = props.data ;
    if(CardData.length > 50){ CardData = CardData.slice(0,50)}
    // console.log(CardData);
      return( <>
      <div className="row justify-content-center mt-2">

        { CardData && CardData.map((value, index) => (
            <div className="col-3 mt-3" key={index}>
            <div className="card">
                <div className="card-header text-center ">
                    <h4>{ value.case_id }</h4>
                </div>
                <div className="card-body">
                <h6> ส่งวันที่ : { convertDate(value.datesend).date } </h6>
                <h6> ส่งถึง : { value.sendto } </h6>
                <h6>{ value.address } </h6>
                <p className="text-center"><button className="btn btn-danger"
                onClick={() => { window.open("https://track.thailandpost.co.th?trackNumber="+value.sendno, "_blank") }}
                >{ value.sendno }</button></p>
                </div>
            </div>
            </div>
        ))}
    
      </div>
        </>
      );
}

const handleKeyDown = (event) => { if (event.keyCode === 13) { handleSearch(1); } }

  return ( 
    <div className='row justify-content-center mt-3'>
    <div className='col-12 text-center my-1'>
        <h4> ติดตามผลส่งไปรษณีย์ (เบื้องต้น) 
        <button className='btn btn-warning mx-1 btnprint' onClick={ ()=> handleSearch(99) } >แสดง 50 รายการ </button>
        <button className='btn btn-danger mx-1 btnprint' onClick={ ()=> window.open("https://track.thailandpost.co.th", "_blank") }> เว็บไปรษณีย์ไทย </button> </h4>
    </div>
    <div className='col-3 my-1'>
        <input type="text" className="form-control" style={{ textAlign: 'center' }} 
        onKeyDown={handleKeyDown} id="post_input" autoComplete="off" />
    </div><div className='col-3 my-1'>
        <button className='btn btn-success mx-1 btnprint' onClick={ ()=> handleSearch(1) } >ค้นหาด้วยเลขคดี </button>
        <button className='btn btn-info mx-1 btnprint' onClick={ ()=> handleSearch(2) } > ค้นหาชื่อผู้รับ </button>
    </div>
    { caseresult.length > 0 &&
        <CardViewDetail data={ caseresult } /> 
    }
    </div>
     ) ;
}


export default CasePost;