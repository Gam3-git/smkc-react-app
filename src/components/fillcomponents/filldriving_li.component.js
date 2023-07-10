import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import Service from "../../../src/services/case160.service";
import { convertDate } from "../../../src/services/convert_text.service";

const MySwal = withReactContent(Swal);

const Fill_driving_li = () => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [caseresult, setCaseresult] = useState([]);


useEffect(()=>{
    if( caseresult.caseId ){
        
        const options = { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Bangkok" };
        
        let day_book = new Date().toLocaleDateString('th-TH', options);
        let dd = day_book.split(' ');
        day_book = `วันที่  ${dd[0]}  เดือน  ${dd[1]}  พ.ศ.  ${dd[2]} `;

        let day_decide = convertDate( caseresult.caseRed.judgeDate ).date;
        let detail_text = `คดีนี้ ศาลมีคำสั่งให้พักใช้ใบอนุญาตขับขี่รถของจำเลย มีกำหนด 6 เดือน นับแต่วันที่ ${day_decide} เป็นต้นไป รายละเอียดใบอนุญาตขับรถปรากฏตามสิ่งที่ส่งมาด้วย`;

        setValue("Daybook",day_book);
        setValue("Blackcase", caseresult.caseId.blackFullCaseName);
        setValue("Redcase", caseresult.caseId.redFullCaseName); 
        setValue("Plaintiff",caseresult.caseId.prosDesc);
        setValue("Defendant",caseresult.caseId.accuDesc);
        setValue("Plaint",caseresult.caseId.alleDesc);
        setValue("book_detail",detail_text );
        setValue("Topic",'แจ้งคำสั่งพักใช้ใบอนุญาตขับรถ');
        setValue("Sendto",'ขนส่งจังหวัดสมุทรสงคราม');
        setValue("book_p1",'สำเนาใบอนุญาตขับรถยนต์ส่วนบุคคล');
        setValue("book_p2",`ของ ${caseresult.caseId.accuDesc} จำนวน 1 ฉบับ`);
    } 
},[ caseresult,setValue ]);

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