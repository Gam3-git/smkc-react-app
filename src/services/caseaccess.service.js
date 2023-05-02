import axios from "axios";
import FileSaver from 'file-saver';

const URL_Node = `${process.env.REACT_APP_NODE_API || 'localhost:8080'}`;
const API_URL = `http://${URL_Node}/api/access/`;
const APIMYSQL_URL = `http://${URL_Node}/api/mysql/`;

const ECMS_IP = `${process.env.REACT_APP_ECMS_IP || ''}`;

class CaseAccessService {

    // run bat on node copy db access
    async getSync_db(){
      return await axios.get(API_URL+'runBat/'); 
    }

    // chk time db use
    async getChk_db(){
      return await axios.get(API_URL+'chkDBA/'); 
    }

    // service_findmaincase access 2003
    async getMainCase(text_search){
      let data = { "casetext": `${text_search}`};
      return await axios.post(API_URL+'service_findmaincase/',data); 
    }
    // service_findmaincase access 2003

    // zone calculte static
    async getAll_Remain(){
      return await axios.get(API_URL+'all_remain/'); 
    }
    async getDetail_Remain(num){
      return await axios.get(API_URL+'detail_remain/'+num); 
    }
    async getDel_Remain(){
      return await axios.get(API_URL+'del_remain/'); 
    }
    // zone calculte static


    // get case IN Day by type
    async getCaseDay(type,datechk){
      let data = { "date_select":type , "caseDay": datechk};
      return await axios.post(API_URL+'caseDay/',data); 
    }

    // get data thailandpost
    async getPostCase(type,text_search){
      let data = { "id":type , "text": text_search};
      return await axios.post(API_URL+'post_case/',data); 
    }

    // get data for casefinal
    async getCerJud(text_search){
      let data = { "caseid": `${text_search}`};
      return await axios.post(API_URL+'cer_jud/',data); 
    }
    // get jud for casefinal
    async getJud_List(){
      return await axios.get(API_URL+'jud_list/'); 
    }
    async getBookNameFind(){
      return await axios.get(API_URL+'book_name_find/'); 
    }


    // fill docx casefinal
    async getReport_CerJud(data){
      await axios.post(API_URL+'cer_report/', data, { responseType: 'blob' })
      .then(res => {
      return FileSaver.saveAs(new Blob([res.data]), `fill_final_${data.Blackcase}.docx`);
    }).catch(err => console.log(err) );
    }

      // zone social service data
    async getSocialservice1(text_search){
      let data = { "casetext": `${text_search}`};
      return await axios.post(API_URL+'form_service1/',data); 
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

    // zone witness
    async getWitness(text_search){
      let data = { "casetext": `${text_search}`};
      return await axios.post(API_URL+'form_witness/',data); 
    }
    async getReport_Word(data){
      await axios.post(API_URL+'fill_word_report/', data, { responseType: 'blob' })
      .then(res => {
      return FileSaver.saveAs(new Blob([res.data]), `fill_w${data.form_type}_${data.Blackcase}.docx`);
    }).catch(err => console.log(err) );
    }
    // zone witness

    // zone E-CMS service API
    async uploadECMS(value){
      let API_ECMS = `http://${ECMS_IP}:8080/pxapi/api/v1/dmsDocuments/createDocConnec?api_key=praXis`;
      let data = value;
      return await axios.post(API_ECMS, data,{ headers: { 'Content-Type': 'application/json' } });
    }
    async ECMS_fileAtt(case_t,id_user) {
      var func_sel = 'getAttachByDocName';
      var casetext = case_t;
      var cojUser = id_user;
      var url = `http://${ECMS_IP}:8080/pxapi/api/v1/dmsDocuments/${func_sel}/order?version=1
      &offset=0&limit=20&sort=createdDate&dir=desc&linkType=dms
      &text01=${casetext}&coj350User=${cojUser}&api_key=praXis`;
      var response = await fetch(url);
      var data_f = await response.json();
      return data_f.data ; 
    }
    async ECMS_filetype(id) {
        var url = `http://${ECMS_IP}:8080/pxapi/api/v1/FileAttachType/${id}?version=1&api_key=praXis`;
        const response = await fetch(url);
        const data_s = await response.json();
        return data_s.data ;
    }

    // zone E-CMS service API
    
}

export default new CaseAccessService();