import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';

import Menu from './components/menu.component';
import Home from "./components/home.component";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import Setadmin from './components/set_admin.component';
import EditUser from './components/edituser.component';
import ListUP from './components/listup.component';
import CaseDay from './components/CaseDay.component';
import CasePost from './components/CasePost.component';
import RemainCase from './components/RemainCase.component';
import NoPage from './components/NoPage.component';

import FillCasefinal from './components/fillcomponents/fillcasefinal.component';
import FillSocialser1 from './components/fillcomponents/fillsocialservice.component';
import FillWarrant from './components/fillcomponents/fillwarrantservice.component';
import ViewSocialser from './components/subcomponents/view_ss.component';
import FillWitness from './components/fillcomponents/fillwitness.component';
import FillDrivingLi from './components/fillcomponents/filldriving_li.component';
import FillVen from './components/fillcomponents/fillven.component';

import UserVocation from './components/UserVocation.component';
import UserVocationSt from './components/UserVocationSt.component';
import CaseECMS from './components/CaseECMS.component';
import Paper from './components/paper.component';

function App() {
  return (
    <>

    <BrowserRouter basename="/smkc-react-app">
    <Container fluid>

    <Row> 
      <Col><Menu /></Col>
    </Row> 

    <Row>
    
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/set_admin" element={<Setadmin />} />
        <Route path="/edit" element={<EditUser />} />
        <Route path="/listup" element={<ListUP />} />
        <Route path="/caseday" element={<CaseDay />} />
        <Route path="/casepost" element={<CasePost />} />
        <Route path="/remaincase" element={<RemainCase />} />
        <Route path="/fillcasefinal" element={<FillCasefinal />} />
        <Route path="/fillsocialser1" element={<FillSocialser1 />} />
        <Route path="/fillwarrant" element={<FillWarrant />} />
        <Route path="/fillwarrant/view_ss" element={<ViewSocialser />} />
        <Route path="/fillwitness" element={<FillWitness />} />
        <Route path="/filldrivingli" element={<FillDrivingLi />} />
        <Route path="/uservocation" element={<UserVocation />} />
        <Route path="/uservocation_st" element={<UserVocationSt />} />
        <Route path="/caseECMS" element={<CaseECMS />} />
        <Route path="/fillven" element={<FillVen />} />
        <Route path="/paper" element={<Paper />} />
        <Route path="*" element={<NoPage />} />
      </Route>
    </Routes>
  
  </Row>

  </Container>
  </BrowserRouter>
  </>
  );
}

export default App;
