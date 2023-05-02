// import React from 'react';
// import ReactDOM from 'react-dom/client';

import Service from "../services/admin.service";
import '../index.css';


function  Paper () {
const butt_F = () =>{
  Service.paperU();
  console.log('paper click');
}
    return ( 
    <div>
      <p> Page </p>
      <button onClick={butt_F}> put paper</button>

    </div>
     ) ;
}


export default Paper;