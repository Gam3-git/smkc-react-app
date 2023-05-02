import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import Service from "../../../src/services/caseaccess.service";
import {convertDate} from "../../../src/services/convert_text.service";

const MySwal = withReactContent(Swal);

const Fill_driving_li = () => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [caseresult, setCaseresult] = useState([]);
    const [bookname, setBookname] = useState([]);

useEffect(()=>{
    Service.getBookNameFind().then( res => {
        setBookname(res.data);
    }).catch( err => console.log(err.message));
},[]);

useEffect(()=>{
    if(caseresult.length > 0){
        let day_book = convertDate(new Date()).date;
        let dd = day_book.split(' ');
        day_book = `วันที่  ${dd[0]}  เดือน  ${dd[1]}  พ.ศ.  ${dd[2]} `;
        let day_decide = convertDate( caseresult[0].date_decide ).date;
        let redcase = caseresult[0].rednum ? `${caseresult[0].casetext}${caseresult[0].rednum}/${caseresult[0].redyear}` : '-';
        let detail_text = `คดีนี้ ศาลมีคำสั่งให้พักใช้ใบอนุญาตขับขี่รถของจำเลย มีกำหนด 6 เดือน นับแต่วันที่ ${day_decide} เป็นต้นไป รายละเอียดใบอนุญาตขับรถปรากฏตามสิ่งที่ส่งมาด้วย`;

        setValue("Daybook",day_book);
        setValue("Blackcase",caseresult[0].blackcase);
        setValue("Redcase",redcase); 
        setValue("Plaintiff",caseresult[0].plaintiff);
        setValue("Defendant",caseresult[0].defendant);
        setValue("Plaint",caseresult[0].plaint);
        setValue("book_detail",detail_text );
        setValue("Topic",'แจ้งคำสั่งพักใช้ใบอนุญาตขับรถ');
        setValue("Sendto",'ขนส่งจังหวัดสมุทรสงคราม');
        setValue("book_p1",'สำเนาใบอนุญาตขับรถยนต์ส่วนบุคคล');
        setValue("book_p2",`ของ ${caseresult[0].defendant} จำนวน 1 ฉบับ`);

        setValue("book_name",bookname[16].book_name || null );
        setValue("book_posi1",bookname[16].book_posi1 || null );
        setValue("book_posi2",bookname[16].book_posi2 || null );
        
    } 
},[ bookname,caseresult,setValue ]);

const handleSearch = () => {
    reset();
    let search_input = document.getElementById('search_input').value ;
    let text_search = search_input.length > 0 ? search_input : null ;
    if(text_search === null){ return MySwal.fire({ title:'ระบุข้อมูลค้นหา',icon: 'error', timer: 3000  }); }
    setCaseresult([]); 

    MySwal.fire({ html : <div>
      <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
      <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });

     Service.getSocialservice1(text_search).then( res => {
        if(res){
            setCaseresult(res.data);
            MySwal.close();
        } else { throw new Error(); }
        }).catch( err =>{
            MySwal.fire({ title:'ไม่พบข้อมูล',html:<div><h6>{err.message}</h6></div>,icon: 'error', timer: 3000  });
            setCaseresult([]);
        });
}

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

const handleKeyDown = (event) => { if (event.keyCode === 13) { handleSearch(); } }

const book_p1_set = () => {
    MySwal.fire({ title:'เลือกสิ่งที่ส่งมาด้วย',
    html:<>
            <button className="btn btn-warning mx-1 my-1"
                onClick={ ()=> { setValue("book_p1",'สำเนาใบอนุญาตขับรถยนต์ชั่วคราว' ); MySwal.close(); } }
            >ขับรถยนต์ชั่วคราว</button>
            <button className="btn btn-warning mx-1 my-1"
                onClick={ ()=> {setValue("book_p1",'สำเนาใบอนุญาตขับรถยนต์ส่วนบุคคล' ); MySwal.close();} }
            >ขับรถยนต์ส่วนบุคคล</button>
            <button className="btn btn-warning mx-1 my-1"
                onClick={ ()=> {setValue("book_p1",'สำเนาใบอนุญาตขับรถยนต์ตลอดชีพ' ); MySwal.close();} }
            >ขับรถยนต์ตลอดชีพ</button><br />
            <button className="btn btn-warning mx-1 my-1"
                onClick={ ()=> {setValue("book_p1",'สำเนาใบอนุญาตขับรถจักรยานยนต์ชั่วคราว' ); MySwal.close();} }
            >ขับรถจักรยานยนต์ชั่วคราว</button>
            <button className="btn btn-warning mx-1 my-1"
                onClick={ ()=> {setValue("book_p1",'สำเนาใบอนุญาตขับรถจักรยานยนต์ส่วนบุคคล' ); MySwal.close();} }
            >ขับรถจักรยานยนต์ส่วนบุคคล</button>
            <button className="btn btn-warning mx-1 my-1"
                onClick={ ()=> {setValue("book_p1",'สำเนาใบอนุญาตขับรถจักรยานยนต์ตลอดชีพ' ); MySwal.close();} }
            >ขับรถจักรยานยนต์ตลอดชีพ</button><br />
            <button className="btn btn-warning mx-1 my-1"
                onClick={ ()=> {setValue("book_p1",'สำเนาข้อมูลใบอนุญาตขับขี่รถ กรมการขนส่งทางบก' ); MySwal.close();} }
            >สำเนาข้อมูลใบอนุญาตขับขี่รถ กรมการขนส่งทางบก</button>
        </>
        ,showConfirmButton: false, width:'80%', });
}
const book_name_set = () => {

    const butt_click = (value) =>{
        setValue("book_name",value.book_name );
        setValue("book_posi1",value.book_posi1 );
        setValue("book_posi2",value.book_posi2 );
        MySwal.close();
    }

    if(bookname.length > 0){
    MySwal.fire({ title:'เลือกผู้ลงนาม',
        html:<>
        <div className="table-responsive">
            <table className="table table-bordered table-sm">
            <thead><tr>
                <th scope="col">#</th>
                <th scope="col" style={{width:"30%"}} >ชื่อ - สกุล</th>
                <th scope="col">ตำแหน่ง</th>
                <th scope="col">ตำแหน่ง (แทน)</th>
                <th scope="col">หมายเหตุ</th>
            </tr></thead>
            <tbody>
            {bookname.map((value, index) => ( <tr key={index} >
                <th scope="row"> {index + 1} </th>
                <td> {value.book_name} </td>
                <td> {value.book_posi1 ? value.book_posi1.substring(0, 15) + '....' : null} </td>
                <td> {value.book_posi2 ? value.book_posi2.substring(0, 15) + '....' : null} </td>
                <td> <button className='btn btn-dark' onClick={()=>butt_click(value)}>เลือก</button> </td>
            </tr> ))}
            </tbody>
            </table>
        </div>
        </>
        ,showConfirmButton: false, width:'80%', });
    } else { MySwal.fire({ title:'ไม่พบข้อมูล',icon: 'error', timer: 3000  }); }
}

