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
                className="form-control"
    			name="search"
    			type="text"
    			value={filterText}
    			onChange={onFilter}
    		/>
            <button className="btn btn-dark" onClick={onClear}> Clear </button>
      </div></div>
    		
);

const Setadmin = () =>  {

    const [datatable, setDatatable] = useState([]);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [userId, setUserId] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        Service.getUserView()
        .then((res) => { 
            setDatatable(res.data); 
            setFilteredItems(res.data); 
        })
        .catch((error) =>{
            const resMessage = (error.response && error.response.data &&
                error.response.data.message) || error.message || error.toString();
                Swal.fire( resMessage,'','error' )
                .then(()=> { 
                    Service.logout();
                    navigate('/login'); 
                    window.location.reload();
                });
        });
    
        const user = ChkUser();
        if(!user){ navigate('/'); } 
        if(user.roles === 'USER') { navigate('/profile'); } else { setUserId(user.id); }
    
    },[ navigate ]);

    useEffect(() => {
        if(filterText.length < 0){ setFilteredItems(datatable); }
        let data = datatable.filter( item => item.name_u ? item.name_u.includes(filterText) : ""  );
        setFilteredItems(data);
    },[filterText,datatable]);

    const TextRole = (role) => { 
            switch(role){
                case 1 : return 'Admin' ; 
                case 2 : return 'User' ;
                case 3 : return 'Oper' ;
                default : return 'User';
            }
    }

    const columns = [
        { name: 'ลำดับ', selector: row => row.order_position, grow: 0, center: true, sortable: true, },
        { name: 'ชื่อ-สกุล', selector: row => row.name_u, grow: 2, sortable: true,},
        { name: 'ตำแหน่ง', selector: row => row.position, grow: 2, sortable: true,},
        { name: 'แผนก/ส่วน', selector: row => row.department, grow: 2, sortable: true,},
        { name: '13 หลัก', selector: row => row.person_id, sortable: true,},
        { name: 'Roles/Work', selector: row => row.work_status, center: true, 
            cell: (row) => 
            <> 
                { TextRole(row.role) }  
                <br /> 
                { row.work_status === 1 ? 'ใช้งาน':'ไม่ได้ใช้งาน'} 
            </>,
            conditionalCellStyles: [
                { when: (row) => row.work_status === 0, classNames: ['text-danger'], },
                { when: (row) => row.work_status === 1, classNames: ['text-primary'], },
            ],
        },
        { name: 'หมายเหตุ', cell: (row) => 
            <>
            <button className="btn btn-warning btn-sm  mx-1" onClick={ handleEdit } id={ row.id_user }>Edit</button> 
            <button className="btn btn-danger btn-sm  mx-1" onClick={ handleDel } id={ row.id_user }>Del</button> 
            </>
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

    
    const handleEdit = (data) => {
        navigate('/edit', { state: { id: data.target.id } });
    };

    const handleDel = (data) => {
        let id_send = parseInt(data.target.id);
        Swal.fire({
            title: 'ยืนยันการลบ?', showDenyButton: true, showCancelButton: false,
            confirmButtonText: 'ใช่', denyButtonText: `ยกเลิก`,
          }).then((result) => {
            if (result.isConfirmed) { 
                Service.delUser(id_send,userId).then( res => { 
                    Swal.fire( `สำเร็จ : ${res.data.message}`, '', 'success' );
                    Service.getUserView()
                    .then((res) => { 
                        setDatatable(res.data); setFilteredItems(res.data); 
                    });
                } ).catch(err => { 
                    console.log(err.response.data.message);
                    Swal.fire(err.response.data.message,'','error');
                } );
                
            } 
            else if (result.isDenied) { Swal.fire('ยกเลิก', '', 'info') }
          });
    };

    const handleOrderChange = (type) => {
        let first_id = document.getElementById('first_id').value ;
        let last_id = document.getElementById('last_id').value ;
        if(first_id <=0 || last_id <= 0 ){ Swal.fire( `ระบุลำดับ`, '', 'error' ); }
        Service.orderPosition(type,first_id,last_id).then(res => {
            Swal.fire( `สำเร็จ : ${res.data.message}`, '', 'success' );
            setTimeout( ()=>  window.location.reload(),800);
        }).catch(err => Swal.fire( `Error : ${err.response.data.message}`, '', 'error' ) );
    }

  return (
    
    <div className="row justify-content-center">
        <div className='col-12'>

        <DataTable
            title = "รายชื่อเจ้าหน้าที่ทั้งหมด"
            columns = {columns}
            data = {filteredItems}
            highlightOnHover 
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            dense
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
        />
        </div>

        <div className='col-6'>
        <div className="card mb-1">
            <div className="card-header bg-dark text-warning"> ปรับช่วงลำดับ อาวุโส เพิ่ม/ลด </div>
            <div className="card-body">

                <div className="row">
                    <div className="col-4">
                        <label htmlFor="first_id">ตั้งแต่ลำดับ </label>
                        <input type="number" className="form-control" id="first_id"  />
                    </div>
                    <div className="col-4">
                        <label htmlFor="last_id">ถึงลำดับ </label>
                        <input type="number" className="form-control" id="last_id" /> 
                    </div>
                    <div className="col-2">
                        <button className="form-control btn btn-primary mt-4" type="button"
                            onClick={ () => handleOrderChange('increment')} >+ เพิ่ม</button>
                    </div>
                    <div className="col-2">
                        <button className="form-control btn btn-danger mt-4" type="button"
                            onClick={ () => handleOrderChange('decrement')} >- ลด</button>
                    </div>
                </div>
                
            </div>
        </div>
        </div>
    </div>
    
  );

};

export default Setadmin;