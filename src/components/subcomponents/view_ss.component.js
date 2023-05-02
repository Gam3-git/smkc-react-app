import { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Service from "../../../src/services/caseaccess.service";
import { convertDate } from "../../../src/services/convert_text.service";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import { ArrowClockwise } from 'react-bootstrap-icons';

const MySwal = withReactContent(Swal);

const View_ss = () => {
    const [viewdata, setViewdata] = useState([]);
    const [typeview, setTypeview] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if( params.get("type_id") != null ){
        setTypeview(parseInt(params.get("type_id")));
        Service.view_Social( parseInt(params.get("type_id")) )
        .then(data=> setViewdata(data))
        .catch(err => console.log(err.response.data));
        } else {
            setViewdata([]);
            setTypeview(0);
        }
    },[ location ]);

    return(<>
        { viewdata.data ? <TableView data={viewdata.data} typeview={typeview} /> 
        : <h3 className='text-center'>ไม่พบข้อมูล</h3> }
    </>);
}

const TableView = (props) => {
    const TableData = props.data; 
    const typeview = props.typeview; 
    // console.log(TableData);
    const del_ss = (id_ss) => {
        MySwal.fire({
            title: 'ต้องการ ลบข้อมูล ?', showDenyButton: true, showCancelButton: false,
            confirmButtonText: 'Yes', denyButtonText: `No`,
          }).then((result) => {
            if (result.isConfirmed) {
                MySwal.fire({ html : <div>
                <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
                <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 });
                Service.del_Social(id_ss).then(res => { 
                    MySwal.fire({ title: res.data.message , icon: 'success',showConfirmButton: false, timer: 1500 });
                    setTimeout( ()=>  window.location.reload(),1800);
                }).catch(err => { console.log(err.response.data); MySwal.close(); });
            } else if (result.isDenied) {
                MySwal.close();
            }
          });
    }

    return( <>
      <div className="col-1 mt-2"></div>
      <div className="col-10 mt-2  font-saraban">
      <div className="table-responsive">
        <h5 className='text-center'> {typeview === 4 ? 'ข้อมูลคำร้องใบเดียว':'ข้อมูลคำร้องบริการสังคม'}</h5>
      <table className='table table-bordered table-sm'>
        <thead>
          <tr>
            <th scope="col">#ID</th>
            <th scope="col" style={{width:"10%"}}>หมายเลขคดีดำ</th>
            <th scope="col" style={{width:"30%"}} >คู่ความ</th>
            <th scope="col">คำร้องวันที่</th>
            <th scope="col">ประเภท</th>
            <th scope="col">หมายเหตุ</th>
          </tr>
        </thead>
        <tbody> 
        { TableData.map((value, index) => ( <tr key={index} >
            <th scope="row"> {value.id_social} </th>
            <td> {value.blackcase} </td>
            <td> โจทก์ : {value.plaintiff} <br /> จำเลย : {value.defendant_n} </td>
            <td>  { convertDate(value.dateclaim).date } </td>
            <td>  { value.type_ss === 1 ? 'บริการสังคม' : 'คำร้องใบเดียว' }  </td>
            <td className='text-center'><button className='btn btn-danger' 
                onClick={ ()=>{ del_ss(value.id_social)} }>
                ลบ</button>  </td>
          </tr> ))}
      </tbody>
      </table>
      </div>
      </div>
        </>
    );

}

export default View_ss;