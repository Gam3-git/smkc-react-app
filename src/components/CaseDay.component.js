import { useState, useEffect, useCallback } from 'react'
import moment from 'moment';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/th';

import Service from "../services/caseaccess.service";

const MySwal = withReactContent(Swal);

const CaseDay = () => {
const [caseresult, setCaseresult] = useState([]);
const [daycase, setDaycase] = useState([]);
const [showDatePicker, setShowDatePicker] = useState(false);

// const currentDate = moment().add(1, 'day').format('YYYY/MM/DD');
// const currentDate = moment().subtract(1, 'day').format('YYYY/MM/DD');
const currentDate = moment().format('YYYY/MM/DD');

  const caseDay = useCallback((num) => {
    setCaseresult([]);
    MySwal.fire({ html : <div>
      <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
      <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
  let dd = moment.isMoment(daycase) ? daycase.format('YYYY/MM/DD') : currentDate;
  Service.getCaseDay(num,dd)
  .then(res => {
      if(res.data.length > 0){
        setCaseresult(res.data);
        MySwal.close();
      } else {
        MySwal.fire({ title:'ไม่พบข้อมูลคดีประจำวัน',html:<div><h6>{dd}</h6></div>,icon: 'error', timer: 3000  });
        setCaseresult([]);
      }
  }).catch(err => {
    setCaseresult([]);
    MySwal.fire({ title:'ไม่พบข้อมูลคดีประจำวัน',html:<div><h6>{err.message}</h6></div>,icon: 'error', timer: 3000  });
  });
  }, [daycase, currentDate]);

  useEffect(()=> { caseDay(1); },[caseDay]);

  const handlechangeDay = (newDate) => {
    setDaycase(newDate);
    let date = new Date(newDate.format('YYYY-MM-DD'));
    let options = { year: 'numeric', month: 'long', day: 'numeric'};
    let formattedDate = date.toLocaleDateString('th-TH', options);
    document.getElementById('el_Day').value = formattedDate;
    setShowDatePicker(false);
  };

  const TableViewDetail = (props) => {
    let TableData = props.data ;
      return( <>
      <div className="row">
      <div className="col-12 mt-2">
      <div className="table-responsive">
      <table className='table table-bordered table-sm'>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" style={{width:"18%"}}>หมายเลขคดี</th>
            <th scope="col" style={{width:"38%"}} >คู่ความ</th>
            <th scope="col" style={{width:"20%"}}>ข้อหา</th>
            <th scope="col" style={{width:"20%"}}>ผู้พิพากษา</th>
          </tr>
        </thead>
        <tbody> 
        { TableData.map((value, index) => ( <tr key={index} >
            <th scope="row"> {index + 1} </th>
            <td> คดีดำ : {value.blackcase} <br /> <span className='text-danger'>คดีแดง 
            : {value.casetext}{value.rednum}/{value.redyear}</span></td>
            <td> โจทก์ : {value.plaintiff} <hr />  จำเลย : {value.defendant} </td>
            <td>  {value.casesubtype} <br />ข้อหา : {value.plaint} </td>
            <td> เวรชี้ : <br />- {value.jud_receive} <br />ตัดสิน : <br />- {value.jud_decide} </td>
          </tr> ))}
      </tbody>
      </table>
      </div>
      </div>
      </div>
        </>
      );
  }

  return ( 
    <div className='row justify-content-center mt-3'>
    <div className='col-5 text-center'>

      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text">วันที่</span>
        </div>
        <input type="text" className="form-control" style={{ textAlign: 'center' }}
            id="el_Day" onClick={() => setShowDatePicker(!showDatePicker)} 
            autoComplete="off" />
      
           { showDatePicker && 
              <Datetime
                input={false}
                locale="th"
                format="YYYY-MM-DD"
                timeFormat={false}
                closeOnSelect={true}
                defaultValue={new Date()}
                onChange={(newDate) => handlechangeDay(newDate)}
                closeOnClickOutside={true}
                />
            }
      </div>

      <button className='btn btn-primary mx-1 btnprint' onClick={()=> caseDay(1)} >รับฟ้องประจำวัน </button>
      <button className='btn btn-danger mx-1 btnprint' onClick={()=> caseDay(2)} > ออกแดงประจำวัน </button>
      <button className='btn btn-dark mx-1 btnprint' onClick={ () => window.print()} > พิมพ์ </button>

      </div>

      { caseresult.length > 0 &&  <>
      <h5 className='text-center pt-2'> จำนวน {caseresult.length} คดี</h5>
      <TableViewDetail data={ caseresult } />
      </> }
    </div>
     ) ;
}


export default CaseDay;