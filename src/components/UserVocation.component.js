import { useState, useEffect } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/th';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ArrowClockwise } from 'react-bootstrap-icons';

import { ChkUser} from "../services/chkuser.service";
import {convertDate, convertDate_s} from "../services/convert_text.service";
import Service from "../services/uservocasick.service";

const MySwal = withReactContent(Swal);

const UserVocation = () => {

    const [userData, setUserData] = useState({});
    const [userHisvs, setUserHisvs] = useState([]);
    const [showDP1, setShowDP1] = useState(false);
    const [showDP2, setShowDP2] = useState(false);
    const [showDP3, setShowDP3] = useState(false);
    const [showDP4, setShowDP4] = useState(false);
    const [showDP5, setShowDP5] = useState(false);
    const [showDP6, setShowDP6] = useState(false);
    const [showDP7, setShowDP7] = useState(false);
    const [showDP8, setShowDP8] = useState(false);
    const [showcardvs, setShowcardvs] = useState(false);
    const [showSettingVS, setShowSettingVS] = useState(false);
    const [showSettingBtn, setShowSettingBtn] = useState(false);

    const navigate = useNavigate();
    const { register, handleSubmit, setValue, getValues } = useForm();

    useEffect(() => {
        const user = ChkUser();
        if(user){
          Service.UserStaticVS(user.id).then(res => {
                setUserData(res.data[0]);
                setValue('user_detail',res.data[0]);
            }).catch(err => {
                // console.log(err.response.data.message);
                setUserData({});
                localStorage.removeItem("user");
                navigate('/login');
                window.location.reload();
            });
        } else {
          navigate('/login');
        }
      }, [navigate,setValue]);

    useEffect(()=>{
        if(Object.keys(userData).length){
            // console.log(userData);
            const date = new Date();
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            const formattedDate2 = `${year}-${month}-${day}`;

            let options = { year: 'numeric', month: 'long', day: 'numeric'};
            let formattedDate = date.toLocaleDateString('th-TH', options);

            const plus7h = (date) =>{
                const originalDate = new Date(date);
                originalDate.setHours(originalDate.getHours() + 7);
                const newDateString = originalDate.toISOString();
                return newDateString ;
            }

            if(userData.type2_tn === 0 && userData.type3_tn === 0 ){ setShowSettingBtn(true) }

            setValue('v4_2',formattedDate); setValue('v4', formattedDate2 );
            setValue('v5_2',formattedDate); setValue('v5', formattedDate2 );
            setValue('v8_2',formattedDate); setValue('v8', formattedDate2 );
            setValue('v19_2',formattedDate); setValue('v19', formattedDate2 );
            setValue('v20_2',formattedDate); setValue('v20', formattedDate2 );
            setValue('v23_2',formattedDate); setValue('v23', formattedDate2 );
            setValue('v6',''); setValue('v21',''); setValue('v42',1);

            setValue('v1',userData.type1_bn+10);
            setValue('v2',userData.type1_tn);
            setValue('v3',(userData.type1_bn+10) - userData.type1_tn);
            setValue('v11',userData.type2_tn);
            setValue('v12',userData.type3_tn);
            setValue('v13',userData.type4_tn);
            setValue('v14',userData.last_type_p);
            setValue('v15',convertDate(userData.date_lb1).date);
            setValue('v16',convertDate(userData.date_lb2).date);
            setValue('v17',userData.num_lb);

            setValue('v31',userData.year_vs + 543 );
            setValue('v32',userData.type1_bn);
            setValue('v33',userData.type1_bn + 10);
            setValue('v34',userData.type1_tn);
            setValue('v35',userData.type2_tn);
            setValue('v36',userData.type3_tn);
            setValue('v37',userData.type4_tn);
            setValue('v38',userData.late_total);
            setValue('v39',userData.last_type_p);
            setValue('v40',plus7h(userData.date_lb1));
            setValue('v41',plus7h(userData.date_lb2));
            setValue('v40_2',convertDate(userData.date_lb1).date);
            setValue('v41_2',convertDate(userData.date_lb2).date);
            setValue('v42',userData.num_lb);

            Service.UserHistoryVS(userData.id_uvs).then(res => {
                setUserHisvs(res.data);
            }).catch(err => {
                console.log(err.response.data.message);
                setUserHisvs([]);
            });
        }
      },[userData,setValue]);
    
    const CreateHisUser = (props) => {
        let data = (props.data);
        // console.log(data);
        const paper_type = (num) =>{
            switch(num){
                case 1 : return <span className='text-success'>พักผ่อน</span>;
                case 2 : return <span className='text-primary'>ลาป่วย</span> ;
                case 3 : return <span className='text-info'>ลากิจ</span>;
                case 4 : return <span>ลาคลอด</span>;
                case 11 : return <span className='text-warning'>สาย</span>;
                default : return <span>-</span>;
            }
        }
        if(data.length > 0){
            const filteredArr11 = data.filter(obj => obj.type_paper === 11);
            const filteredArr1 = data.filter(obj => obj.type_paper === 1);
            const {obj1, obj2, obj3} = data.reduce((acc, obj) => {
            const {obj1, obj2, obj3} = acc;
            if (filteredArr1.includes(obj)) {
                obj1.push(obj);
            } else if(filteredArr11.includes(obj)) {
                obj3.push(obj);
            } else {
                obj2.push(obj);
            }
            return acc;
            }, {obj1: [], obj2: [], obj3: []});
            
        const chk_butt_del = (date) => {
            let today  = new Date();  
            let daybook = new Date(date);
            let chK_Date = new Date(today.setDate(today.getDate() - 10));
            // console.log(chK_Date+' || '+daybook);
            if(chK_Date < daybook){ return true; } else { return false ;}
        }

        const del_butt = (id) =>{
            MySwal.fire({ html : <div>
                <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
                <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: true, timer: 30000 
            });

            Service.DeleteVS(id).then(res =>{
                MySwal.close();
                setTimeout( ()=>  window.location.reload(),800);
            }).catch(err => {
                console.error(err);
            });
        }

        const print_butt = (id) =>{
            MySwal.fire({ html : <div>
                <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
                <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: true, timer: 30000 
            });

            Service.getWord_V(id).then(res =>{
                MySwal.close();
            }).catch(err => {
                console.error(err);
            });
        }

        const print_butt2 = (id) =>{
            MySwal.fire({ html : <div>
                <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
                <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: true, timer: 30000 
            });

            Service.getWord_S(id).then(res =>{
                MySwal.close();
            }).catch(err => {
                console.error(err);
            });
        }
        
        return( <>
        { obj1 && 
        <div className="col-6 table-responsive">
            <h4>ประวัติ พักผ่อน</h4>
            <table className="table table-bordered table-sm">
            <thead><tr>
                <th scope="col">#ID</th>
                <th scope="col">ประเภทลา</th>
                <th scope="col">ช่วงเวลา</th>
                <th scope="col">หมายเหตุ</th>
            </tr></thead>
            <tbody>
            {obj1.map((value, index) => ( <tr key={index} >
                <th scope="row"> { value.id_vs } </th>
                <td className='text-center'> { paper_type(value.type_paper) } </td>
                <td> - { convertDate_s(value.date_present1).date } ถึง { convertDate_s(value.date_present2).date } [ { value.num_present } วัน ]</td>
                <td className='text-center'> 
                    { chk_butt_del(value.date_present2) && index === 0 &&  <>
                    <button className='btn btn-dark btn-sm mx-1'
                        onClick={ ()=> print_butt(value.id_vs) }
                    >พิมพ์</button> 
                    <button className='btn btn-danger btn-sm mx-1'
                        onClick={ ()=> del_butt(value.id_vs) }
                    >ลบ</button>
                    </> }
                </td>
            </tr> ))}
            </tbody>
            </table>
        </div>
        }
        { obj2 && 
        <div className="col-6 table-responsive">
            <h4>ประวัติ ป่วย กิจ คลอด</h4>
            <table className="table table-bordered table-sm">
            <thead><tr>
                <th scope="col">#ID</th>
                <th scope="col">ประเภทลา</th>
                <th scope="col">ช่วงเวลา</th>
                <th scope="col">หมายเหตุ</th>
            </tr></thead>
            <tbody>
            {obj2.map((value, index) => ( <tr key={index} >
                <th scope="row"> { value.id_vs } </th>
                <td className='text-center'> { paper_type(value.type_paper) } </td>
                <td> - { convertDate_s(value.date_present1).date } ถึง { convertDate_s(value.date_present2).date } [ { value.num_present } วัน ]</td>
                <td className='text-center'> 
                    { chk_butt_del(value.date_present2) && index === 0 && <>
                    <button className='btn btn-dark btn-sm mx-1'
                        onClick={ ()=> print_butt2(value.id_vs) }
                    >พิมพ์</button> 
                    <button className='btn btn-danger btn-sm mx-1'
                        onClick={ ()=> del_butt(value.id_vs) }
                    >ลบ</button>
                    </>}
                </td>
            </tr> ))}
            </tbody>
            </table>
        </div>
        }
        { obj3 && 
        <div className="col-5 table-responsive">
            <h4>ประวัติสาย</h4>
            <table className="table table-bordered table-sm">
            <thead><tr>
                <th scope="col">#ID</th>
                <th scope="col">ประเภทลา</th>
                <th scope="col">ช่วงเวลา</th>
            </tr></thead>
            <tbody>
            {obj3.map((value, index) => ( <tr key={index} >
                <th scope="row"> { value.id_vs } </th>
                <td className='text-center'> { paper_type(value.type_paper) } </td>
                <td> - { convertDate_s(value.date_present1).date } ถึง { convertDate_s(value.date_present2).date } [ { value.num_present } ครั้ง ]</td>
            </tr> ))}
            </tbody>
            </table>
        </div>
        }
        </> );
        }
    
    }

    function MyDatetimeComponent({el_sel}) {

        const renderYear = (props, year, selectedDate) => {
            return <td {...props}>{year +543}</td>;
        }

        function handleChange(newDate) {
            let date = new Date(newDate.format('YYYY-MM-DD'));
            let options = { year: 'numeric', month: 'long', day: 'numeric'};
            let formattedDate = date.toLocaleDateString('th-TH', options);
            switch(el_sel){
                case 1 : setValue('v4_2',formattedDate);  setValue('v4',newDate.format('YYYY-MM-DD')); setShowDP1(false); break;
                case 2 : 
                    setValue('v5_2',formattedDate); 
                    setValue('v5',newDate.format('YYYY-MM-DD'));
                    setShowDP2(false);
                    cal_day(1);
                break;
                case 3: setValue('v8_2',formattedDate); setValue('v8',newDate.format('YYYY-MM-DD')); setShowDP3(false); break;
                case 4 : setValue('v19_2',formattedDate);  setValue('v19',newDate.format('YYYY-MM-DD')); setShowDP4(false); break;
                case 5 : 
                    setValue('v20_2',formattedDate); 
                    setValue('v20',newDate.format('YYYY-MM-DD'));
                    setShowDP5(false);
                    cal_day(2);
                break;
                case 6: setValue('v23_2',formattedDate); setValue('v23',newDate.format('YYYY-MM-DD')); setShowDP6(false); break;
                case 7 : setValue('v40_2',formattedDate);  setValue('v40',newDate.format('YYYY-MM-DD')); setShowDP7(false); break;
                case 8 : 
                    setValue('v41_2',formattedDate); 
                    setValue('v41',newDate.format('YYYY-MM-DD'));
                    setShowDP8(false);
                    cal_day(3);
                break;
                default : return;
            }
        }
      
        return (
          <Datetime
            renderYear={renderYear}
            input={false}
            locale="th"
            format="YYYY-MM-DD"
            timeFormat={false}
            closeOnSelect={true}
            defaultValue={ new Date() }
            onChange={ handleChange }
            closeOnClickOutside={true}
          />
        );
    }


    const onSubmit = (data) => {

        if(data.v9.length <= 0){ 
            MySwal.fire({icon: 'error',title: 'ระบุการติดต่อ',
            showConfirmButton: false, allowOutsideClick: true, timer: 30000 });
            return;
        }
        if(data.v6 > data.v3){ 
            MySwal.fire({icon: 'error',title: 'วันลาพักผ่อนเกิน',
            showConfirmButton: false, allowOutsideClick: true, timer: 30000 });
            return;
        }
        if(data.v6.length <= 0){ 
            MySwal.fire({icon: 'error',title: 'ระบุจำนวนวันลา',
            showConfirmButton: false, allowOutsideClick: true, timer: 30000 });
            return;
        }

        MySwal.fire({ html : <div>
            <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
            <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: true, timer: 30000 
        });
        data.type_add = 1;
        Service.AddVS(data).then(res => {
            MySwal.close();
            setTimeout( ()=>  window.location.reload(),1000);
        }).catch(err => console.error(err))
    
    }

    const onSubmit2 = () => {

        const data = getValues();
        if(data.v24.length <= 0 || data.v25.length <= 0 || data.v21.length <= 0){ 
            MySwal.fire({icon: 'error',title: 'ระบุข้อมูล จำนวนวันลา การเหตุผลลาและที่อยู่',
            showConfirmButton: false, allowOutsideClick: true, timer: 30000 });
            return;
        }


        MySwal.fire({ html : <div>
            <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
            <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: true, timer: 30000 
        });

        data.type_add = 2;
        Service.AddVS(data).then(res => {
            MySwal.close();
            setTimeout( ()=>  window.location.reload(),800);
        }).catch(err => console.error(err))
    
    }

    const onSubmit3 = () => {

        const data = getValues();
        MySwal.fire({ html : <div>
            <ArrowClockwise style={{ animation: 'example 1s infinite'}} size={50} className='text-danger' />
            <h3> Loading... </h3> </div>, showConfirmButton: false, allowOutsideClick: true, timer: 30000 
        });

        Service.UpdateVS(data)
        .then(res => { MySwal.close();
            setTimeout( ()=>  window.location.reload(),800);
        }).catch(err => console.error(err));
    
    }

    const cal_day = (num) => {
        const data = getValues();
        let cal_value ; let input_value ;
        switch(num){
            case 1 :  cal_value = new Date(data.v5) - new Date (data.v4); input_value = 'v6'; break;
            case 2 :  cal_value = new Date(data.v20) - new Date (data.v19); input_value = 'v21'; break;
            case 3 :  cal_value = new Date(data.v41) - new Date (data.v40); input_value = 'v42'; break;
            default :  cal_value = new Date(data.v5) - new Date (data.v4); input_value = 'v6';
        }
        // setValue( input_value ,(cal_value / 86400000)+1);
        cal_value = '' ;
        setValue( input_value ,cal_value);
    };

    return(<>
    <div className='row justify-content-center mt-3'>
        <div className='col-12 text-center'>
            <h4>ระบบบันทึกใบลา</h4>
            <button 
                className={ showcardvs ? 'btn btn-dark mx-1' : 'btn btn-success mx-1'} 
                onClick={()=>{setShowcardvs(false); setShowSettingVS(false);}}
                > บันทึกใบลาพักผ่อน </button>
            <button 
                className={ showcardvs ? 'btn btn-info mx-1' : 'btn btn-dark mx-1' }
                onClick={()=>{setShowcardvs(true); setShowSettingVS(false);}}
                > บันทึกใบลาป่วย / กิจ / คลอด </button>
            { showSettingBtn && <button 
                className={ showSettingVS ? 'btn btn-warning mx-1' : 'btn btn-dark mx-1' }
                    onClick={()=>setShowSettingVS(!showSettingVS)}
                > ตั้งค่าวันลา </button> }
             <h5 className='bg-dark text-warning mt-1 px-1 py-1'> { userData && 
                <> ข้อมูล ID : { userData.id_user } ||
                ลาพักผ่อน : { userData.type1_tn } / { userData.type1_bn+10 } วัน 
                ลาป่วย : { userData.type2_tn } / 60 วัน ลากิจ : { userData.type3_tn } / 45 วัน 
                สาย { userData.late_total } ครั้ง
                <input type="hidden" {...register("user_detail")} />
                </>
            }</h5>
        </div>
        {showSettingVS && <>
         <div className='col-7 mb-1'>
            <div className="form-group">
                    <div className="card">
                    <div className="card-header bg-warning text-center"> ตั้งค่าวันลาพักผ่อน ลาป่วย, ลากิจส่วนตัว, ลาคลอดบุตร </div>
                    <div className="card-body bg-light">
                        <div className='row justify-content-center'>
                        <div className='col-3'>
                                <label htmlFor="v31">- ปีงบประมาณ -</label>
                                <input type="text" className="form-control" name="v31"  
                                    {...register("v31")} disabled />
                                <label htmlFor="v32">วันลาพักผ่อนสะสม</label>
                                <input type="text" className="form-control text-danger" name="v32" 
                                    {...register("v32")} />
                                <label htmlFor="v33">วันลาพักผ่อนทั้งหมดปีนี้</label>
                                <input type="text" className="form-control" name="v33"
                                    {...register("v33")} disabled />
                                <label htmlFor="v34">ลาพักผ่อนไปแล้ว (วัน)</label>
                                <input type="text" className="form-control" name="v34"
                                    {...register("v34")} />
                                <button className="form-control btn btn-outline-dark mt-4" type="button"
                                        onClick={ ()=>setShowSettingVS(!showSettingVS) }
                                >ปิดตั้งค่า</button>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="v35">ลาป่วยไปแล้ว (วัน) </label>
                                <input type="text" className="form-control" name="v35"  
                                    {...register("v35")}  />
                                <label htmlFor="v36">ลากิจไปแล้ว (วัน)</label>
                                <input type="text" className="form-control" name="v36"  
                                    {...register("v36")}  />
                                <label htmlFor="v37">ลาคลอดไปแล้ว (วัน)</label>
                                <input type="text" className="form-control" name="v37"
                                    {...register("v37")} />
                                <label htmlFor="v38">สายไปแล้ว (ครั้ง)</label>
                                <input type="text" className="form-control" name="v38"
                                        {...register("v38")} disabled/>
                                <button className="form-control btn btn-warning mt-4" type="button"
                                        onClick={ ()=> onSubmit3() }
                                >ปรับปรุงข้อมูล</button>
                            </div>
                            <div className='col-4'>
                            <label htmlFor="v39">1) ประเภทการลาครั้งก่อน </label>
                                <select className="form-select" {...register("v39")} >
                                    <option value="2">ลาป่วย</option>
                                    <option value="3">ลากิจ</option>
                                    <option value="4">ลาคลอด</option>
                                </select>
                                <label htmlFor="v40_2">2) ลาครั้งก่อนตั้งแต่วันที่</label>
                                <input type="hidden" {...register("v40")} />
                                <input type="text" className="form-control" name="v40_2"  
                                onClick={() => setShowDP7(!showDP7)} 
                                {...register("v40_2")} />
                                    { showDP7 && ( <MyDatetimeComponent el_sel={7} /> )}

                                <label htmlFor="v41_2">3) ถึงวันที่ </label>
                                <input type="hidden" {...register("v41")} />
                                <input type="text" className="form-control" name="v41_2" 
                                onClick={() => setShowDP8(!showDP8)} 
                                {...register("v41_2")} />
                                    { showDP8 && ( <MyDatetimeComponent el_sel={8} /> )}
                                    
                                <label htmlFor="v42">4) มีกำหนด (วัน)</label>
                                <input  type="text" className="form-control" name="v42"
                                    {...register("v42")} />
                            </div>
                            
                        </div>
                        </div>
                    </div>
            </div>
        </div>
        <div className='col-4 mb-1'>
        <div className="form-group">
                <div className="card">
                <div className="card-header bg-dark text-light text-center"> เกี่ยวกับตั้งค่าวันลา </div>
                <div className="card-body bg-light text-center">
                {/* <h6> วันลาพักผ่อนสะสม คือ <br />วันลาพักผ่อนคงเหลือจากปีงบที่ผ่านมา<br />(ไม่นับรวมกับวันลาพักผ่อนของปีงบ นั้นๆ)<br />
                <br />โดยผู้ที่บรรจุราชการเกิน 10 ปี <br />มีวันลาสะสมได้ไม่เกิน 20 วัน <br />
                <br />และผู้ที่บรรจุราชการไม่เกิน 10 ปี <br />มีวันลาสะสมได้ไม่เกิน 10 วัน </h6>
                <hr /> */}
                <h6> กรณีเริ่มปีงบใหม่ กรุณาตรวจสอบ วันลาพักผ่อนสะสม <br />และข้อมูลวันลาป่วย กิจ ครั้งสุดท้าย
                <br />(โดยไม่ต้องใส่ ยอดการลาป่วย กิจ <br />ที่เคยลาแล้วในปีงบที่ผ่านมา เนื่องจากเริ่มนับใหม่)</h6>
                <hr />
                <span>กรณีใช้งานครั้งแรกระหว่างปีงบ กรุณาตรวจสอบ <br />
                วันลาสะสม ทุกประเภท และข้อมูลวันลาป่วย กิจ ครั้งสุดท้าย</span>
                </div>
                </div>
            </div>
    </div>
    </>}
        { !showcardvs &&
            <div className='col-12'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <div className="card">
                    <div className="card-header bg-success text-light text-center"> ลาพักผ่อน </div>
                    <div className="card-body bg-light">
                        <div className='row justify-content-center'>
                            <div className='col-2'>
                                <label htmlFor="v1">วันลาพักผ่อนทั้งหมด</label>
                                <input type="text" className="form-control" name="v1"  
                                    {...register("v1")} disabled />
                                <label htmlFor="v2">ลาพักผ่อนไปแล้ว</label>
                                <input type="text" className="form-control" name="v2"
                                    {...register("v2")} disabled/>
                                    <label htmlFor="v3">ลาพักผ่อนคงเหลือ</label>
                                    <input type="text" className="form-control" name="v3"
                                        {...register("v3")} disabled/>
                            </div>
                            <div className='col-3'>
                                <label htmlFor="v4_2">1) ขอลาพักผ่อนตั้งแต่วันที่</label>
                                <input type="hidden" {...register("v4")} />
                                <input type="text" className="form-control" name="v4_2"  
                                onClick={() => setShowDP1(!showDP1)} 
                                {...register("v4_2")} />
                                    { showDP1 && ( <MyDatetimeComponent el_sel={1} /> )}

                                <label htmlFor="v5_2">2) ถึงวันที่ </label>
                                <input type="hidden" {...register("v5")} />
                                <input type="text" className="form-control" name="v5_2" 
                                onClick={() => setShowDP2(!showDP2)} 
                                {...register("v5_2")} />
                                    { showDP2 && ( <MyDatetimeComponent el_sel={2} /> )}
                                    
                                <label htmlFor="v6">3) มีกำหนด (วัน)</label>
                                <input  type="text" className="form-control" name="v6"
                                    {...register("v6")} />
                            </div>
                            <div className='col-2'>
                                <label htmlFor="v7">4) หากลาครึ่งวันให้กดเลือก </label>
                                <select className="form-select" {...register("v7")}>
                                    <option defaultValue value="0">ทั้งวัน</option>
                                    <option value="1">ครึ่งเช้า</option>
                                    <option value="2">ครึ่งบ่าย</option>
                                </select>
                                <label htmlFor="v8_2">5) ใบลาลงวันที่ </label>
                                <input type="hidden" {...register("v8")} />
                                <input  type="text" className="form-control" name="v8_2"
                                onClick={() => setShowDP3(!showDP3)} 
                                    {...register("v8_2")} />
                                    { showDP3 && ( <MyDatetimeComponent el_sel={3} /> )}

                            <button className="form-control btn btn-success mt-4" type="submit">บันทึกใบลาพักผ่อน</button>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="v9">6) ระหว่าง ลาติดต่อได้ที่ || กรณีลาครึ่งวันระบุต่อ</label>
                                <textarea type="text" className="form-control" name="v9" rows={4} 
                                    {...register("v9")} />
                                <h6 className="mt-4">ตัวอย่างการพิมพ์ : เบอร์ 034716873 หมายเหตุ ลาครึ่งวันเช้า</h6>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </form>
            </div>
}
        { showcardvs && 
            <div className='col-12'>
                <div className="form-group">
                    <div className="card">
                    <div className="card-header bg-info text-center"> ลาป่วย กิจ คลอด </div>
                    <div className="card-body bg-light">
                        <div className='row justify-content-center'>
                        <div className='col-1'>
                                <h6>ประวัติการลา</h6> <hr />
                                <label htmlFor="v11">ลาป่วย</label>
                                <input type="text" className="form-control" name="v11"  
                                    {...register("v11")} disabled />
                                <label htmlFor="v12">ลากิจ</label>
                                <input type="text" className="form-control" name="v12"
                                    {...register("v12")} disabled/>
                                    <label htmlFor="v13">ลาคลอด</label>
                                    <input type="text" className="form-control" name="v13"
                                        {...register("v13")} disabled/>
                            </div>
                            <div className='col-2'>
                            <label htmlFor="v14">การลาครั้งก่อน </label>
                                <select className="form-select" {...register("v14")} disabled >
                                    <option value="2">ลาป่วย</option>
                                    <option value="3">ลากิจ</option>
                                    <option value="4">ลาคลอด</option>
                                </select>
                                <label htmlFor="v15">ลาครั้งก่อนตั้งแต่วันที่</label>
                                <input type="text" className="form-control" name="v15"  
                                    {...register("v15")} disabled />
                                <label htmlFor="v16">ถึงวันที่</label>
                                <input type="text" className="form-control" name="v16"
                                    {...register("v16")} disabled/>
                                    <label htmlFor="v17">มีกำหนด (วัน)</label>
                                    <input type="text" className="form-control" name="v17"
                                        {...register("v17")} disabled/>
                            </div>
                            <div className='col-3'>
                            <label htmlFor="v18">1) เลือกประเภทการลา </label>
                                <select className="form-select" {...register("v18")} >
                                    <option value="2">ลาป่วย</option>
                                    <option value="3">ลากิจ</option>
                                    <option value="4">ลาคลอด</option>
                                </select>
                                <label htmlFor="v19_2">2) ขอลาตั้งแต่วันที่</label>
                                <input type="hidden" {...register("v19")} />
                                <input type="text" className="form-control" name="v19_2"  
                                onClick={() => setShowDP4(!showDP4)} 
                                {...register("v19_2")} />
                                    { showDP4 && ( <MyDatetimeComponent el_sel={4} /> )}

                                <label htmlFor="v20_2">3) ถึงวันที่ </label>
                                <input type="hidden" {...register("v20")} />
                                <input type="text" className="form-control" name="v20_2" 
                                onClick={() => setShowDP5(!showDP5)} 
                                {...register("v20_2")} />
                                    { showDP5 && ( <MyDatetimeComponent el_sel={5} /> )}
                                    
                                <label htmlFor="v21">4) มีกำหนด (วัน)</label>
                                <input  type="text" className="form-control" name="v21"
                                    {...register("v21")} />
                            </div>
                            <div className='col-2'>
                                <label htmlFor="v22">5) หากลาครึ่งวันให้กดเลือก </label>
                                <select className="form-select" {...register("v22")}>
                                    <option defaultValue value="0">ทั้งวัน</option>
                                    <option value="1">ครึ่งเช้า</option>
                                    <option value="2">ครึ่งบ่าย</option>
                                </select>
                                <label htmlFor="v23_2">6) ใบลาลงวันที่ </label>
                                <input type="hidden" {...register("v23")} />
                                <input  type="text" className="form-control" name="v23_2"
                                onClick={() => setShowDP6(!showDP6)} 
                                    {...register("v23_2")} />
                                    { showDP6 && ( <MyDatetimeComponent el_sel={6} /> )}

                            <button className="form-control btn btn-info mt-4" type="button"
                                onClick={ ()=> onSubmit2() }
                            >บันทึกใบลา</button>
                            </div>
                            <div className='col-4'>
                                <label htmlFor="v24">7) ลาเนื่องจาก </label>
                                <textarea type="text" className="form-control" name="v24" rows={3} 
                                    {...register("v24")} />
                                <label htmlFor="v25">8) ระหว่าง ลาติดต่อได้ที่ || กรณีลาครึ่งวันระบุต่อ</label>
                                <textarea type="text" className="form-control" name="v25" rows={3} 
                                    {...register("v25")} />
                                <h6 className="mt-2">ตัวอย่างการพิมพ์ : เบอร์ 034716873 หมายเหตุ ลาครึ่งวันเช้า</h6>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        }
        <div className='row mt-3'>
        { userHisvs && <CreateHisUser data={userHisvs}/> }
        </div>
        
    </div>
    </>);
}

export default UserVocation;