return (<>
    <div className='row justify-content-center mt-3 font-saraban'>
    <div className='col-6 text-center'>
            <h4>หนังสือพักใช้ใบอนุญาตขับรถ </h4>
        <div className="input-group">
            <div className="input-group-prepend">
            <span className="input-group-text"> ระบุเลขคดีดำ </span>
            </div>
            <input type="text" className="form-control" style={{ textAlign: 'center' }} 
            onKeyDown={handleKeyDown} id="search_input" />
            <button className='btn btn-dark mx-1' onClick={ ()=> handleSearch() } > ค้นหา </button>
        </div>
    </div>
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

                <label htmlFor="Redcase">หมายเลขคดีแดง </label>
                <input type="text" className="form-control" name="Redcase"  
                    {...register("Redcase")} />
                    
                <label htmlFor="Plaintiff">โจทก์</label>
                <textarea  type="text" className="form-control" name="Plaintiff"    
                    {...register("Plaintiff")} />

                <label htmlFor="Defendant">จำเลย</label>
                <textarea  type="text" className="form-control text-primary" name="Defendant"    
                    {...register("Defendant")} />

                <label htmlFor="Plaint">ข้อหา</label>
                <textarea  type="text" className="form-control" name="Plaint"  
                    {...register("Plaint")} />
                    <button className="form-control btn btn-success mt-2" type="submit">สร้างเอกสาร</button>
            </div>
            
            <div className='col-7 bg-light'> 

                <p className='bg-dark text-light mt-2'> -- ข้อมูลเอกสาร -- </p>
                <div className='row'>
                    <div className='col-5'>
                        <label htmlFor="Topic">เรื่อง</label>
                        <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                            onClick={ ()=>setValue("Topic",'แจ้งคำสั่งพักใช้ใบอนุญาตขับรถ' ) } >[พักใช้]</button>
                        <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                            onClick={ ()=>setValue("Topic",'แจ้งคำสั่งเพิกถอนใบอนุญาตขับรถ' ) } >[เพิกถอน]</button>
                        <input  type="text" className="form-control" name="Topic"    
                        {...register("Topic")} />
                        <label htmlFor="Sendto">เรียน</label>
                        <input  type="text" className="form-control text-primary" name="Sendto"    
                        {...register("Sendto")} />
                    
                    </div>
                    <div className='col-7'>
                        <label htmlFor="book_p1">สิ่งที่ส่งมาด้วย (1)</label>
                            <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                            onClick={ ()=>book_p1_set()} >[เลือก]</button>
                        <input  type="text" className="form-control" name="book_p1"    
                        {...register("book_p1")} />
                        {/* <label htmlFor="book_p2">สิ่งที่ส่งมาด้วย (2)</label> */}
                        <input  type="text" className="form-control mt-1" name="book_p2"    
                        {...register("book_p2")} />
                        
                    </div>

                    <div className='col-12 mt-1'> 
                    <label htmlFor="book_detail">คำสั่งศาล .
                    <span className='bg-dark text-light'> ***กรุณาตรวจสอบคำสั่งศาล***</span></label>
                        <textarea type="text" className="form-control text-danger" name="book_detail"  rows={4}
                            {...register("book_detail")} />
                    </div>
                    <div className='col-5 mt-2'>
                        <label htmlFor="book_name">ลงนามหนังสือ</label>
                        <button className="btn btn-outline-dark btn-sm mx-1" type="button"
                            onClick={ ()=>book_name_set()} >[เลือก]</button>
                        <input  type="text" className="form-control" name="book_name"    
                        {...register("book_name")} />
                    </div>
                    <div className='col-7 mt-3'>
                        <label htmlFor="book_posi1">ตำแหน่ง (ปฏิบัติราชการ)</label>
                        <input  type="text" className="form-control" name="book_posi1"    
                        {...register("book_posi1")} />
                        <label htmlFor="book_posi2">ตำแหน่ง (แทน)</label>
                        <input  type="text" className="form-control" name="book_posi2"    
                        {...register("book_posi2")} />
                    </div>
                   
                </div>

            </div>

    </div>
    </div>
    </form>

    </>) ;
}


export default Fill_driving_li;