import { useState ,useEffect} from 'react'
import { useForm } from "react-hook-form";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';
import Service from "../../../src/services/case160.service";
import { convertDate } from "../../../src/services/convert_text.service";

const MySwal = withReactContent(Swal);
const URL_host = `http://${window.location.host}`;

const Fill_Social = () => {
const { register, handleSubmit, reset, setValue, getValues   } = useForm();
const [caseresult, setCaseresult] = useState([]);
const [zonedata1, setZonedata1] = useState(false);
const [zonedata2, setZonedata2] = useState(false);
const [zonedata3, setZonedata3] = useState(false);
const [zonedata4, setZonedata4] = useState(false);
const [zonedata5, setZonedata5] = useState(false);
const [searchid, setSearchid] = useState(false);
const [idresult, setIdresult] = useState([]);


useEffect(()=>{
    if(idresult.length > 0){
        let def_detail = JSON.parse(idresult[0].def_detail1);
        for (const [name, value] of Object.entries(def_detail)) {
            if(value.length > 0 || value){ setValue(name,value); }
        }
    } 
},[idresult,setValue]);

useEffect(()=>{
    if(caseresult.caseId){

        const options = { year: "numeric", month: "long", day: "numeric", timeZone: "Asia/Bangkok" };
        let day_book = new Date().toLocaleDateString('th-TH', options);

        setValue("Blackcase", caseresult.caseId.blackFullCaseName);
        setValue("Redcase", caseresult.caseId.redFullCaseName); 
        setValue("Plaintiff",caseresult.caseId.prosDesc);
        setValue("Defendant",caseresult.caseId.accuDesc || '-');
        setValue("def16",caseresult.caseId.alleDesc);
        setValue("def22",caseresult.caseId.alleDesc);
        setValue("Dateclaim",day_book);
        setValue("Remark_def",'ถนัดงานด้านนี้');
        setValue("def1",'ไทย');
        setValue("def2",'ไทย');
        setValue("def15",'รวมจำคุก     เดือนปรับ         บาท โทษจำคุกรอการลงโทษไว้มีกำหนด     ปี');
        setValue("def20",'พนักงานคุมประพฤติ');
        setValue("def_check4",true);
        setValue("def_check5",true);

        // setValue("def30",day_book); setValue("def31",day_book);
        setValue("def_check13",true);
        setValue("def_check16",true);
        setValue("def_check51",true);
    } 
},[caseresult,setValue]);

const handleSearch = () => {
    reset();
    setCaseresult([]); setIdresult([]);
    MySwal.fire({ html : <div>
      <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
      <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });

    let search_input = document.getElementById('search_input').value ;
    let caseBlack = search_input.length > 0 ? search_input : null ;
    let id_case = searchid ? search_input : 0 ;

    if( caseBlack.length > 0 ){
        let Service_call
        if(searchid){
        Service_call = Service.view_SocialWithCase(id_case,1);
        Service_call
            .then( res =>{
                if(res){
                    setIdresult(res.data);
                    setZonedata1(true);
                    setZonedata2(false);
                    setZonedata3(false);
                    setZonedata4(false);
                    setZonedata5(false);
                    MySwal.close();
                } else { throw new Error(); }
            }).catch( err => {
                MySwal.fire({ title:'ไม่พบข้อมูล',html:<div><h6>{err.message}</h6></div>,icon: 'error', timer: 3000  });
                setZonedata1(false);
                setZonedata2(false);
                setZonedata3(false);
                setZonedata4(false);
                setZonedata5(false);
                setIdresult([]);
            });
        } else {

            let TopicCase = caseBlack.match(/[ก-๙a-zA-Z.\s]+/);
            if (!TopicCase) { MySwal.fire({ title: 'ไม่พบข้อมูลคดี', icon: 'error', timer: 3000 }); return; }
            TopicCase = TopicCase[0].trim();
            let numCase = caseBlack.match(/\d+/g);
            if (numCase) { numCase = [TopicCase, ...numCase]; } 
            else { MySwal.fire({ title: 'ไม่พบข้อมูลคดี', icon: 'error', timer: 3000 }); return; }
            if (numCase.length !== 3) { MySwal.fire({ title: 'ไม่พบข้อมูลคดี', icon: 'error', timer: 3000 }); return; }
            if (numCase[2].length !== 4) { MySwal.fire({ title: 'ระบุปี 4 หลัก', icon: 'error', timer: 3000 }); return; }

        Service_call = Service.getSearchCase( numCase, 1 );
        Service_call.then(res => { 
            MySwal.close();
            // console.log(res);
            setCaseresult( res );
            setZonedata1(true);
            setZonedata2(false);
            setZonedata3(true);
            setZonedata4(false);
            setZonedata5(false);
        }).catch(error => { 
            console.log(error);
            setCaseresult(error);
            MySwal.fire({  title:'ไม่พบข้อมูลคดี', html : <div> <h6> {error.message} </h6> </div>,icon: 'error',timer: 3000  });
            setZonedata1(false);
            setZonedata2(false);
            setZonedata3(false);
            setZonedata4(false);
            setZonedata5(false);
        });
        }

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
    Service.getReport_Socialser1(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))

}

const onSubmitdata2 = () =>{
    const data = getValues();
    MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    Service.getReport_Socialser2(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))
}

