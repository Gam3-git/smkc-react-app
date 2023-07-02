import { useState, useEffect } from "react";
import { Container,Nav,Navbar,NavDropdown} from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import * as Icon from 'react-bootstrap-icons';
import AuthService from "../services/auth.service";



const Menu = () => {

  const [currentUser, setcurrentUser] = useState(undefined);
  const [showUser, setShowUser] = useState(false);
  const [showOper, setShowOper] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setcurrentUser( user );
      setShowUser( user.roles.includes("USER") );
      setShowOper( user.roles.includes("OPERATER") );
      setShowAdmin( user.roles.includes("ADMIN") );
    } else {
      setcurrentUser( undefined );
    }
  }, []); 
  

  const logOut = () => {
    AuthService.logout();
    setcurrentUser( undefined );
    navigate('/'); 
    window.location.reload();
  }


  return (
    <Navbar bg="primary" variant="dark" expand="lg" >
      <Container>
        <Navbar.Brand as = {Link} to = "/" > 
          <Icon.LayersFill color="gold" size={30} /> { process.env.REACT_APP_NAME || 'TEST SitE' }  
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
              <Nav.Link as={Link} to="/" > หน้าหลัก</Nav.Link>
            {(showUser || showOper || showAdmin) && ( 
               <NavDropdown title="ระบบงาน" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/caseECMS"> - ระบบแสกน [ตั้งต้นคดี] </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/uservocation"> - ระบบบันทึกใบลา </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/listup"> - ระบบบันทึกรหัสผู้ใช้ </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/fillven"> - รายการเวรประจำตัว </NavDropdown.Item>
             </NavDropdown>
            )}
            { (showOper || showAdmin) && (
            <>
              <NavDropdown title="รายงาน" id="basic-nav-dropdown">
                {/* <NavDropdown.Item href="http://10.37.76.250:9090/webETC/smkc_user/report_vs2.php" target="_blank">
                  - รายงานสรุปวันลา(เดิม)
                </NavDropdown.Item> */}
                <NavDropdown.Item as={Link} to="/uservocation_st"> - รายงานสรุปวันลา </NavDropdown.Item>
              </NavDropdown>
              { showAdmin && (
              <NavDropdown title="ระบบจัดการ" id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/set_admin">Manage User</NavDropdown.Item>
              </NavDropdown>
              )}
            </>
            )}
              <NavDropdown title="เพิ่มเติม" id="basic-nav-dropdown">
              <NavDropdown title="- คำร้อง (ปชส)" id="basic-nav-dropdown" className="bg-primary">
                    <NavDropdown.Item as={Link} to="/fillsocialser1"> - หนังสือบริการสังคม </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/fillwarrant"> - คำร้องใบเดียว </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/fillwarrant/view_ss?type_id=1"> - แสดง ID บ.ส. </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/fillwarrant/view_ss?type_id=4"> - แสดง ID คำร้องใบเดียว </NavDropdown.Item>
              </NavDropdown>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/fillcasefinal"> - หนังสือรับรองคดี </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/fillwitness"> - หนังสือแจ้งติดตามพยาน </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/filldrivingli"> - หนังสือพักใช้ใบอนุญาตขับรถ </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/caseday"> - ข้อมูลคดีประจำวัน </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/remaincase"> - ข้อมูลคดีค้าง </NavDropdown.Item>
                <NavDropdown.Divider />
              </NavDropdown>
            </Nav>
            <Nav className="me-end">
            { currentUser ? (
              <>
              <Nav.Link as={Link} to="/profile" > Profile : {currentUser.name} </Nav.Link>
              <Nav.Link as={Link} to="/" onClick={logOut} className="btn btn-dark mx-1" >
                <Icon.BoxArrowInLeft color="gold" size={20}/> LogOut
              </Nav.Link>
              </>
              ):(
              <>
                <Nav.Link as={Link} to="/login" className="btn btn-dark mx-1">
                  <Icon.BoxArrowRight color="gold" size={20} />  เข้าสู่ระบบ  
                </Nav.Link>
              </>
              ) }
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
};

export default Menu;
