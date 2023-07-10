import axios from "axios";
import FileSaver from 'file-saver';

const URL_Node = `${process.env.REACT_APP_NODE_API || 'localhost:8080'}`;
const API_URL = `http://${URL_Node}/api/access/`;
const APIMYSQL_URL = `http://${URL_Node}/api/mysql/`;

const ip_webapp = `${process.env.REACT_APP_API}`;
// const id_court = `${process.env.REACT_APP_COURT_CODE}` ;

class Case160Service {

  async setToken() {
    const user_connect = { 
      "user":`${process.env.REACT_APP_USER}`,
      "pass":`${process.env.REACT_APP_PASS}` 
    };
      const url = `http://${ip_webapp}/cojUser/api/v1/users/login`;
      const postBody = {"version":1,"name":user_connect.user,"passwords":user_connect.pass};
      try {
        const response = await axios.post(url, postBody);
        const data = response.headers.authorization;
        return  localStorage.setItem("TOKEN_160", data.replace("Bearer ", ""));
    
      } catch (error) {
        console.log('Error:', error);
        return null;
      }
  }

  async getReport_CerJud(data){
    await axios.post(API_URL+'cer_report/', data, { responseType: 'blob' })
    .then(res => {
    return FileSaver.saveAs(new Blob([res.data]), `fill_final_${data.Blackcase}.docx`);
  }).catch(err => console.log(err) );
  }

  async getReport_Word(data){
    await axios.post(API_URL+'fill_word_report/', data, { responseType: 'blob' })
    .then(res => {
    return FileSaver.saveAs(new Blob([res.data]), `fill_w${data.form_type}_${data.Blackcase}.docx`);
  }).catch(err => console.log(err) );
  }

  // zone social service paper
  async getReport_Socialser1(data){
    await axios.post(API_URL+'form_socialservice1/', data, { responseType: 'blob' })
    .then(res => {
      return FileSaver.saveAs(new Blob([res.data]), `fill_socialservice1_${data.Blackcase}.pdf`);
  }).catch(err => console.log(err) );
  }
  async getReport_Socialser2(data){
    await axios.post(API_URL+'form_socialservice2/', data, { responseType: 'blob' })
    .then(res => {
      return FileSaver.saveAs(new Blob([res.data]), `fill_socialservice2_${data.Blackcase}.pdf`);
  }).catch(err => console.log(err) );
  }
  async getReport_Socialser3(data){
    await axios.post(API_URL+'form_socialservice3/', data, { responseType: 'blob' })
    .then(res => {
    return FileSaver.saveAs(new Blob([res.data]), `fill_ss3_${data.Blackcase}.docx`);
  }).catch(err => console.log(err) );
  }
  async getReport_Socialser4(data){
    await axios.post(API_URL+'form_socialservice4/', data, { responseType: 'blob' })
    .then(res => {
    return FileSaver.saveAs(new Blob([res.data]), `fill_ss4_${data.Blackcase}.pdf`);
  }).catch(err => console.log(err) );
  }
  // zone social service paper


  // add and view data to mysql social service
  async add_Socialser1(data){ return await axios.post(APIMYSQL_URL+'add_ss1/',data); }
  async add_Socialser4(data){ return await axios.post(APIMYSQL_URL+'add_ss4/',data); }
  async view_Social(type_id){ return await axios.get(APIMYSQL_URL+'view_ss/'+type_id);}
  async del_Social(type_id){ return await axios.get(APIMYSQL_URL+'del_ss/'+type_id);}
  async view_SocialWithCase(ss_id,type_id){ 
    let data = { "ss_id": `${ss_id}`, "type_id": `${type_id}` };
    return await axios.post(APIMYSQL_URL+'view_ss_withcase/',data);
  }
  // add and view data to mysql social service  


  async getSearchCase( casesearch, type){
    let token = localStorage.getItem("TOKEN_160");
    if(!token){
      await this.setToken();
      token = localStorage.getItem("TOKEN_160");
    }

    let postBody
    const url = `http://${ip_webapp}/cojInformation/api/v1/information/searchInformationCase/search?version=1&sort=accuDesc`;
    switch(type){
      case 1 :
        postBody = {"version":1,"offset":0,"limit":10,"blackTitleName":casesearch[0],"blackIdnum":casesearch[1],"blackYear":casesearch[2]};
        break;
      case 2 : 
        postBody = {"version":1,"offset":0,"limit":10,"redTitleName":casesearch[0],"redIdnum":casesearch[1],"redYear":casesearch[2]};
        break;
      default : 
      postBody = {"version":1,"offset":0,"limit":10,"blackTitleName":casesearch[0],"blackIdnum":casesearch[1],"blackYear":casesearch[2]};
        
    }
    
    const url1 = `http://${ip_webapp}/cojCase/api/v1/case/`;
    const url2 = `http://${ip_webapp}/cojJudgement/api/v1/judgement/getByCaseId/`;
    const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
    try {
      const response = await axios.post(url, postBody, config);
      const res1 = await axios.get(url1+response.data.data[0].caseId, config);
      const res2 = await axios.get(url2+response.data.data[0].caseId, config);

      return  { 
        "caseId": response.data.data[0], 
        "caseBlack": res1.data.data,
        "caseRed": res2.data.data
      } ;

    } catch (error) {
      console.log('Error:', error);
      return null;
    }
  }


}

export default new Case160Service();