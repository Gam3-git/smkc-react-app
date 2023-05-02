import { useState ,useEffect} from 'react'
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';
import Service from "../../../src/services/caseaccess.service";
import {convertDate} from "../../../src/services/convert_text.service";

const MySwal = withReactContent(Swal);
const URL_host = `http://${window.location.host}`;

const Fill_casefinal = () => {

const { register, handleSubmit, reset, setValue,  getValues } = useForm();
const [caseresult, setCaseresult] = useState({});
const [dbtime, setDbtime] = useState('');
const [zonedata1, setZonedata1] = useState(false);
const [zonedata2, setZonedata2] = useState(false);
const [zonedata3, setZonedata3] = useState(false);
const [zonedata4, setZonedata4] = useState(false);
const [zonedata5, setZonedata5] = useState(false);
const [zonedata6, setZonedata6] = useState(false);
const [searchid, setSearchid] = useState(false);
const [idresult, setIdresult] = useState({});

useEffect(()=>{
    Service.getChk_db().then(res => {
        setDbtime(res.data.message);
    }).catch(err => console.error(err))
},[]);

useEffect(()=>{
    if(caseresult.length > 0){
        let day_book = convertDate(new Date()).date;
        let redcase = caseresult[0].rednum ? `${caseresult[0].casetext}${caseresult[0].rednum}/${caseresult[0].redyear}` : '-';

        setValue("Blackcase",caseresult[0].blackcase);
        setValue("Redcase",redcase);
        setValue("Dateclaim",day_book);
        setValue("Plaintiff",caseresult[0].plaintiff);
        setValue("Defendant",caseresult[0].defendant);

        setValue("def66",'ไทย');
        // setValue("def_check2",true);
        setValue("def_check4",true);
        setValue("def_check5",true);
        setValue("def_check13",true);
        setValue("def_check16",true);
        setValue("def_check49",true);
        setValue("def_check51",true);
        // setValue("def_check55",true);
    } 
},[caseresult,setValue]);

useEffect(()=>{
    if(idresult.length > 0){
        let def_detail = JSON.parse(idresult[0].def_detail1);
        for (const [name, value] of Object.entries(def_detail)) {
            if(value.length > 0 || value){ setValue(name,value); }
        }
    } 
},[idresult,setValue]);

const handleSearch = () => {
    reset();
    let search_input = document.getElementById('search_input').value ;
    let text_search = search_input.length > 0 ? search_input : null ;
    if(text_search === null){ return MySwal.fire({ title:'ระบุข้อมูลค้นหา',icon: 'error', timer: 3000  }); }
    setCaseresult({}); setIdresult({}); 

    MySwal.fire({ html : <div>
      <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
      <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });

    if(searchid){
        Service.view_SocialWithCase(text_search,4)
        .then( res =>{
            if(res){
                setIdresult(res.data);
                setZonedata1(true);
                setZonedata2(false);
                setZonedata3(false);
                setZonedata4(false);
                setZonedata5(false);
                setZonedata6(false);
                MySwal.close();
              } else { throw new Error(); }
        }).catch( err => {
            MySwal.fire({ title:'ไม่พบข้อมูล',html:<div><h6>{err.message}</h6></div>,icon: 'error', timer: 3000  });
            setZonedata1(false);
            setZonedata2(false);
            setZonedata3(false);
            setZonedata4(false);
            setZonedata5(false);
            setZonedata6(false);
            setIdresult({});
        });
    } else {
        Service.getSocialservice1(text_search)
        .then( res => {
            if(res){
                setCaseresult(res.data);
                setZonedata1(true);
                setZonedata2(false);
                setZonedata3(true);
                setZonedata4(false);
                setZonedata5(false);
                setZonedata6(false);
                MySwal.close();
              } else { throw new Error(); }
        }).catch( err =>{
            MySwal.fire({ title:'ไม่พบข้อมูล',html:<div><h6>{err.message}</h6></div>,icon: 'error', timer: 3000  });
            setZonedata1(false);
            setZonedata2(false);
            setZonedata3(false);
            setZonedata4(false);
            setZonedata5(false);
            setZonedata6(false);
            setCaseresult({});
        });
    }
}

const handleSync = () => {
    MySwal.fire({
        title: 'ต้องการ ซิงค์ข้อมูล ?', text:'(เพื่ออัพเดท ข้อมูลคดีล่าสุด)', showDenyButton: true, showCancelButton: false,
        confirmButtonText: 'Sync', denyButtonText: `Don't Sync`,
      }).then((result) => {
        if (result.isConfirmed) {
            MySwal.fire({ html : <div>
            <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
            <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 });
            Service.getSync_db().then(res => {
                MySwal.fire({ title: res.data.message , icon: 'success',showConfirmButton: false, timer: 3000 });
                setTimeout( ()=>  window.location.reload(),800);
            }).catch(err => console.error(err))
        } else if (result.isDenied) {
            MySwal.close();
        }
      })

}

const onSubmit = (data) => {
    // console.log(data);
    MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
    });
    Service.getReport_Socialser4(data).then(res => {
        MySwal.close();
    }).catch(err => console.error(err))

}

