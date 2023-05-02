import axios from "axios";
import authHeader from './auth-header';

const URL_Node = `${process.env.REACT_APP_NODE_API || 'localhost:8080'}`;
const API_URL = `http://${URL_Node}/api/admin/`;
const API_URL2 = `http://${URL_Node}/api/`;

class AdminService {

  getCurrentUser() { return JSON.parse(localStorage.getItem('user')); }
  logout() { localStorage.removeItem("user"); }

  async getUserView() {  return await axios.get(API_URL , { headers: authHeader() }); }
  async getUserId(id_user) {  return await axios.get(API_URL+'view/'+id_user); }
  async delUser(id_user,userId) { return await axios.get( API_URL+'deluser/'+id_user+'/'+userId ); }
  async editUser(id_user, person_id, name_u, position, department, 
    order_position, role, username, password, work_status, PassOld){
    return await axios.post(API_URL + "edituser", { id_user, person_id, name_u, position, department, 
    order_position, role, username, password, work_status, PassOld  }); }


  async getListUP (id) { 
      let data = { "id": id };
      return await axios.post(API_URL2+'mysql/list_up/', data); 
  }
  async addListUP (value) { 
    let data = value ;
    return await axios.put(API_URL2+'mysql/add_listup/', data); 
  }
  async delListUP(id) { return await axios.get(API_URL2+'mysql/del_listup/'+id); }

  async orderPosition (type,startId,endId) { 
    let data = { "type": type, "startId": startId, "endId": endId };
    return await axios.post(API_URL+'orderPosition/', data); 
  }
  async getUserVS(id_user) {  return await axios.get(API_URL+'viewVS/'+id_user); }
  async editUserVS(data){ return await axios.post(API_URL + "editVS",data); }
}

export default new AdminService();