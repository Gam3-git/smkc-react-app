import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import Service from "../services/caseaccess.service";
import ViewRemainCase from "./subcomponents/view_remainT.component";
import ViewRemainCase2 from "./subcomponents/view_remainT2.component";
import ViewDetailRT from "./subcomponents/view_detailRT.component";

const MySwal = withReactContent(Swal);

const RemainCase = () => {

const [caseresult, setCaseresult] = useState([]);
const [typeselect, setTypeselect] = useState(0);
const [zoneDetail, setZoneDetail] = useState(0);
const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  if( params.get("type_id") != null ){
    setZoneDetail( parseInt(params.get("type_id")) ); 
    setTypeselect(3);
  } else {
    search_remain(1);
  }
},[ location ]);

const search_remain = (num) =>{
  MySwal.fire({ html : <div>
    <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
    <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
  });

  Service.getAll_Remain()
  .then(res => { 
    
    setCaseresult(res.data);
    setTypeselect(num)
    MySwal.close();
  }).catch(error => { console.log(error); } );
}

const del_remain = () => {
Service.getDel_Remain()
  .then(res => { 
    console.log(res.data); 
    search_remain(1); 
  })
  .catch(error => { console.log(error); } );
}

  return ( 
    <div className='row justify-content-center mt-3'>

    <div className='text-center'>
      <button className='btn btn-danger mx-1 btnprint' onClick={ () => search_remain(1)}> ข้อมูลคดีค้าง </button>
      <button className='btn btn-info mx-1 btnprint' onClick={ () => search_remain(2)}> ข้อมูลคดีค้างตามประเภท </button>
      <button className='btn btn-dark mx-1 btnprint' onClick={ () => window.print()}> พิมพ์ </button>
    </div>

    { caseresult.length > 0 && typeselect === 1 ? ( <ViewRemainCase data={caseresult} /> ) :
       typeselect === 2 ? (< ViewRemainCase2 data={caseresult} /> ) :
       typeselect === 3 ? ( <ViewDetailRT data={ zoneDetail } /> ) : null
    }

    <div className='text-center'>
      <button className='btn btn-warning mt-2 btnprint' onClick={ () => del_remain() }> คำนวนข้อมูลอีกครั้ง </button>
    </div>
    
    </div>
     ) ;
}


export default RemainCase;