const onSubmitdata3 = () =>{
    const data = getValues();
    // console.log(data);
    MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    Service.getReport_Socialser3(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))
}

const onSubmitdata4 = () => {
    const data = getValues();
    if(!data.Defendant_name){
        MySwal.fire({ title: `ระบุข้อมูลจำเลยเพิ่มเติม` , icon: 'error',showConfirmButton: false, timer: 3000 });
    } else {
    Service.add_Socialser1(data).then(res => { 
        MySwal.fire({ title: `บันทึกสำเร็จเป็น ID : ${res.data}` , icon: 'success',showConfirmButton: false, timer: 3000 });
    }).catch(err => { console.log(err.response.data); } );
    }
}

const Detailclick = async (data) => {
    
    if(data){
        let address_text;
        let data_adrr = data.litigantAddressModel[0] || null ;

        if(data_adrr && data_adrr.litigantSubdistrictId){
            address_text = await Service.getSubdistricts(data_adrr.litigantSubdistrictId);
        }
        if(data.litigantBirthDate){
            let dateComponents = convertDate(data.litigantBirthDate).date;
            let dateComponents2 = convertDate(data.litigantBirthDate).date2;
            dateComponents = dateComponents.split(" ");
            setValue("def4",dateComponents[0]);
            setValue("def5",dateComponents[1]);
            setValue("def6",dateComponents[2]);
            setValue("def24_2", dateComponents2);
        }

        let houseno_fill = data_adrr ? data_adrr.litigantAddress || '' : '';
        let street_fill = data_adrr ? data_adrr.litigantRoad || '' : '';
        let squad_fill = data_adrr ? data_adrr.litigantMoo || '' : '';
        let alley_fill = data_adrr ? data_adrr.litigantSoi || '' : '';
        let canton_fill = address_text ? address_text.subdistrictName || '' : '';
        let district_fill = address_text ? address_text.districtName || '' : '';
        let province_fill = address_text ? address_text.provinceName || '' : '';
        let age_fill = data ? data.litigantAge || '' : '';

        setValue("Defendant_name",data.litigantName );
        setValue("def21",data.litigantName);
        setValue("def7",age_fill);
        setValue("def2",data.nation || 'ไทย');
        setValue("def3",data.career || 'รับจ้าง');
        setValue("def8", houseno_fill);
        setValue("def8_2",squad_fill);
        setValue("def9",street_fill);
        setValue("def10",alley_fill);
        setValue("def11",canton_fill);
        setValue("def12",district_fill);
        setValue("def13",province_fill);
        setValue("def14",data.litigantTelModel[0]?.litigantTel || '');
        if(data.litigantSex === 1){ setValue("def_check11",true); } else {  setValue("def_check12",true); }
    }
}

const CreateFillform = (props) => {
    let data = (props.data);
    data = data.filter((item) => item.orderNo !== 0 && item.personTypeId !== 11);
    if(data.length > 0){
    return(<>
    <div className='row justify-content-center '>
    { data.map((value, index) => ( 
    <div className='col-3 text-center mb-2' key={index}>
    <div className="card">
        <div className="card-header bg-primary text-light">
        { value.litigantName }
        </div>
        <div className="card-body bg-light">
        <button className="btn btn-primary"
            onClick={() => { 
                Detailclick(value); 
                setZonedata3(false); 
            }}
        >เลือก</button>
        </div>
    </div>
    </div> ))}
    </div>
    </>);
    }

}

const handleKeyDown = (event) => { if (event.keyCode === 13) { handleSearch(); } }

