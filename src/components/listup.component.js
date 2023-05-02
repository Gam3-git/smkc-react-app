import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "react-data-table-component";
import Swal from 'sweetalert2'

import Service from "../services/admin.service";
import { ChkUser } from "../services/chkuser.service";


const FilterComponent = ({ filterText, onFilter, onClear }) => (

        <div className="col-md-4">
        <div className="input-group">
          <span className="input-group-text">กรอง :</span>
        <input
          className="form-control form-control-sm"
    			name="search"
    			type="text"
    			value={filterText}
    			onChange={onFilter}
    		/>
            <button className="btn btn-dark" onClick={onClear}> Clear </button>
      </div></div>
    		
);


const ListUP = () =>  {

    const [datatable, setDatatable] = useState([]);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [showAdd, setShowAdd] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        
        const user = ChkUser();
        if(!user){ navigate('/'); } 
        
        Service.getListUP(user.id)
        .then((res) => { 
            setDatatable(res.data); 
            setFilteredItems(res.data); 
        }).catch((error) =>{
            const resMessage = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
            console.log(resMessage);
            Swal.fire( 'ไม่พบข้อมูล','','error' );
            setDatatable([]); 
            setFilteredItems([]);
            setShowAdd(false);
        });
    
      },[ navigate ]);

    useEffect(() => {
        if(filterText.length < 0){ setFilteredItems(datatable); }
        let data_name_pro = datatable.filter( item => item.name_pro ? item.name_pro.includes(filterText) : ""  );
        let data_user_n = datatable.filter( item => item.user_n ? item.user_n.includes(filterText) : ""  );
        let data_remark = datatable.filter( item => item.remark ? item.remark.includes(filterText) : ""  );
        
        let data = [data_name_pro,data_user_n, data_remark]
        .reduce((acc, current) => { return acc.length > 0 ? acc : current; });
        setFilteredItems(data);
        // eslint-disable-next-line 
    },[filterText]);

    const columns = [
        { name: '#Id', selector: row => row.id_up, center: true, sortable: true, grow:0 },
        { name: 'ชื่อระบบ/โปรแกรม/URL', cell: (row) => <>
            { row.url_pro.startsWith('http') ? 
            <a href={row.url_pro} target='_blank' rel="noreferrer">{row.name_pro}</a>
            : <p>{row.name_pro}</p>
            } 
          </> , grow:1.2, },
        { name: 'Username', cell: row => row.user_n, },
        { name: 'Password', cell: row => row.pass_w, },
        { name: 'หมายเหตุ', cell: row => <> { row.remark } </>, grow:1.5, },
        { name: '-', cell: (row) => 
            <>
            {/* <button className="btn btn-warning btn-sm  mx-1" onClick={ handleDel } id={ row.id_user }>Edit</button>  */}
            <button className="btn btn-danger btn-sm  mx-1" onClick={ handleDel } id={ row.id_up }>ลบ</button> 
            </>, grow:0.5,
        },
    ];

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
        if (filterText) {
            setResetPaginationToggle(!resetPaginationToggle);
            setFilterText('');
        }
        };   
        return (
                <FilterComponent 
                    onFilter={e => setFilterText(e.target.value)} 
                    onClear={handleClear} 
                    filterText={filterText} />
                );
    }, [filterText, resetPaginationToggle]);

    const handleSubmit = (event) => {
      event.preventDefault();
        let program_name = document.querySelector("#program_name").value ;
        let url_name = document.getElementById('url_name').value ;
        let user_name = document.getElementById('user_name').value ;
        let pass_word = document.getElementById('pass_word').value ;
        let remark = document.getElementById('remark').value ;
        let id_user = JSON.parse(localStorage.getItem('user')).id;
      const arr_output = [program_name,url_name,user_name,pass_word,remark,id_user];
      
      if(program_name.length <= 0 || user_name.length <= 0) { 
        return Swal.fire( 'ระบุชื่อระบบ/โปรแกรม/รหัสผู้ใช้','','error' ); 
      } else {
        Service.addListUP(arr_output).then(res => {
          Swal.fire( 'บันทึกสำเร็จ','','success' ); 
          setTimeout( ()=>  window.location.reload(),800);
        }).catch(err => console.log(err));
        // document.querySelector("#program_name").value = ''; 
        // document.getElementById('url_name').value  = '';
        // document.getElementById('user_name').value  = '';
        // document.getElementById('pass_word').value  = '';
        // document.getElementById('remark').value  = '';
      }
    };
    
    // const handleEdit = (data) => {
    //     navigate('/edit', { state: { id: data.target.id } });
    // };

    const handleDel = (data) => {
        let id_send = parseInt(data.target.id);
        Swal.fire({
            title: 'ยืนยันการลบ?', showDenyButton: true, showCancelButton: false,
            confirmButtonText: 'ใช่', denyButtonText: `ยกเลิก`,
          }).then((result) => {
            if (result.isConfirmed) { 
                Service.delListUP(id_send).then( res => { 
                    Swal.fire( `สำเร็จ : ${res.data.message}`, '', 'success' );
                    setTimeout( ()=>  window.location.reload(),800);
                } ).catch(err => { 
                    console.log(err.response.data.message);
                    Swal.fire(err.response.data.message,'','error');
                } );
                
            } 
            else if (result.isDenied) { Swal.fire('ยกเลิก', '', 'info') }
          });
    };


  return (
    <>
      <h3 className="bg-dark text-warning text-center py-2">รายการรหัสผู้ใช้ และ รหัสผ่าน ระบบงานภายในศาล</h3>
      <div className='col-1'></div>
      <div className='col-10 text-center'>
          <button className={showAdd ?'form-control btn btn-dark':'form-control btn btn-primary'} 
          onClick={()=>{ setShowAdd(!showAdd) }} > เพิ่มข้อมูลใหม่ </button>
          { showAdd && <>  
            <div className="card">
            <div className="card-body">
            <form onSubmit={handleSubmit}>
            <div className='row justify-content-center'>
              <div className='col-5'>
                  <label htmlFor="program_name">ชื่อระบบ / โปรแกรม</label>
                  <input type="text" className="form-control" id="program_name" />
                  <label htmlFor="url_name">ที่อยู่ระบบ (URL)(ถ้ามี) รูปแบบ : https://cios.coj.go.th</label>
                  <input type="text" className="form-control" id="url_name" />
              </div>
              <div className='col-3'>
                  <label htmlFor="user_name">ชื่อผู้ใช้งาน (Username)</label>
                  <input type="text" className="form-control" id="user_name"  />
                  <label htmlFor="pass_word">รหัสผู้ใช้งาน (Password) </label>
                  <input type="text" className="form-control" id="pass_word" /> 
                  <button className="form-control btn btn-primary mt-4" type="submit">บันทึก</button>
              </div>
              <div className='col-4'>
                  <label htmlFor="remark">หมายเหตุ</label>
                  <textarea type="text" className="form-control" id="remark" rows={4} /> 
              </div>
            </div>
            </form>
            </div>
            </div>
          </>}
      </div>
      <div className='col-12'>
        { filteredItems && <h4 className="text-primary text-center pt-2"> พบข้อมูล {filteredItems.length} รายการ </h4>}
        <DataTable
            // title = "รหัสผู้ใช้ และ รหัสผ่าน ระบบงาน"
            columns = {columns}
            data = {filteredItems}
            highlightOnHover 
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            // dense
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
        />
        </div>
    </> 
  );

};

export default ListUP;