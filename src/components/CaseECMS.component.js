import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import { ChkUser} from "../services/chkuser.service";
import Service from "../services/caseaccess.service";

const MySwal = withReactContent(Swal);


const CaseECMS = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

    const [dbtime, setDbtime] = useState('');
    const [caseresult, setCaseresult] = useState([]);
    const [scanresult, setScanresult] = useState([]);

    useEffect(()=>{
        Service.getChk_db().then(res => {
            setDbtime(res.data.message);
        }).catch(err => console.error(err))
    },[]);

    useEffect(() => {
        const user = ChkUser();
        if(!user){ navigate('/login'); } 
    }, [navigate]);

    useEffect(()=>{
        if(caseresult.length > 0){

            let date_receive = new Date(caseresult[0].date_receive) ;
                let day_r = (date_receive.getDate()).toString().padStart(2, '0');  
                let month_r = (date_receive.getMonth() + 1).toString().padStart(2, '0'); 
                let year_r = date_receive.getFullYear() + 543; 
            date_receive = `${day_r}/${month_r}/${year_r}`; 

            let redcase = caseresult[0].rednum ? `${caseresult[0].casetext}${caseresult[0].rednum}/${caseresult[0].redyear}` : '';
            let casesubnum = caseresult[0].casesubnum === 1 ? 'คำฟ้อง':'คำร้อง';

            setValue("Blackcase",caseresult[0].blackcase);
            setValue("Redcase",redcase); 
            setValue("Plaintiff",caseresult[0].plaintiff);
            setValue("Defendant",caseresult[0].defendant);
            setValue("Plaint",caseresult[0].plaint);
            setValue("Datereceive",date_receive); 
            setValue("Casetype",caseresult[0].casetype);
            setValue("Casesubtype",caseresult[0].casesubtype);
            setValue("Casesubnum",casesubnum);
        } 
    },[ caseresult, setValue ]);

    const handleSearch = () => {

        reset();
        setScanresult(false);
        let search_input = document.getElementById('search_input').value ;
        let text_search = search_input.length > 0 ? search_input : null ;
        if(text_search === null){ return MySwal.fire({ title:'ระบุข้อมูลค้นหา',icon: 'error', timer: 3000  }); }
        setCaseresult([]); 

        MySwal.fire({ html : <div>
        <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
        <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: false, timer: 30000 
        });

        Service.getMainCase(text_search).then( res => {
            if(res){
                setCaseresult(res.data);
                MySwal.close();
            } else { throw new Error(); }
            }).catch( err =>{
                MySwal.fire({ title:'ไม่พบข้อมูล',html:<div><h6>{err.message}</h6></div>,icon: 'error', timer: 3000  });
                setCaseresult([]);
            });
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
        const ECMS_IP = `${process.env.REACT_APP_ECMS_IP || ''}`;
        let dms_user_id = JSON.parse(localStorage.getItem('user')).user_n;  //รหัสเชื่อมโยง coj
        let body_ = `{
            "documentName":"${data.Blackcase}",
            "documentVarchar03":"${data.Casesubnum}",
            "documentVarchar04":"${data.Casesubtype}",
            "documentVarchar01":"${data.Plaintiff}",
            "documentVarchar02":"${data.Defendant}",
            "version":"1",
            "documentText02":"${data.Plaint}",
            "documentVarchar06":"${data.Redcase}",
            "documentVarchar07":"${data.Casetype}",
            "documentDate01":"${data.Datereceive}",
            "createdBy":"1"}`;
 
        Service.uploadECMS(body_).then(function (response) {
            let url_ = `https://${ECMS_IP}/praxticol85-coj/?mode=add&docid=${response.data}&cojId=${dms_user_id}&map=1`;
            window.open(url_);
            window.location.reload();
          }).catch(function (error) { console.log(error); });
    }

    const handleSearch2 = () => {
        reset();
        setScanresult(false);
        
        const ECMS_IP = `${process.env.REACT_APP_ECMS_IP || ''}`;
        const dms_user_id = JSON.parse(localStorage.getItem('user')).user_n;  //รหัสเชื่อมโยง coj
        
        let search_input = document.getElementById('search_input').value ;
        let text_search = search_input.length > 0 ? search_input : null ;
        if(text_search === null){ return MySwal.fire({ title:'ระบุข้อมูลค้นหา',icon: 'error', timer: 3000  }); }

        const url_ = `https://${ECMS_IP}/praxticol85-coj/?casenumber=${text_search}&type=${1}&cojId=${dms_user_id}&map=1`;
        window.open(url_);
    }

    const handleKeyDown = (event) => { if (event.keyCode === 13) { handleSearch(); } }


    const ECMS_filepdf = async (idfileAtt) => {
        const ECMS_IP = `${process.env.REACT_APP_ECMS_IP || ''}`;
        var url = `http://${ECMS_IP}:8080/pxapi/api/v1/fileAttachs/convertFileToPdf/${idfileAtt}?version=1&api_key=praXis`;
        const response = await fetch(url);
        const data_s = await response.json();
        if(data_s.data.fileAttachType === '.PDF'){
          window.open(data_s.data.url, "_blank");
        } else { 
          console.log(data_s.data.fileAttachType);
        }
    }

    // const Create_list_ecms = () => {

    //     MySwal.fire({ html : <div>
    //         <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
    //         <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: true, timer: 30000 });

    //     const dms_user_id = JSON.parse(localStorage.getItem('user')).user_n;  //รหัสเชื่อมโยง coj
    //     let search_input = document.getElementById('search_input').value ;
    //     let text_search = search_input.length > 0 ? search_input : null ;

    //     if(text_search === null){ return MySwal.fire({ title:'ระบุข้อมูลเลขดำ',icon: 'error', timer: 3000  }); }

    //     let list_ecms = document.querySelector('#ul_input');
    //     list_ecms.innerHTML ="รายการเอกสารที่แสกน";

    //     let run_f1 = Service.ECMS_fileAtt( text_search, dms_user_id );
    //     run_f1.then((data)=>{
    //         if(data.length > 0){
    //             for(let i=0; i < data.length; i++){
    //                 let e_li = document.createElement('li');
    //                 if(data[i].fileAttachType === '.PDF'){
    //                     e_li.textContent = data[i].fileAttachName;
    //                     e_li.classList.add('text-primary');
    //                     e_li.addEventListener('click', () => {
    //                          ECMS_filepdf(data[i].id);
    //                     });
    //                 } else {
    //                     e_li.textContent = data[i].fileAttachName;
    //                 }
    //                 var run_f2 = Service.ECMS_filetype(data[i].type);
    //                 run_f2.then((data)=>{
    //                     e_li.innerHTML += `<br> <a class="text-muted">ประเภท : ${data.fileAttachTypeName}</a>`;
    //                 });
    //                 list_ecms.appendChild(e_li);
                    
    //             }
    //         } else { 
    //             let e_li = document.createElement('li');
    //             e_li.innerHTML = `<a class="text-danger">ไม่มีเอกสารแสกน</a>`;
    //             list_ecms.appendChild(e_li);
    //         }

    //         MySwal.fire({ icon: "success", showConfirmButton: false, timer: 1000,});
    // }).catch(err => console.log('data err:'+err));

    // }

    const Create_list_ecms2 = () => {
        reset();
        setScanresult(false);

        MySwal.fire({ html : <div>
            <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
            <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: true, timer: 30000 });

        const dms_user_id = JSON.parse(localStorage.getItem('user')).user_n;  //รหัสเชื่อมโยง coj
        let search_input = document.getElementById('search_input').value ;
        let text_search = search_input.length > 0 ? search_input : null ;

        if(text_search === null){ return MySwal.fire({ title:'ระบุข้อมูลเลขดำ',icon: 'error', timer: 3000  }); }

        Service.ECMS_fileAtt( text_search, dms_user_id )
        .then(data => { 
            
            const promises = data.map( async (data)=>{
                let aa = await Service.ECMS_filetype(data.type); 
                data.typename = aa.fileAttachTypeName;
             } );

             Promise.all(promises)
            .then(() => {
                setScanresult(data);
                MySwal.close();
            })
            .catch(err => {
                console.log('err:' + err);
                setScanresult([]);
            });
        })
        .catch(err => {console.log('err:'+err); setScanresult([]); } );

    }


    const ComponentLI = (props) => {
        const data = props.data;
        const listItems = data.map((data,index) => { 

            if (data.fileAttachType === '.PDF') {
                return (
                <li className='text-primary' key={index} onClick={() => ECMS_filepdf(data.id)}>
                    { data.fileAttachName }
                        <br />
                    ประเภท :{ data.typename }
                </li>
                );
            } else {
                return (
                <li key={index}>
                    {data.fileAttachName}
                    <br />
                    ประเภท : { data.typename }
                </li>
                );
            }
        });

        return(<>
             <ul> รายการเอกสารที่แสกน 
                { listItems } 
             </ul>
        </>);
    }
    

    return (<>
        <div className='row justify-content-center mt-3 font-saraban'>
        <div className='col-1'>
            <button className='btn btn-outline-warning mt-3' onClick={ ()=> handleSync() } > ซิงค์ข้อมูล </button>
        </div>
        <div className='col-7 text-center'>
                <h4>ระบบแสกนตั้งต้นคดี [ Link to E-CMS ] </h4>
            <div className="input-group">
                <div className="input-group-prepend">
                <span className="input-group-text"> ระบุเลขคดีดำ </span>
                </div>
                <input type="text" className="form-control" style={{ textAlign: 'center' }} 
                onKeyDown={handleKeyDown} id="search_input" />
                <button className='btn btn-dark mx-1' onClick={ ()=> handleSearch() } > ค้นหา </button>
                <button className='btn btn-success mx-1' onClick={ ()=> handleSearch2() } > ค้นหาจากระบบ E-CMS </button>
            </div>
            { dbtime ?  <h6 className='text-muted mt-2'>{ dbtime }</h6>  : <h6 className='text-muted mt-2'>-</h6> }
        </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
        <div className='row font-saraban'>
                <div className='col-1'></div>
                <div className='col-2'>

                    <label htmlFor="Blackcase">หมายเลขคดีดำ </label>
                        {errors.Blackcase && <span className ="text-danger"> กรุณาระบุ </span>}
                    <input type="text" className="form-control" name="Blackcase"  
                        {...register("Blackcase", {required: true})} />

                    <label htmlFor="Redcase">หมายเลขคดีแดง </label>
                    <input type="text" className="form-control text-danger" name="Redcase"  
                        {...register("Redcase")} />

                    <label htmlFor="Casetype">ความ </label>
                    <input type="text" className="form-control" name="Casetype"  
                        {...register("Casetype")} />

                    <label htmlFor="Casesubtype">ประเภทคดี </label>
                    <input type="text" className="form-control" name="Casesubtype"  
                        {...register("Casesubtype")} />   

                    <label htmlFor="Casesubnum">คำฟ้อง/คำร้อง </label>
                    <input type="text" className="form-control" name="Casesubnum"  
                        {...register("Casesubnum")} />
                        
                </div>
                
                <div className='col-4'>
                    <label htmlFor="Datereceive">วันที่รับฟ้อง (01/12/2565) </label>
                    <input type="text" className="form-control" name="Datereceive"  
                        {...register("Datereceive")} />
                    
                    <label htmlFor="Plaint">ข้อหา</label>
                        {errors.Plaint && <span className ="text-danger"> กรุณาระบุ </span>}   
                    <textarea  type="text" className="form-control" name="Plaint"  
                        {...register("Plaint", {required: true})} />   
                    
                    <label htmlFor="Plaintiff">โจทก์</label>
                        {errors.Plaintiff && <span className ="text-danger"> กรุณาระบุ </span>}
                    <textarea  type="text" className="form-control" name="Plaintiff"    
                        {...register("Plaintiff", {required: true})} />

                    <label htmlFor="Defendant">จำเลย</label>
                        {errors.Defendant && <span className ="text-danger"> กรุณาระบุ </span>}
                    <textarea  type="text" className="form-control" name="Defendant"    
                        {...register("Defendant", {required: true})} />

                    <button className="form-control btn btn-danger mt-2" type="submit">อัพโหลด</button>
                </div>
                <div className='col-5 bg-light'>
                    { scanresult && <ComponentLI data={scanresult} /> }
                    <button className="btn btn-primary mt-2" type="button"
                    onClick={ ()=> Create_list_ecms2() }
                    >แสดงเอกสารที่แสกนของสำนวนนี้</button>
                </div>

        </div>
        </div>
        </form>
        <div className='col-12 bg-dark text-light text-center mt-4 py-2 font-saraban'>
            <h5>[ เวลาอัพเดทข้อมูลในวันจันทร์ - ศุกร์ 
                <span className='text-warning'> : 09.00, 11.00, 13.00, 15.00, 17.00</span> เวลาอัพเดทข้อมูลวันเสาร์และอาทิตย์ : 11.00, 13.00 ]</h5>
            <h6>กรณี ค้นหาข้อมูล เร่งด่วน ต้องการอัพเดท ฐานข้อมูล ให้กดปุ่ม 'ซิงค์ข้อมูล' (สีเหลือง)</h6>
            <h6>กรณี บันทึกข้อมูลเอง ต้องระบุข้อมูลอย่างน้อย ดังนี้ || เลขคดีดำ ข้อหา ชื่อโจทก์ ชื่อจำเลย ||
            วันที่รับฟ้อง(มีรูปแบบ 01/03/2566)**วันสองหลัก / เดือนสองหลัก / ปีสี่หลัก </h6>

        </div>

        </>) ;
}


export default CaseECMS;