const onSubmitdata = () => {
    const data = getValues();
    if(!data.Defendant_name){
        MySwal.fire({ title: `ระบุข้อมูลจำเลยเพิ่มเติม` , icon: 'error',showConfirmButton: false, timer: 3000 });
    } else {
    Service.add_Socialser4(data).then(res => { 
        MySwal.fire({ title: `บันทึกสำเร็จเป็น ID : ${res.data}` , icon: 'success',showConfirmButton: false, timer: 3000 });
    }).catch(err => { console.log(err.response.data); } );
    }
}


const Detailclick = (data) => {
    if(data){
        let street_fill = data.street || '';
        let squad_fill = data.squad || '';
        let alley_fill = data.alley || '';
        let alley2_fill = data.alley2 || '';
        let age_fill = data.age_def !== null && data.age_def !== undefined ? data.age_def.toString() : " ";

        setValue("Defendant_name",data.defendant_name );
        setValue("def69",age_fill );
        setValue("def21",data.defidcard || '');
        setValue("def33",data.career || 'รับจ้าง');
        setValue("def24",data.houseno || '');
        setValue("def25",squad_fill);
        setValue("def27",street_fill);
        setValue("def26",alley_fill+' '+ alley2_fill);
        setValue("def28",data.canton || '');
        setValue("def29",data.district || '');
        setValue("def30",data.province || '');
        setValue("def22",data.tel || '');
        if(data.sex === 1){ setValue("def_check11",true); } else {  setValue("def_check12",true); }
    }
}

