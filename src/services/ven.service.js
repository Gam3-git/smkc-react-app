import axios from "axios";
import FileSaver from 'file-saver';
import authHeader from './auth-header';
const URL_Node = `${process.env.REACT_APP_NODE_API || 'localhost:8080'}`;
const API_URL = `http://${URL_Node}/api/`;

class VenService {

    async UserVen (id) { 
        let data = { "uname": id };
        return await axios.post(API_URL+'ven/view_ven/', data,{headers: authHeader()}); 
    }
    async UserList () { 
        return await axios.get(API_URL+'ven/view_venu/'); 
    }

    }
export default new VenService();