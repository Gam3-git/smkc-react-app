const moment = require('moment');
const ViewRemainT = (props) =>  {

  const printStyles = `
  @media print { @page { size: A4 landscape; }
    body { font-family: Sarabun, sans-serif; -webkit-print-color-adjust: exact; } } `;

  const casedata = props.data;

  const card_El = (num) => {

    let  data_day = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' } );
    let  data_time = num ? moment(num.dateremain_detail).format('HH:mm') : null;
    delete num.dateremain_detail; delete num.id;
    let data_card = Object.values(num).reduce((acc, value) => acc + value, 0);
    
    return(
      <div className="card text-white bg-danger">
      <div className="card-header">
        <h5 className="text-center"> จำนวนคดีค้างทั้งหมด </h5>
        <h6 className="text-center">  ข้อมูล ณ วันที่ : {data_day}  เวลา { data_time } น. </h6>
      </div>
      <div className="card-body">
        <h1 className="card-title">{ data_card } คดี</h1>
        <p className="btn btn-danger"
        onClick={() => { Detailclick(1); }}
        >รายละเอียด</p>
      </div>
    </div>
    );
  };

  const card_El2 = (num) => {
    
    let sum1 = num["3mB"] + num["3mP"] + num["3mR"];
    let sum2 = num["6mB"] + num["6mP"] + num["6mR"];
    let sum3 = num["1yB"] + num["1yP"] + num["1yR"];
    let sum4 = num["2yB"] + num["2yP"] + num["2yR"];
    let sum5 = num["3yB"] + num["3yP"] + num["3yR"];
    let sum6 = num["4yB"] + num["4yP"] + num["4yR"];
    let sum7 = num["5yB"] + num["5yP"] + num["5yR"];
    let sum8 = num["6yB"] + num["6yP"] + num["6yR"];
    let  data_card = [ sum1,sum2,sum3,sum4,sum5,sum6,sum7,sum8 ];
    
    return(
      <div className="row justify-content-center mt-2">
        { data_card && data_card.map((value, index) => (
        <div className="col-3 text-center mt-2" key={index}>
        <div className={index > 3 ? "card text-white bg-dark" : "card bg-info"}>
        <div className="card-header">
            { textCard(index) }
        </div>
        <div className="card-body">
          <h1 className="card-title">{ value } คดี</h1>
          <button className={index > 3 ? "btn btn-dark" : "btn btn-info"}
          onClick={() => { Detailclick(index+2); }}
          >รายละเอียด</button>
        </div>
        </div>
        </div>
        ))}
      </div>
    );
  };

  const textCard = (num) => {
    switch(num+1){
      case 1 : return 'ค้างไม่เกิน 3 เดือน';
      case 2 : return 'ค้างไม่เกิน 6 เดือน';
      case 3 : return 'ค้างไม่เกิน 1 ปี';
      case 4 : return 'ค้างไม่เกิน 2 ปี';
      case 5 : return 'ค้างไม่เกิน 3 ปี';
      case 6 : return 'ค้างไม่เกิน 4 ปี';
      case 7 : return 'ค้างไม่เกิน 5 ปี';
      case 8 : return 'ค้างเกิน 5 ปี';
      default : return 'ค้าง';
    }
  }

  const Detailclick = (num) => {
    let URL_newtab = window.location.href;
    window.open(`${URL_newtab}?type_id=${num}`, '_blank');
  }

  return (
      <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
          <div className="col-5 text-center mt-2"> 
              { card_El(casedata[0]) }
          </div>
          <div className="col-12"> 
              { card_El2(casedata[0]) }
          </div>
      </>
  );

};

export default ViewRemainT;