const CreateFillform = (props) => {
    let data = (props.data);
    if(data.length > 0){
    return(<>
    <div className='row justify-content-center '>
    { data.map((value, index) => ( 
    <div className='col-3 text-center mb-2' key={index}>
    <div className="card">
        <div className="card-header bg-primary text-light">
        { value.defendant_name }
        </div>
        <div className="card-body bg-light">
        {value.punish && <><p> กักขัง : {value.punish} แต่วันที่ : {convertDate(value.daypunish).date} </p></> }
        <button className="btn btn-primary"
        onClick={() => { Detailclick(value); setZonedata3(false); }}
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
        <button className='btn btn-outline-warning mt-3' onClick={ ()=> handleSync() } > ซิงค์ข้อมูล </button>
    </div>
    <div className='col-1'>
        <a className='btn btn-outline-dark mt-3' 
        href={`${URL_host}/smkc-react-app/fillwarrant/view_ss?type_id=4`} target="_blank" rel="noopener noreferrer">
        แสดง ID คำร้อง </a>
    </div>
    <div className='col-1'>
        <button className='btn btn-outline-info mt-3' 
        onClick={ ()=>{ setSearchid(!searchid) } }
        > { searchid ? 'ค้นหา คดีดำ' : 'ค้นหาด้วย ID'} </button>
    </div>
    <div className='col-6 text-center'>
        <h4>คำร้องขอปล่อยชั่วคราว ( คำร้องใบเดียว ) </h4>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{ searchid ? 'ระบุเลข ID' : 'ระบุเลขคดีดำ'} </span>
        </div>
        <input type="text" className="form-control" style={{ textAlign: 'center' }} 
        onKeyDown={handleKeyDown} id="search_input" />
        <button className='btn btn-dark mx-1' onClick={ ()=> handleSearch() } > ค้นหา </button>
      </div>
      { dbtime ?  <h6 className='text-muted mt-2'>{ dbtime }</h6>  : <h6 className='text-muted mt-2'>-</h6> } 
      </div>

    { zonedata3 && caseresult && <CreateFillform data={caseresult}/> }
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
            
            <h6 className='mt-2'> - ขอปล่อยในชั้น</h6>
            <div className="form-check form-check-inline">
            
            <input className="form-check-input" type="checkbox" value="" name="def_check1" 
                {...register("def_check1", {})} />
            <label className="form-check-label" htmlFor="def_check1"> 
                สอบสวน </label>
            </div><div className="form-check form-check-inline">

            <input className="form-check-input" type="checkbox" value="" name="def_check2" 
                {...register("def_check2", {})} />
            <label className="form-check-label" htmlFor="def_check2"> 
                พิจารณา </label>

            </div><div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" value="" name="def_check3" 
                {...register("def_check3", {})} />
            <label className="form-check-label" htmlFor="def_check3"> 
                อุทธรณ์/ฎีกา </label>

            </div>

            
            <button className="form-control btn btn-success mt-1" type="submit">คำร้องใบเดียว</button>
            <button className="form-control btn btn-outline-success mt-1" type="button"
                onClick={ ()=> onSubmitdata() }
            >เก็บข้อมูล</button>
            

            </div>
            
            <div className='col-7 bg-light'>
                <button className={ zonedata1 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'} type="button"
                onClick={ ()=> {
                    setZonedata1(!zonedata1);
                    setZonedata2(false);
                    setZonedata4(false);
                    setZonedata5(false);
                    setZonedata6(false);
                    } } > ข้อมูลจำเลย </button>
                <button className={ zonedata2 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'}  type="button"
                onClick={ ()=> {
                    setZonedata1(false);
                    setZonedata2(!zonedata2);
                    setZonedata4(false);
                    setZonedata5(false);
                    setZonedata6(false);
                    } } > ข้อมูลญาติผู้ติดต่อ </button>
                <button className={ zonedata4 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'}  type="button"
                onClick={ ()=> {
                    setZonedata1(false);
                    setZonedata2(false);
                    setZonedata4(!zonedata4);
                    setZonedata5(false);
                    setZonedata6(false);
                    } } > ประวัติจำเลย</button>
                <button className={ zonedata5 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'}  type="button"
                onClick={ ()=> {
                    setZonedata1(false);
                    setZonedata2(false);
                    setZonedata4(false);
                    setZonedata5(!zonedata5);
                    setZonedata6(false);
                    } } > ประวัติจำเลย (ต่อ)</button>
                    <button className={ zonedata6 ? 'btn btn-primary mx-1' : 'btn btn-dark mx-1'}  type="button"
                onClick={ ()=> {
                    setZonedata1(false);
                    setZonedata2(false);
                    setZonedata4(false);
                    setZonedata5(false);
                    setZonedata6(!zonedata6);
                    } } > อุทธรณ์คำสั่งไม่อนุญาต</button>

            { zonedata1 && <>
            <p className='bg-dark text-light mt-2'> -- ข้อมูลจำเลย -- </p>
            <label htmlFor="Defendant_name">ชื่อจำเลย</label>
            <input  type="text" className="form-control" name="Defendant_name"    
                {...register("Defendant_name")} />

            <div className='row'>
            <div className='col-4'>
            <label htmlFor="def21">เลขบัตรประชาชน</label>
            <input  type="text" className="form-control" name="def21"    
                {...register("def21")} />
            <label htmlFor="def65">เกิดวันที่ (พิมพ์ย่อ)</label>
            <input type="text" className="form-control" name="def65"  
                {...register("def65")} />
            </div>

            <div className='col-2'>
            <label htmlFor="def66">เชื้อชาติ</label>
            <input type="text" className="form-control" name="def66" 
                {...register("def66")} />
            <label htmlFor="def69">อายุ </label>
            <input type="text" className="form-control" name="def69" 
                {...register("def69")} />
            </div>

            <div className='col-3'>
            <label htmlFor="def32">การศึกษา</label>
            <input type="text" className="form-control" name="def32"  
                {...register("def32")} />
            <label htmlFor="def67">เกิดที่อำเภอ</label>
            <input type="text" className="form-control" name="def67"  
                {...register("def67")} />
            </div>
            
            <div className='col-3'>
            <label htmlFor="def33">อาชีพ</label>
            <input type="text" className="form-control" name="def33"  
                {...register("def33")} />
            <label htmlFor="def68">เกิดที่จังหวัด</label>
            <input type="text" className="form-control" name="def68"  
                {...register("def68")} />
            </div>

            <div className='col-2'>
            <label htmlFor="def24">บ้านเลขที่</label>
            <input type="text" className="form-control" name="def24"  
                {...register("def24")} />
             <label htmlFor="def25">หมู่ที่</label>
            <input type="text" className="form-control" name="def25"  
                {...register("def25")} />
            <label htmlFor="def31">รหัสไปรษณีย์</label>
            <input type="text" className="form-control" name="def31"  
                {...register("def31")} />
            </div>

            <div className='col-5'>
            <label htmlFor="def27">ถนน</label>
            <input type="text" className="form-control" name="def27"  
                {...register("def27")} />
            <label htmlFor="def28">ตำบล/แขวง</label>
            <input type="text" className="form-control" name="def28"  
                {...register("def28")} />
            <label htmlFor="def30">จังหวัด</label>
            <input type="text" className="form-control" name="def30"  
                {...register("def30")} />

                <div className="form-check">
                <input className="form-check-input" type="checkbox" name="def_check4"  
                    {...register("def_check4", {})} />
                <label className="form-check-label" htmlFor="def_check4"> 
                    มีญาติหรือบุคคลที่สามารถติดต่อได้ </label>
                </div>
                <div className="form-check">
                <input className="form-check-input" type="checkbox" name="def_check5"  
                    {...register("def_check5", {})} />
                <label className="form-check-label" htmlFor="def_check5"> 
                    ข้าพเจ้ายินยอมปฏิบัติตามคำสั่งศาลฯ </label>
                </div>
                <div className="form-check">
                <input className="form-check-input" type="checkbox" name="def_check6"  
                    {...register("def_check6", {})} />
                <label className="form-check-label" htmlFor="def_check6"> 
                    ข้าพเจ้ายินยอมใช้ EM </label>
                </div>
                
            </div>

            <div className='col-5'>
            <label htmlFor="def26">ตรอก/ซอย</label>
            <input type="text" className="form-control" name="def26"  
                {...register("def26")} />
            <label htmlFor="def29">อำเภอ/เขต</label>
            <input type="text" className="form-control" name="def29"  
                {...register("def29")} />
            <label htmlFor="def22">โทรศัพท์</label>
            <input type="text" className="form-control" name="def22"  
                {...register("def22")} />
            <label htmlFor="def23">ID Line(ถ้ามี)</label>
            <input type="text" className="form-control" name="def23"  
                {...register("def23")} />
            </div>


            </div>
            </> }

            { zonedata2 && <>
            <p className='bg-dark text-light mt-2'> -- ข้อมูลญาติผู้ติดต่อ -- </p>
            <div className='row'>
                <div className='col-6'>
                <label  htmlFor="people_name1">1.ชื่อ-สกุล</label>
                <textarea  type="text" className="form-control" name="people_name1" rows="1"  
                    {...register("people_name1")} />
                <label  htmlFor="def34">เลขบัตรประชาชน</label>
                <input  type="text" className="form-control" name="def34" 
                    {...register("def34")} />
                </div>
                <div className='col-6'>
                <label  htmlFor="people_def1">เกี่ยวข้องเป็น</label>
                <input type="text" className="form-control" name="people_def1"   
                    {...register("people_def1")} />
                <label  htmlFor="tel_name1">เบอร์</label>
                <input  type="text" className="form-control" name="tel_name1"   
                    {...register("tel_name1")} />
                </div>
            </div>

            <div className='row'>
            <div className='col-2'>
            <label htmlFor="def36">บ้านเลขที่</label>
            <input type="text" className="form-control" name="def36"  
                {...register("def36")} />
             <label htmlFor="def37">หมู่ที่</label>
            <input type="text" className="form-control" name="def37"  
                {...register("def37")} />
            <label htmlFor="def43">รหัสไปรษณีย์</label>
            <input type="text" className="form-control" name="def43"  
                {...register("def43")} />
            </div>

            <div className='col-5'>
            <label htmlFor="def39">ถนน</label>
            <input type="text" className="form-control" name="def39"  
                {...register("def39")} />
            <label htmlFor="def40">ตำบล/แขวง</label>
            <input type="text" className="form-control" name="def40"  
                {...register("def40")} />
            <label htmlFor="def42">จังหวัด</label>
            <input type="text" className="form-control" name="def42"  
                {...register("def42")} />
            </div>

            <div className='col-5'>
            <label htmlFor="def38">ตรอก/ซอย</label>
            <input type="text" className="form-control" name="def38"  
                {...register("def38")} />
            <label htmlFor="def41">อำเภอ/เขต</label>
            <input type="text" className="form-control" name="def41"  
                {...register("def41")} />
            <label htmlFor="def35">ID Line(ถ้ามี)</label>
            <input type="text" className="form-control" name="def35"  
                {...register("def35")} />
            </div>
            </div>

            <hr />
            <div className='row'>
                <div className='col-6'>
                <label  htmlFor="people_name2">2.ชื่อ-สกุล</label>
                <textarea  type="text" className="form-control" name="people_name2" rows="1"  
                    {...register("people_name2")} />
                <label  htmlFor="def44">เลขบัตรประชาชน</label>
                <input  type="text" className="form-control" name="def44" 
                    {...register("def44")} />
                </div>
                <div className='col-6'>
                <label  htmlFor="people_def2">เกี่ยวข้องเป็น</label>
                <input type="text" className="form-control" name="people_def2"   
                    {...register("people_def2")} />
                <label  htmlFor="tel_name2">เบอร์</label>
                <input  type="text" className="form-control" name="tel_name2"   
                    {...register("tel_name2")} />
                </div>
            </div>
            <div className='row'>
            <div className='col-2'>
            <label htmlFor="def46">บ้านเลขที่</label>
            <input type="text" className="form-control" name="def46"  
                {...register("def46")} />
             <label htmlFor="def47">หมู่ที่</label>
            <input type="text" className="form-control" name="def47"  
                {...register("def47")} />
            <label htmlFor="def53">รหัสไปรษณีย์</label>
            <input type="text" className="form-control" name="def53"  
                {...register("def53")} />
            </div>

            <div className='col-5'>
            <label htmlFor="def49">ถนน</label>
            <input type="text" className="form-control" name="def49"  
                {...register("def49")} />
            <label htmlFor="def50">ตำบล/แขวง</label>
            <input type="text" className="form-control" name="def50"  
                {...register("def50")} />
            <label htmlFor="def52">จังหวัด</label>
            <input type="text" className="form-control" name="def52"  
                {...register("def52")} />
            </div>

            <div className='col-5'>
            <label htmlFor="def48">ตรอก/ซอย</label>
            <input type="text" className="form-control" name="def48"  
                {...register("def48")} />
            <label htmlFor="def51">อำเภอ/เขต</label>
            <input type="text" className="form-control" name="def51"  
                {...register("def51")} />
            <label htmlFor="def45">ID Line(ถ้ามี)</label>
            <input type="text" className="form-control" name="def45"  
                {...register("def45")} />
            </div>
            </div>

            <hr />
            </> }

            { zonedata4 && <>
            <p className='bg-dark text-light mt-2'> --  ประวัติจำเลย -- </p>

            <div className='row'>
            <div className='col-8'>
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
            <br />
            

            </div>

            <div className='col-3'>

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
                <label htmlFor="def70">รายได้วันละ (บาท)</label>
                <input type="text" className="form-control" name="def70"  
                {...register("def70")} />
                </div>
                <div className='col-6'>
                <label htmlFor="def71">รายได้เดือนละ (บาท)</label>
                <input type="text" className="form-control" name="def71"  
                {...register("def71")} />
                </div>
            </div>
            <span> - สถานภาพการสมรส : </span>
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check41"  
                {...register("def_check41", {})} />
            <label className="form-check-label" htmlFor="def_check41"> 
                โสด </label>
            </div>
            {/* <div className="form-check form-check-inline">
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
            </div> */}
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check44"  
                {...register("def_check44", {})} />
            <label className="form-check-label" htmlFor="def_check44"> 
                อยู่กินฉันสามีภรรยา </label>
            </div>
            {/* <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check45"  
                {...register("def_check45", {})} />
            <label className="form-check-label" htmlFor="def_check45"> 
                หย่าร้าง เลิกร้าง </label>
            </div> */}
            <div className="form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="def_check46"  
                {...register("def_check46", {})} />
            <label className="form-check-label" htmlFor="def_check46"> 
                หม้าย </label>
            </div>
            <div className='row'>
                <div className='col-4'>
                <label htmlFor="def72">อาชีพคู่สมรส</label>
                <input type="text" className="form-control" name="def72"  
                {...register("def72")} />
                </div>
                <div className='col-4'>
                <label htmlFor="def73">รายได้วันละ (บาท)</label>
                <input type="text" className="form-control" name="def73"  
                {...register("def73")} />
                </div>
                <div className='col-4'>
                <label htmlFor="def74">รายได้เดือนละ (บาท)</label>
                <input type="text" className="form-control" name="def74"  
                {...register("def74")} />
                </div>
            </div>
            </div>

            </div>
            </> }

            { zonedata5 && <>
            <p className='bg-dark text-light mt-2'> -- ประวัติจำเลย (ต่อ) -- </p>

            <div className='row'>

            <div className='col-12'>

            <div className='row'>
                <div className='col-1'>
                    <label htmlFor="def75">-</label>
                    <input type="text" className="form-control" name="def75"  
                    {...register("def75")} />
                </div>
                <div className='col-3'>
                    <label htmlFor="def76">ความผิดเกิดเมื่อ (วดป)</label>
                    <input type="text" className="form-control" name="def76"  
                    {...register("def76")} />
                </div>
                <div className='col-2'>
                    <label htmlFor="def77">-</label>
                    <input type="text" className="form-control" name="def77"  
                    {...register("def77")} />
                </div>
                <div className='col-1'>
                    <label htmlFor="def78">-</label>
                    <input type="text" className="form-control" name="def78"  
                    {...register("def78")} />
                </div>
                <div className='col-3'>
                    <label htmlFor="def79">ถูกจับ/มอบตัวเมื่อ (วดป)</label>
                    <input type="text" className="form-control" name="def79"  
                    {...register("def79")} />
                </div>
                <div className='col-2'>
                    <label htmlFor="def80">-</label>
                    <input type="text" className="form-control" name="def80"  
                    {...register("def80")} />
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
                        <input type="text" className="form-control" name="def81"  
                        {...register("def81")} />

                    <label htmlFor="def82">สถานที่ควบคุม</label>
                    <input type="text" className="form-control" name="def82"  
                        {...register("def82")} />

                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" name="def_check51"  
                        {...register("def_check51", {})} />
                        <label className="form-check-label" htmlFor="def_check51"> 
                        ไม่เคยเสพสารเสพติด </label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" name="def_check52"  
                        {...register("def_check52", {})} />
                        <label className="form-check-label" htmlFor="def_check52"> 
                        เคยเสพสารเสพติด </label>
                        <span>ชนิด/ประเภท</span>
                        <input type="text" className="form-control" name="def83"  
                        {...register("def83")} />
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" name="def_check53"  
                        {...register("def_check53", {})} />
                        <label className="form-check-label" htmlFor="def_check53"> 
                        ปัจจุบันเสพสารเสพติด </label>
                        <span>ชนิด/ประเภท</span>
                        <input type="text" className="form-control" name="def84"  
                        {...register("def84")} />
                    </div>
                </div>

                
                <div className='col-6 mt-1'>
                    <span>ประวัติการกระทำความผิด</span>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check49"  
                        {...register("def_check49", {})} />
                        <label className="form-check-label" htmlFor="def_check49"> 
                        ไม่เคยถูกกล่าวหา หรือพิพากษาว่าได้กระทำผิดอาญา </label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" name="def_check50"  
                        {...register("def_check50", {})} />
                        <label className="form-check-label" htmlFor="def_check50"> 
                        เคยถูกดำเนินคดีอาญา </label>
                    </div>

                    <span>ความเห็นของเจ้าพนักงานศาล</span>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check54"  
                        {...register("def_check54", {})} />
                        <label className="form-check-label" htmlFor="def_check54"> 
                        ไม่สมควรปล่อยชั่วคราว </label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" name="def_check55"  
                        {...register("def_check55", {})} />
                        <label className="form-check-label" htmlFor="def_check55"> 
                        สมควรปล่อยชั่วคราว </label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" name="def_check56"  
                        {...register("def_check56", {})} />
                        <label className="form-check-label" htmlFor="def_check56"> 
                        สมควรปล่อยชั่วคราวโดยมีเงื่อนไข </label>
                    </div>
                    <div className="form-check mb-2">
                        <input className="form-check-input" type="checkbox" name="def_check57"  
                        {...register("def_check57", {})} />
                        <label className="form-check-label" htmlFor="def_check57"> 
                        มีเหตุผลตามกฏหมายที่จะไม่ออกหมายขังหรือหมายปล่อยก็ได้ </label><br />
                    </div>
                    <label htmlFor="def85">ข้อมูลอื่นๆ ที่เจ้าพนักงานศาลเห็นสมควรเสนอต่อศาล</label>
                    <textarea type="text" className="form-control" name="def85" rows={3} 
                    {...register("def85")} />


                </div>

            </div>

            </div>

            </div>
            </> }

            { zonedata6 && <>
            <p className='bg-dark text-light mt-2'> -- อุทธรณ์คำสั่งไม่อนุญาต -- </p>

            <div className='row'>
            <div className='col-12'>
                <label htmlFor="def55">คำสั่งศาลลงวันที่</label>
                <input type="text" className="form-control" name="def55"  
                {...register("def55")} />
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check7"  
                        {...register("def_check7", {})} />
                        <label className="form-check-label" htmlFor="def_check7"> 
                        ไม่มีเหตุอันควรเชื่อว่าจะหลบหนี </label><br />
                        <label htmlFor="def57">เนื่องจาก</label>
                        <input type="text" className="form-control" name="def57"  
                        {...register("def57")} />
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check8"  
                        {...register("def_check8", {})} />
                        <label className="form-check-label" htmlFor="def_check8"> 
                        ไม่มีเหตุอันควรเชื่อว่าจะยุ่งเหยิงกับพยานหลักฐาน </label><br />
                        <label htmlFor="def59">เนื่องจาก</label>
                        <input type="text" className="form-control" name="def59"  
                        {...register("def59")} />
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check9"  
                        {...register("def_check9", {})} />
                        <label className="form-check-label" htmlFor="def_check9"> 
                        ไม่มีเหตุอันควรเชื่อว่าจะไปก่อเหตุอันตรายอื่่น </label><br />
                        <label htmlFor="def61">เนื่องจาก</label>
                        <input type="text" className="form-control" name="def61"  
                        {...register("def61")} />
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" name="def_check10"  
                        {...register("def_check10", {})} />
                        <label className="form-check-label" htmlFor="def_check10"> 
                        ไม่มีเหตุอันควรเชื่อว่าการปล่อยฯเป็นอุปสรรคหรือก่อให้เกิดความเสียหายต่อการฯ </label><br />
                        <label htmlFor="def63">เนื่องจาก</label>
                        <input type="text" className="form-control" name="def63"  
                        {...register("def63")} />
                    </div>
            </div>
            <h6 className='text-muted mt-2'>****** ข้อมูลสำหรับหน้า 4 ของแบบฟอร์ม</h6>
            </div>
            </> }

            </div>
            
    </div>
    </div>
    </form>
    

    </>) ;
}


export default Fill_casefinal;