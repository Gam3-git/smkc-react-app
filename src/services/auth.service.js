import axios from "axios";

const URL_Node = `${process.env.REACT_APP_NODE_API || 'localhost:8080'}`;
const API_URL = `http://${URL_Node}/api/`;

class AuthService {
  
  login(username, password) {
    return axios.post(API_URL+ "login" , {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  login_id(person_id) {
    return axios.post(API_URL+ "login_id" , {
        person_id
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(person_id, name_u, position, department, username, password) {
    return axios.post(API_URL + "signup", { person_id, name_u, position, department, username, password });
  }

  resetpass(person_id, username, password) {
    return axios.post(API_URL + "user/resetpass", { person_id, username, password });
  }

  getCurrentUser() { return JSON.parse(localStorage.getItem('user')); }

  async getCountUser() { 
    return await axios.get(API_URL);
   }

}

export default new AuthService();