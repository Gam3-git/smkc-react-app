import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { ChkUser} from "../services/chkuser.service";
import { convertDate_s } from "../services/convert_text.service";
import Service from "../services/uservocasick.service";
const MySwal = withReactContent(Swal);

const UserVocationSt = () => {

    const [vsdata, setVSdata] = useState({});
    const [typetext, setTypetext] = useState(1);
    const [vsdetaildata, setVSdetaildata] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const user = ChkUser();
        if(!user){ navigate('/login'); }
      }, [navigate]);

    useEffect(()=>{
        Service.getDetailStaticVs(1).then(res => {
            setVSdata(res.data);
        }).catch(err => { console.log(err.response.data.message); setVSdata({}); });
    },[]);

    const button_sel = (type)=>{
        setVSdetaildata({});
        setTypetext(type);
        Service.getDetailStaticVs(type).then(res => {
            setVSdata(res.data);
        }).catch(err => { console.log(err.response.data.message); setVSdata({}); });
        }

    const button_sel2 = ()=>{
        setVSdata({});
        Service.getStaticVs().then(res => {
            setVSdetaildata(res.data);
        }).catch(err => { console.log(err.response.data.message); setVSdetaildata({}); });
        }

    const butt_click = (iduvs,iduser) =>{
        const date_present = document.getElementById("date_1");
        if (date_present.value.match(/^\d{4}-\d{2}-\d{2}$/)) {
            Service.AddLate(iduvs, iduser, date_present.value).then(res => {
            MySwal.fire( `ID: ${ res.data.id_vs }`, '', 'success' );
            }).catch(err => { 
                console.log(err.response.data.message);
                MySwal.fire(err.response.data.message,'','error');   
            });
            // MySwal.fire( `success`, '', 'success' );
            // console.log(date_present.value , iduvs, iduser);
          } else {
            MySwal.fire( `ระบุรูปแบบวันที่ไม่ถูกต้อง`, '', 'error' );
          }
        
    }

    const set_late = (iduvs, iduser) =>{
        const curentdate = new Date().toISOString().slice(0,10);
        MySwal.fire({ title:'ระบุวันที่สาย',
        html:<>
            <label htmlFor="date_1"> (รูปแบบ ปี4หลัก-เดือน2หลัก-วัน2หลัก YYYY-MM-DD) </label>
            <input type="text" className="form-control text-center" id="date_1"  defaultValue={curentdate} />
            <button className='btn btn-warning mt-2' onClick={()=>butt_click(iduvs, iduser)}> เลือก </button>
        </>,showConfirmButton: false, });
    }
    

    const TableVS = (props) => {

        const data = props.data;
        let result;

        if(data.length){
        result = Object.values(data.reduce((acc, cur) => {
            const key = `${cur.user_smkc.name_u}-${cur.type_paper}`;
            if (acc[key]) {
              acc[key].num_present += cur.num_present;
              acc[key].date_get_all.push({ date1: cur.date_present1, date2: cur.date_present2, date3: cur.day_break });
              acc[key].day_count ++;
            } else {
              acc[key] = {
                ...cur,
                date_get_all: [{ date1: cur.date_present1, date2: cur.date_present2, date3: cur.day_break }],
                day_count: 1
              };
            }
            return acc;
          }, {}));
        }

        const typevs = (text) =>{
            switch(text){
                case 1 : return 'ลาพักผ่อน';
                case 11 : return 'สาย';
                case 2 : return 'ลาป่วย';
                case 3 : return 'ลากิจ';
                case 4 : return 'ลาคลอด';
                default : return 'ลา';
            }
        }
        const bgtype = (text) =>{
            switch(text){
                case 1 : return 'table-success text-center';
                case 11 : return 'table-warning text-center';
                case 2 : return 'table-primary text-center';
                case 3 : return 'table-info text-center';
                default : return '';
            }
        }
        const typeday = (text) =>{
            switch(text){
                case 1 : return '(เช้า)';
                case 2 : return '(บ่าย)';
                default : return '.';
            }
        }
        const typetext_show = (num) =>{
            switch(num){
                case 0 : return 'รายละเอียดการลาทั้งหมด';
                case 1 : return 'รายละเอียดการลาเดือนนี้';
                case 2 : return 'รายละเอียดการลาย้อนหลัง 2 เดือน';
                case 3 : return 'รายละเอียดการลาย้อนหลัง 3 เดือน';
                default : return 'รายละเอียดการลาทั้งหมด';
            }
        }


        if(data.length){ 
            return(<>
            <div className="table-responsive">
                <h5 className="bg-dark text-light text-center py-2"> { typetext_show(typetext) } พบข้อมูล {result.length} รายการ </h5>
                <table className="table table-sm">
                <thead><tr>
                    <th scope="col">#</th>
                    <th scope="col" style={{width:"30%"}} >ชื่อ - สกุล</th>
                    <th scope="col">การลาครั้งนี้</th>
                    <th scope="col"></th>
                    <th scope="col"></th>
                    <th scope="col">ระหว่างวันที่</th>
                </tr></thead>
                <tbody>
                { result.map((value, index) => ( <tr key={index} >
                    <th scope="row"> {index + 1} </th>
                    <td> { value.user_smkc.name_u } </td>
                    <td className = { bgtype(value.type_paper) }> { typevs(value.type_paper) } </td>
                    <td className = { bgtype(value.type_paper) }>  { value.day_count} ครั้ง </td>
                    <td className = { bgtype(value.type_paper) }>  { value.num_present } วัน </td>
                    <td> 
                        { value.date_get_all.map((value, index) => (
                            <h6 key={index}> วันที่ : {convertDate_s(value.date1).date} ถึง {convertDate_s(value.date2).date} {typeday(value.date3)}</h6>
                        ))}
                    </td>
                </tr> ))}
                </tbody>
                </table>
            </div>
            </>);
         }
        
    }

    const TableDetail = (props) => {
        const data = props.data;

        const typevs = (text) =>{
            switch(text){
                case 1 : return 'ลาพักผ่อน';
                case 11 : return 'สาย';
                case 2 : return 'ลาป่วย';
                case 3 : return 'ลากิจ';
                case 4 : return 'ลาคลอด';
                default : return 'ลา';
            }
        }

        if(data.length){ 
            return(<>
            <div className="table-responsive">
                <table className="table table-sm">
                <thead><tr>
                    <th scope="col">#</th>
                    <th scope="col" style={{width:"22%"}} >ชื่อ - สกุล</th>
                    <th scope="col">พักผ่อน <br />(ทั้งหมด)</th>
                    <th scope="col">พักผ่อน <br />(มาแล้ว)</th>
                    <th scope="col">สาย <br />(มาแล้ว)</th>
                    <th scope="col">ลาป่วย <br />(มาแล้ว)</th>
                    <th scope="col">ลากิจ <br />(มาแล้ว)</th>
                    <th scope="col">ลาคลอด <br />(มาแล้ว)</th>
                    <th scope="col">การลาครั้งล่าสุด</th>
                    <th scope="col">-</th>
                </tr></thead>
                <tbody>
                { data.map((value, index) => ( <tr key={index} >
                    <th scope="row"> {index + 1} </th>
                    <td> {value.user_smkc.name_u} </td>
                    <td> {value.type1_bn + 10} </td>
                    <td className='text-success'> {value.type1_tn} </td>
                    <td className='text-warning'> {value.late_total} </td>
                    <td className='text-primary'> {value.type2_tn} </td>
                    <td className='text-info'> {value.type3_tn} </td>
                    <td> {value.type4_tn} </td>
                    <td> { typevs(value.last_type_p) } {value.num_lb} วัน <br /> 
                    วันที่ : {convertDate_s(value.date_lb1).date} ถึง {convertDate_s(value.date_lb2).date}</td>
                    <td> <button className='btn btn-warning'
                        onClick={()=> set_late(value.id_uvs,value.id_user)}> แจ้งสาย </button></td>
                </tr> ))}
                </tbody>
                </table>
            </div>
            </>);
         }
        
    }


    return(<>
    <div className='row justify-content-center mt-3'>
        <div className='col-12 text-center'>
            <h4>รายละเอียดวันลาทั้งหมด</h4>
            <button className='btn btn-warning mx-1' 
            onClick={()=>button_sel2()} > สถิติลา&แจ้งสาย </button>
            <button className='btn btn-dark mx-1' 
            onClick={()=>button_sel(1)} > การลาเดือนนี้ </button>
            <button className='btn btn-dark mx-1'
            onClick={()=>button_sel(2)} > การลาย้อนหลัง 2 เดือน </button>
            <button className='btn btn-dark mx-1'
            onClick={()=>button_sel(3)} > การลาย้อนหลัง 3 เดือน </button>
            <button className='btn btn-danger mx-1' 
            onClick={()=>button_sel(0)} > สรุปลาทั้งหมด </button>
        </div>
        <div className='col-10 mt-2'>
            { vsdata && <TableVS data={vsdata} /> }
            { vsdetaildata && <TableDetail data={vsdetaildata} /> }
        </div>
    </div>
    </>);

};

export default UserVocationSt;