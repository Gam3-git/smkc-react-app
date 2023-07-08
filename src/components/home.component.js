import * as Icon from 'react-bootstrap-icons';
// const URL_newtab = window.location.href;
let URL_host = `http://${window.location.host}`;

const Home = () =>  {
  return (
    <> 
    
      <div className="col-12 mt-3">
        <h1 className="text-success text-center">ศาลจังหวัดสมุทรสงคราม</h1>
        <h3 className="text-muted text-center">รวมระบบงาน เฉพาะระบบภายในศาล</h3>
      <div className="d-grid gap-3">

          <a className="btn btn-dark mt-2" href="http://smkc.coj.go.th/th/weblink/item/index/id/184" 
          target="_blank" rel="noopener noreferrer"> <Icon.HousesFill color="goldenrod" /> ระบบงานส่วนกลาง </a>

        <div className="row">
          <div className="col-3"> <div className="d-grid gap-3">

          <a className="btn btn-primary" href="http://10.37.76.2:8089/coj/login" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.Bank2 size={40} /> <br /> ระบบงาน (ระยะ 3) </a>

          <a className="btn btn-primary" href="http://ecourt3.coj.th/eCourt/#/" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.BuildingFillCheck size={40} /> <br /> ระบบ e-Filing </a>

          <a className="btn btn-primary" href="http://cios.coj.intra/index.html" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.Bank size={40} /> <br /> ระบบ CIOS </a>

          <a className="btn btn-primary" href="https://10.37.78.12/praxticol85-coj/" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.BuildingAdd size={40} /> <br /> ระบบ E-CMS </a>

          </div></div>

          <div className="col-3"> <div className="d-grid gap-3">

          <a className="btn btn-danger" href="http://10.37.76.250:9090/gdms/login" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.BookHalf size={40} /> <br /> ระบบ GDMS (หนังสือเวียนภายใน) </a>

          <a className="btn btn-danger" href={`${URL_host}/smkc-react-app/uservocation`}
          target="_self" rel="noopener noreferrer"> 
          <Icon.PersonLinesFill size={40} /> <br /> ระบบบันทึกใบลา </a>

          <a className="btn btn-danger" href="http://10.37.76.250:9090/main/web/" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.CalendarEventFill size={40} /> <br /> ปฏิทินเวรนอกเวลา </a>

          <a className="btn btn-danger" href="http://sso.coj.intra/" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.FileLock2Fill size={40} /> <br /> ระบบหมายจับ </a>

          </div></div>

          <div className="col-3"> <div className="d-grid gap-3">
          <a className="btn btn-success" href={`${URL_host}/smkc-search160/`}
          target="_blank" rel="noopener noreferrer"> 
          <Icon.Search size={40} /> <br /> ค้นหาข้อมูลคดี </a>
          <a className="btn btn-success" href="http://10.37.76.250:9090/webETC/smkc-probation/case_pic.php" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.PersonBoundingBox size={40} /> <br /> บันทึกรูปทนาย online </a>

          {/* <a className="btn btn-success" href="http://10.37.76.250:9090/webETC/smkc-probation/" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.FilePersonFill size={40} /> <br />  บันทึก ค.ป.และ ค.ป.ย.  </a> */}

          <a className="btn btn-success" href={`${URL_host}/smkc-react-app/fillwitness`}
          target="_self" rel="noopener noreferrer"> 
          <Icon.BookmarkCheckFill size={40} /> <br /> หนังสือติดตามพยาน </a>

          <a className="btn btn-success" href="http://summons.coj.intra/login.html" 
          target="_blank" rel="noopener noreferrer"> 
          <Icon.CloudDownloadFill size={40} /> <br /> ระบบหมายข้ามเขต </a>

          </div></div>

          <div className="col-3"> <div className="d-grid gap-3">
          
          <a className="btn btn-warning" href={`${URL_host}/smkc-react-app/fillcasefinal`} 
          target="_self" rel="noopener noreferrer"> 
          <Icon.JournalCheck size={40} /> <br /> หนังสือรับรองคดีถึงที่สุด </a>
          
          <a className="btn btn-warning" href={`${URL_host}/smkc-react-app/filldrivingli`} 
          target="_self" rel="noopener noreferrer"> 
          <Icon.CarFrontFill size={40} /> <br />  หนังสือพักใช้ใบอนุญาตขับขี่ฯ  </a>

          <a className="btn btn-warning" href={`${URL_host}/smkc-react-app/fillsocialser1`} 
          target="_self" rel="noopener noreferrer"> 
          <Icon.PersonFillExclamation size={40} /> <br /> หนังสือบริการสังคม (บ.ส.)</a>

          <a className="btn btn-warning" href={`${URL_host}/smkc-react-app/fillwarrant`}
          target="_self" rel="noopener noreferrer"> 
          <Icon.PersonFillUp size={40} /> <br />  คำร้องขอปล่อยชั่วคราว </a>
          </div></div>
        </div>
        
          <a className="btn btn-dark mb-2" href="http://smkc.coj.go.th/th/page/item/index/id/1" 
          target="_blank" rel="noopener noreferrer"> <Icon.Bank2 color="goldenrod" /> เว็บไซต์ศาลจังหวัดสมุทรสงคราม </a>

      </div>
      </div>
      

    </>
    
  );

};

export default Home;