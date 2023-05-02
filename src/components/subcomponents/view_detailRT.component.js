import { useState,useEffect } from 'react';
import Service from "../../../src/services/caseaccess.service";
import {convertDate, convertYMD} from "../../../src/services/convert_text.service";

const printStyles = `
  @media print {
    @page { size: A4 landscape; }
    body { font-family: Sarabun, sans-serif; }
  }
`;
let today = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' } );

const textCard = (num) => {
  switch(num+1){
    case 1 : return 'ค้างไม่เกิน 3 เดือน';
    case 2 : return 'ค้างไม่เกิน 6 เดือน';
    case 3 : return 'ค้างไม่เกิน 1 ปี';
    case 4 : return 'ค้างไม่เกิน 2 ปี';
    case 5 : return 'ค้างไม่เกิน 3 ปี';
    case 6 : return 'ค้างไม่เกิน 4 ปี';
    case 7 : return 'ค้างไม่เกิน 5 ปี';
    case 8 : return 'ค้างเกิน 5 ปี';
    default : return 'ค้าง';
  }
}

const ViewDetailRT = (props) =>  {

  const [dataDetail, setDataDetail] = useState([]);
  const select_t = (props.data);

  useEffect(() => {
    Service.getDetail_Remain(select_t)
    .then(res => { 
      setDataDetail(res.data);

      // console.log(res.data);

    }).catch(error => { console.log(error); } );
    
  },[select_t]);

  const TableViewDetail = (props) => {
    let TableData = props.data ;
  
      return( <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      <div className="row">
      <div className="col-12 mt-2">
      <div className="table-responsive">
      <table className='table table-bordered table-sm'>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col" style={{width:"10%"}}>หมายเลขคดีดำ</th>
            <th scope="col" style={{width:"30%"}} >คู่ความ</th>
            <th scope="col">ระยะเวลาค้าง</th>
            <th scope="col">วันนัดสุดท้าย</th>
            <th scope="col">ผู้พิพากษาเจ้าของสำนวน</th>
          </tr>
        </thead>
        <tbody> 
        { TableData.map((value, index) => ( <tr key={index} >
            <th scope="row"> {index + 1} </th>
            <td> {value.blackcase} </td>
            <td> โจทก์ : {value.plaintiff} <br /> จำเลย : {value.defendant} </td>
            <td>  { convertYMD(value.day_count) } </td>
            <td>  { convertDate(value.appoint_day).date } </td>
            <td> {value.judge} </td>
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
    <> 
      
        
        { dataDetail.length > 0 && <>
          <h4 className="text-center"> รายละเอียดข้อมูล { textCard(select_t - 2) } (จำนวน { dataDetail.length } คดี)</h4>
          <p className="text-center"> ข้อมูล ณ วันที่ : {today}</p>
        <TableViewDetail data={ dataDetail } /> </>
        }  
         
      
      
    </>
    
  );

};

export default ViewDetailRT;