return (<>

    <div className='row justify-content-center mt-3 font-saraban'>
    <div className='col-1'>
        <a className='btn btn-outline-dark mt-3' 
        href={`${URL_host}/smkc-react-app/fillwarrant/view_ss?type_id=1`} target="_blank" rel="noopener noreferrer">
        แสดง ID คำร้อง </a>
    </div>
    <div className='col-1'>
    <button className='btn btn-outline-info mt-3' 
        onClick={ ()=>{ setSearchid(!searchid) } }
        > { searchid ? 'ค้นหา คดีดำ' : 'ค้นหาด้วย ID'} </button>
    </div>
    <div className='col-5 text-center mb-2'>
        <h4>หนังสือบริการสังคมแทนค่าปรับ คำร้อง บ.ส.1 และ บ.ส.2 </h4>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text"> { searchid ? 'ระบุเลข ID' : 'ระบุเลขคดีดำ'} </span>
        </div>
        <input type="text" className="form-control" style={{ textAlign: 'center' }} 
        onKeyDown={handleKeyDown} id="search_input" />
        <button className='btn btn-dark mx-1' onClick={ ()=> handleSearch() } > ค้นหา </button>
      </div>
      </div>

    { zonedata3 && caseresult.caseLit && <CreateFillform data={ caseresult.caseLit }/> }
    </div>
    
    <form onSubmit={handleSubmit(onSubmit)}>
    <div className="form-group">
    <div className='row font-saraban'>
            <div className='col-1'></div>
            <div className='col-3'>

            <label htmlFor="Blackcase">หมายเลขคดีดำ </label>
            <input type="text" className="form-control" name="Blackcase"  
                {...register("Blackcase")} />

            <label htmlFor="Redcase">หมายเลขคดีแดง</label>
            <input type="text" className="form-control text-danger" name="Redcase"  
                {...register("Redcase")} />

            <label htmlFor="Datedecide">วันที่คำร้อง</label>
            <input type="text" className="form-control text-danger" name="Datedecide"  
                {...register("Dateclaim")} />

            <label htmlFor="Plaintiff">โจทก์</label>
            <textarea  type="text" className="form-control" name="Plaintiff" rows="1"    
                {...register("Plaintiff")} />

            <label htmlFor="Defendant">จำเลย</label>
            <textarea  type="text" className="form-control" name="Defendant" rows="1"    
                {...register("Defendant")} />

            <label htmlFor="Remark_def">เหตุผล</label>
            <input  type="text" className="form-control" name="Remark_def"  
                {...register("Remark_def")} />

            <div className="form-check">

            <input className="form-check-input" type="checkbox" value="" name="def_check1" 
                {...register("def_check1", {})} />
            <label className="form-check-label" htmlFor="def_check1"> 
                งานช่วยเหลือดูแลอำนวยความสะดวกฯ </label>
            </div><div className="form-check">

            <input className="form-check-input" type="checkbox" value="" name="def_check2" 
                {...register("def_check2", {})} />
            <label className="form-check-label" htmlFor="def_check2"> 
                งานวิชาการ ด้านการศึกษาฯ </label>

            </div><div className="form-check">
            <input className="form-check-input" type="checkbox" value="" name="def_check3" 
                {...register("def_check3", {})} />
            <label className="form-check-label" htmlFor="def_check3"> 
                งานวิชาขีพ ช่างฝีมือ ฯ </label>

            </div><div className="form-check">
            <input className="form-check-input" type="checkbox" value="" name="def_check4"  
                {...register("def_check4", {})} />
            <label className="form-check-label" htmlFor="def_check4"> 
                งานบริการสังคมฯ </label>

            </div>
            <div className='row'>
            <div className='col-6'>
                <button className="form-control btn btn-success mt-1" type="submit">พิมพ์ บ.ส.1</button>
                <button className="form-control btn btn-success mt-1" type="button"
                onClick={ ()=> onSubmitdata3()}
                >พิมพ์ บ.ส.3</button>
            </div>
            <div className='col-6'>
            <button className="form-control btn btn-success mt-1" type="button"
                onClick={ ()=> onSubmitdata2()}
                >พิมพ์ บ.ส.2</button>
            <button className="form-control btn btn-outline-success mt-1" type="button"
                onClick={ ()=> onSubmitdata4()}
                >เก็บข้อมูล</button>
            </div>
            </div>
            </div>
            
            <div className='col-7 bg-light'>
                <button className={ zonedata1 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'} type="button"
                onClick={ ()=> {
                    setZonedata1(!zonedata1);
                    setZonedata2(false);
                    setZonedata4(false);
                    setZonedata5(false);
                    } } > ข้อมูลจำเลย </button>
                <button className={ zonedata2 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'}  type="button"
                onClick={ ()=> {
                    setZonedata1(false);
                    setZonedata2(!zonedata2);
                    setZonedata4(false);
                    setZonedata5(false);
                    } } > ข้อมูลคำสั่งศาล </button>
                <button className={ zonedata4 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'}  type="button"
                onClick={ ()=> {
                    setZonedata1(false);
                    setZonedata2(false);
                    setZonedata4(!zonedata4);
                    setZonedata5(false);
                    } } > ข้อมูล บ.ส.2</button>
                <button className={ zonedata5 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'}  type="button"
                onClick={ ()=> {
                    setZonedata1(false);
                    setZonedata2(false);
                    setZonedata4(false);
                    setZonedata5(!zonedata5);
                    } } > ข้อมูล บ.ส.2 (ต่อ)</button>

            { zonedata1 && <>
            <p className='bg-dark text-light mt-2'> -- ข้อมูลจำเลย -- </p>
            <label htmlFor="Defendant_name">ชื่อจำเลย***</label>
            <input  type="text" className="form-control" name="Defendant_name"    
                {...register("Defendant_name")} />
                
       
            <div className='row'>
            <div className='col-2'>

            <label htmlFor="def1">เชื้อชาติ</label>
            <input type="text" className="form-control" name="def1" 
                {...register("def1")} />
            <label htmlFor="def7">อายุ </label>
            <input type="text" className="form-control" name="def7" 
                {...register("def7")} />
            </div>

            <div className='col-2'>
            <label htmlFor="def2">สัญชาติ</label>
            <input type="text" className="form-control" name="def2"  
                {...register("def2")} />
            <label htmlFor="def4">เกิดวันที่</label>
            <input type="text" className="form-control" name="def4"  
                {...register("def4")} />
            </div>
            
            <div className='col-5'>
            <label htmlFor="def3">อาชีพ</label>
            <input type="text" className="form-control" name="def3"  
                {...register("def3")} />

            <label htmlFor="def5">เดือน</label>
            <input type="text" className="form-control" name="def5"  
                {...register("def5")} />
            </div>

            <div className='col-3'>
            <br /><hr />
            <label htmlFor="def6">พ.ศ. </label>
            <input type="text" className="form-control mt-1" name="def6"  
                {...register("def6")} />

            </div>

            <div className='col-2'>
            <label htmlFor="def8">บ้านเลขที่</label>
            <input type="text" className="form-control" name="def8"  
                {...register("def8")} />
             <label htmlFor="def8_2">หมู่ที่</label>
            <input type="text" className="form-control" name="def8_2"  
                {...register("def8_2")} />
            </div>

            <div className='col-5'>
            <label htmlFor="def9">ถนน</label>
            <input type="text" className="form-control" name="def9"  
                {...register("def9")} />
            <label htmlFor="def11">ตำบล/แขวง</label>
            <input type="text" className="form-control" name="def11"  
                {...register("def11")} />
            <label htmlFor="def13">จังหวัด</label>
            <input type="text" className="form-control" name="def13"  
                {...register("def13")} />
            </div>

            <div className='col-5'>
            <label htmlFor="def10">ตรอก/ซอย</label>
            <input type="text" className="form-control" name="def10"  
                {...register("def10")} />
            <label htmlFor="def12">อำเภอ/เขต</label>
            <input type="text" className="form-control" name="def12"  
                {...register("def12")} />
            <label htmlFor="def14">โทรศัพท์</label>
            <input type="text" className="form-control" name="def14"  
                {...register("def14")} />

            </div>

            </div>


            </> }

            { zonedata2 && <>
            <p className='bg-dark text-light mt-2'> -- ข้อมูลคำสั่งศาล -- </p>

            <label  htmlFor="def15">ศาลพิพากษาลงโทษ***</label>
            <textarea  type="text" className="form-control text-danger" name="def15" rows="1"  
                {...register("def15")} />
            <label  htmlFor="def16">ความผิดฐาน***</label>
            <textarea  type="text" className="form-control" name="def16" rows="1"    
                {...register("def16")} />
                
       
            <div className='row'>
            
            <div className='col-6 mt-2'>
            <div className="form-check">
            <input className="form-check-input" type="checkbox" name="def_check5"  
                {...register("def_check5", {})} />
            <label className="form-check-label" htmlFor="def_check5"> 
                อนุญาตให้จำเลยบริการสังคมฯ </label>
            </div>

            <div className='row'>
            <div className='col-6 mt-2'>
            <label htmlFor="def17">อนุญาตฯ (วัน)***</label>
            <input type="text" className="form-control" name="def17"  
                {...register("def17")} />
            <label htmlFor="def18">ให้เริ่มทำงานภายใน(วัน)</label>
            <input type="text" className="form-control" name="def18"  
                {...register("def18")} />
            <label htmlFor="def18_2">ต้องขังมาแล้ว (วัน)***</label>
            <input type="text" className="form-control" name="def18_2"
            {...register("def18_2")} />
            </div>

            <div className='col-6 mt-2'>
            <label htmlFor="def19">รวมเป็น (ชั่วโมง)***</label>
            <input type="text" className="form-control" name="def19"  
                {...register("def19")} />
            <label htmlFor="def20">ภายใต้การดูแล</label>
            <input type="text" className="form-control" name="def20" 
                {...register("def20")} />
            </div>
            </div>

            <h6 className='text-muted mt-3'>*** คือ รายละเอียดที่แสดงใน บ.ส.3</h6>

            
            </div>

            <div className='col-6 mt-2'>
            <div className="form-check">
            <input className="form-check-input" type="checkbox" name="def_check6" 
                {...register("def_check6", {})} />
            <label className="form-check-label" htmlFor="def_check6"> 
                ยกคำร้อง เนื่องจาก </label>
            </div><div className="form-check">
            <input className="form-check-input" type="checkbox" name="def_check7" 
                {...register("def_check7", {})} />
            <label className="form-check-label" htmlFor="def_check7"> 
                จำเลยสามารถที่จะชำระค่าปรับได้ </label>
            </div><div className="form-check">
            <input className="form-check-input" type="checkbox" name="def_check8" 
                {...register("def_check8", {})} />
            <label className="form-check-label" htmlFor="def_check8"> 
                โดยสภาพความผิดแล้วไม่สมควรอนุญาต </label>
            </div><div className="form-check">
            <input className="form-check-input" type="checkbox" name="def_check9"  
                {...register("def_check9", {})} />
            <label className="form-check-label" htmlFor="def_check9"> 
                อื่น ๆ </label>
            </div>
            <label htmlFor="def18_3">คงต้องชำระค่าปรับอีก (บาท)***</label>
                <input type="text" className="form-control" name="def18_3" 
                {...register("def18_3")} />
            </div>


            </div>

            </> }

            { zonedata4 && <>
            <p className='bg-dark text-light mt-2'> -- ข้อมูล บ.ส.2 -- </p>

            <div className='row'>
            <div className='col-8'>
            <label  htmlFor="def21">ชื่อจำเลย</label>
            <textarea  type="text" className="form-control" name="def21" rows="1"  
                {...register("def21")} />
            <label  htmlFor="def22">ความผิดฐาน</label>
            <textarea  type="text" className="form-control" name="def22" rows="1"    
                {...register("def22")} />

            <br />
            <span> - เพศ : </span>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check11"  
                {...register("def_check11", {})} />
            <label className="form-check-label" htmlFor="def_check11"> 
                ชาย </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check12"  
                {...register("def_check12", {})} />
            <label className="form-check-label" htmlFor="def_check12"> 
                หญิง </label>
            </div>
            
            <span> | - สัญชาติ : </span>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check13"  
                {...register("def_check13", {})} />
            <label className="form-check-label" htmlFor="def_check13"> 
                ไทย </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check14"  
                {...register("def_check14", {})} />
            <label className="form-check-label" htmlFor="def_check14"> 
                จีน </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check15"  
                {...register("def_check15", {})} />
            <label className="form-check-label" htmlFor="def_check15"> 
                อื่น ๆ </label>
            </div>
            <br />
            <span> - ศาสนา : </span>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check16"  
                {...register("def_check16", {})} />
            <label className="form-check-label" htmlFor="def_check16"> 
                พุทธ </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check17"  
                {...register("def_check17", {})} />
            <label className="form-check-label" htmlFor="def_check17"> 
                คริสต์ </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check18"  
                {...register("def_check18", {})} />
            <label className="form-check-label" htmlFor="def_check18"> 
                อิสลาม </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check19"  
                {...register("def_check19", {})} />
            <label className="form-check-label" htmlFor="def_check19"> 
                อื่น ๆ </label>

            </div>

            </div>

            <div className='col-3'>
            <label htmlFor="def24_2">เกิดวันที่ (พิมพ์ย่อ)</label>
            <input type="text" className="form-control" name="def24_2"  
                {...register("def24_2")} />
            <label htmlFor="def23">เกิดที่อำเภอ</label>
            <input type="text" className="form-control" name="def23"  
                {...register("def23")} />
            <label htmlFor="def24">เกิดที่จังหวัด</label>
            <input type="text" className="form-control" name="def24"  
                {...register("def24")} />
            </div>

            <div className='col-12 mt-1'>
            <hr />
            <span> - การศึกษาสูงสุด : </span>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check20"  
                {...register("def_check20", {})} />
            <label className="form-check-label" htmlFor="def_check20"> 
                ไม่รู้หนังสือ </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check21"  
                {...register("def_check21", {})} />
            <label className="form-check-label" htmlFor="def_check21"> 
                ประถมต้นหรือ อ่านออกเขียนได้ </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check22"  
                {...register("def_check22", {})} />
            <label className="form-check-label" htmlFor="def_check22"> 
                ประถมปลาย </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check23"  
                {...register("def_check23", {})} />
            <label className="form-check-label" htmlFor="def_check23"> 
                มัธยมต้น </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check24"  
                {...register("def_check24", {})} />
            <label className="form-check-label" htmlFor="def_check24"> 
                มัธยมปลาย </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check25"  
                {...register("def_check25", {})} />
            <label className="form-check-label" htmlFor="def_check25"> 
                ปวช. ปวท. </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check26"  
                {...register("def_check26", {})} />
            <label className="form-check-label" htmlFor="def_check26"> 
                ปวส./อนุปริญญา </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check27"  
                {...register("def_check27", {})} />
            <label className="form-check-label" htmlFor="def_check27"> 
                ปริญญาตรีหรือสูงกว่า </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check28"  
                {...register("def_check28", {})} />
            <label className="form-check-label" htmlFor="def_check28"> 
                อื่น ๆ </label>
            </div>
            <hr />

            <span> - อาชีพ : </span>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check29"  
                {...register("def_check29", {})} />
            <label className="form-check-label" htmlFor="def_check29"> 
                นักเรียน นักศึกษา </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check30"  
                {...register("def_check30", {})} />
            <label className="form-check-label" htmlFor="def_check30"> 
                ข้าราชการ/ลูกจ้าง (ราชการ/รัฐวิสาหกิจ) </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check31"  
                {...register("def_check31", {})} />
            <label className="form-check-label" htmlFor="def_check31"> 
                พนักงาน/ลูกจ้าง (บริษัท) </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check32"  
                {...register("def_check32", {})} />
            <label className="form-check-label" htmlFor="def_check32"> 
                ค้าขาย </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check33"  
                {...register("def_check33", {})} />
            <label className="form-check-label" htmlFor="def_check33"> 
                รับจ้าง </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check34"  
                {...register("def_check34", {})} />
            <label className="form-check-label" htmlFor="def_check34"> 
                เกษตรกร </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check35"  
                {...register("def_check35", {})} />
            <label className="form-check-label" htmlFor="def_check35"> 
                อาชีพอิสระ </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check36"  
                {...register("def_check36", {})} />
            <label className="form-check-label" htmlFor="def_check36"> 
                อาชีพบันเทิง </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check37"  
                {...register("def_check37", {})} />
            <label className="form-check-label" htmlFor="def_check37"> 
                อาชีพเกี่ยวกับอบายมุข </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check38"  
                {...register("def_check38", {})} />
            <label className="form-check-label" htmlFor="def_check38"> 
                อาชีพไม่เป็นกิจจะลักษณะ </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check39"  
                {...register("def_check39", {})} />
            <label className="form-check-label" htmlFor="def_check39"> 
                ไม่มีอาชีพ </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check40"  
                {...register("def_check40", {})} />
            <label className="form-check-label" htmlFor="def_check40"> 
                อื่น ๆ </label>
            </div>
            <hr />

            <div className='row pb-3'>
                <div className='col-6'>
                <label htmlFor="def25">รายได้วันละ (บาท)</label>
                <input type="text" className="form-control" name="def25"  
                {...register("def25")} />
                </div>
                <div className='col-6'>
                <label htmlFor="def26">รายได้เดือนละ (บาท)</label>
                <input type="text" className="form-control" name="def26"  
                {...register("def26")} />
                </div>
            </div>
            </div>

            </div>
            </> }

            { zonedata5 && <>
            <p className='bg-dark text-light mt-2'> -- ข้อมูล บ.ส.2 (ต่อ) -- </p>

            <div className='row'>

            <div className='col-12'>
            <span> - สถานภาพการสมรส : </span>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check41"  
                {...register("def_check41", {})} />
            <label className="form-check-label" htmlFor="def_check41"> 
                โสด </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check42"  
                {...register("def_check42", {})} />
            <label className="form-check-label" htmlFor="def_check42"> 
                จดทะเบียนสมรส </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check43"  
                {...register("def_check43", {})} />
            <label className="form-check-label" htmlFor="def_check43"> 
                ไม่ได้จดทะเบียนสมรส </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check44"  
                {...register("def_check44", {})} />
            <label className="form-check-label" htmlFor="def_check44"> 
                อยู่กินฉันสามีภรรยา </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check45"  
                {...register("def_check45", {})} />
            <label className="form-check-label" htmlFor="def_check45"> 
                หย่าร้าง เลิกร้าง </label>
            </div>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check46"  
                {...register("def_check46", {})} />
            <label className="form-check-label" htmlFor="def_check46"> 
                หม้าย </label>
            </div>
            <div className='row'>
                <div className='col-4'>
                <label htmlFor="def27">อาชีพคู่สมรส</label>
                <input type="text" className="form-control" name="def27"  
                {...register("def27")} />
                </div>
                <div className='col-4'>
                <label htmlFor="def28">รายได้วันละ (บาท)</label>
                <input type="text" className="form-control" name="def28"  
                {...register("def28")} />
                </div>
                <div className='col-4'>
                <label htmlFor="def29">รายได้เดือนละ (บาท)</label>
                <input type="text" className="form-control" name="def29"  
                {...register("def29")} />
                </div>
            </div>

            <hr />
            <div className='row'>
                <div className='col-6'>
                    <label htmlFor="def30">กระทำความผิดเมื่อ</label>
                    <input type="text" className="form-control" name="def30"  
                    {...register("def30")} />
                </div>
                <div className='col-6'>
                    <label htmlFor="def31">จับกุม/มอบตัวเมื่อ</label>
                    <input type="text" className="form-control" name="def31"  
                    {...register("def31")} />
                </div>                

                <div className='col-6 mt-1'>
                    <span>การควบคุมตัว</span>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check47"  
                        {...register("def_check47", {})} />
                        <label className="form-check-label" htmlFor="def_check47"> 
                        ได้รับการปล่อยตัวชั่วคราวตั้งแต่ถูกจับกุม </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check48"  
                        {...register("def_check48", {})} />
                        <label className="form-check-label" htmlFor="def_check48"> 
                        ต้องขัง (วัน)</label>
                        <input type="text" className="form-control" name="def32"  
                        {...register("def32")} />

                    <label htmlFor="def33">ต้องขังที่</label>
                    <input type="text" className="form-control" name="def33"  
                        {...register("def33")} />

                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" name="def_check49"  
                        {...register("def_check49", {})} />
                        <label className="form-check-label" htmlFor="def_check49"> 
                        ในระหว่างสอบสวน </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" name="def_check50"  
                        {...register("def_check50", {})} />
                        <label className="form-check-label" htmlFor="def_check50"> 
                        ในระหว่างพิจารณาคดี </label>
                    </div>
                </div>
                <div className='col-6 mt-1'>
                    <span>ประวัติการกระทำความผิด</span>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check51"  
                        {...register("def_check51", {})} />
                        <label className="form-check-label" htmlFor="def_check51"> 
                        ไม่เคยถูกกล่าวหา หรือพิพากษาว่าได้กระทำผิดอาญา </label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" name="def_check52"  
                        {...register("def_check52", {})} />
                        <label className="form-check-label" htmlFor="def_check52"> 
                        เคยถูกดำเนินคดีอาญา </label>
                    </div>
                </div>

            </div>

            </div>



            </div>
            </> }

            </div>
            
    </div>
    </div>
    </form>
    

    </>) ;
}


export default Fill_Social;