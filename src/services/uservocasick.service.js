import axios from "axios";
import FileSaver from 'file-saver';
import authHeader from './auth-header';
const URL_Node = `${process.env.REACT_APP_NODE_API || 'localhost:8080'}`;
const API_URL = `http://${URL_Node}/api/`;

class UserVocationService {

async UserStaticVS (id) { 
    let data = { "id": id };
    return await axios.post(API_URL+'mysql/static_vs/', data,{headers: authHeader()}); 
    // return await axios.post(API_URL+'mysql/static_vs/', data );
}
async UserHistoryVS (id) { 
    let data = { "id": id };
    return await axios.post(API_URL+'mysql/history_vs/', data); 
}
async AddVS (data) { 
    return await axios.post(API_URL+'mysql/add_vs/', data); 
}
async UpdateVS (data) { 
    return await axios.put(API_URL+'mysql/update_vs/', data); 
}
async DeleteVS (data) { 
    return await axios.delete(API_URL+'mysql/del_vs/'+data); 
}
async getWord_V(id){
    let data = { "id": id };
    await axios.post(API_URL+'mysql/fill_word_v/', data, { responseType: 'blob' })
    .then(res => {
      return FileSaver.saveAs(new Blob([res.data]), `fill_v_${id}.docx`);
  }).catch(err => console.log(err) );
}
async getWord_S(id){
    let data = { "id": id };
    await axios.post(API_URL+'mysql/fill_word_s/', data, { responseType: 'blob' })
    .then(res => {
      return FileSaver.saveAs(new Blob([res.data]), `fill_s_${id}.docx`);
  }).catch(err => console.log(err) );
}
async getStaticVs () { 
    return await axios.get(API_URL+'admin/viewStaticVs/'); 
}
async getDetailStaticVs (id) { 
    return await axios.get(API_URL+'admin/viewDetailStaticVs/'+id); 
}
async AddLate (id_uvs, id_user, date_present) { 
    let data = { "id_uvs": id_uvs, "id_user": id_user, "date_present": date_present };
    return await axios.post(API_URL+'admin/addlate/', data); 
}

}
export default new UserVocationService();