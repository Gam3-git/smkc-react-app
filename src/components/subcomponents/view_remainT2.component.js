const moment = require('moment');
const ViewRemainT = (props) =>  {

  const printStyles = `
  @media print { @page { size: A4 landscape; }
    body { font-family: Sarabun, sans-serif; -webkit-print-color-adjust: exact; } } `;

  const data = props.data;
  let casedata = data[0] ; let sum1; let sum2; let sum3;
  if(Object.keys(casedata).length > 0){
    sum1 = casedata["3mB"]+casedata["6mB"]+casedata["1yB"]+casedata["2yB"]+casedata["3yB"]+casedata["4yB"]+casedata["5yB"]+casedata["6yB"];
    sum2 = casedata["3mP"]+casedata["6mP"]+casedata["1yP"]+casedata["2yP"]+casedata["3yP"]+casedata["4yP"]+casedata["5yP"]+casedata["6yP"];
    sum3 = casedata["3mR"]+casedata["6mR"]+casedata["1yR"]+casedata["2yR"]+casedata["3yR"]+casedata["4yR"]+casedata["5yR"]+casedata["6yR"];
  }
  let data_day = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' } );
  let data_time = casedata ? moment(casedata.dateremain_detail).format('HH:mm') : null;
  return (
    <> 
    <style dangerouslySetInnerHTML={{ __html: printStyles }} />
    <div className="col-8"> 
    <div className="card my-2"> 

    <div className="card-header bg-info"> 
      <h5 className="text-center"> รายละเอียดข้อมูลคดีค้าง ตามประเภทคดี</h5> 
      <p className="text-center"> ข้อมูล ณ วันที่ : {data_day}  เวลา { data_time } น.</p>
    </div>

    <div className="card-body text-center">
      { casedata && <>
        <table className="table table-hover">
        <thead className="bg-info">
          <tr>
            <th scope="col">ระยะเวลาค้าง</th>
            <th scope="col">คดีผู้บริโภค</th>
            <th scope="col">คดีแพ่ง</th>
            <th scope="col">คดีอาญา</th>
            <th scope="col">รวม</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">ค้างไม่เกิน 3 เดือน</th>
            <td> {casedata["3mB"]} </td>
            <td> {casedata["3mP"]} </td>
            <td> {casedata["3mR"]} </td>
            <td> { casedata["3mB"] + casedata["3mP"] + casedata["3mR"] } </td>
          </tr>
          <tr>
          <th scope="row">ค้างไม่เกิน 6 เดือน</th>
            <td> {casedata["6mB"]} </td>
            <td> {casedata["6mP"]} </td>
            <td> {casedata["6mR"]} </td>
            <td> { casedata["6mB"] + casedata["6mP"] + casedata["6mR"] } </td>
          </tr>
          <tr>
          <th scope="row">ค้างไม่เกิน 1 ปี</th>
            <td> {casedata["1yB"]} </td>
            <td> {casedata["1yP"]} </td>
            <td> {casedata["1yR"]} </td>
            <td> { casedata["1yB"] + casedata["1yP"] + casedata["1yR"] } </td>
          </tr>
          <tr>
          <th scope="row">ค้างไม่เกิน 2 ปี</th>
            <td> {casedata["2yB"]} </td>
            <td> {casedata["2yP"]} </td>
            <td> {casedata["2yR"]} </td>
            <td> { casedata["2yB"] + casedata["2yP"] + casedata["2yR"] } </td>
          </tr>
          <tr>
          <th scope="row">ค้างไม่เกิน 3 ปี</th>
            <td> {casedata["3yB"]} </td>
            <td> {casedata["3yP"]} </td>
            <td> {casedata["3yR"]} </td>
            <td> { casedata["3yB"] + casedata["3yP"] + casedata["3yR"] } </td>
          </tr>
          <tr>
          <th scope="row">ค้างไม่เกิน 4 ปี</th>
            <td> {casedata["4yB"]} </td>
            <td> {casedata["4yP"]} </td>
            <td> {casedata["4yR"]} </td>
            <td> { casedata["4yB"] + casedata["4yP"] + casedata["4yR"] } </td>
          </tr>
          <tr>
          <th scope="row">ค้างไม่เกิน 5 ปี</th>
            <td> {casedata["5yB"]} </td>
            <td> {casedata["5yP"]} </td>
            <td> {casedata["5yR"]} </td>
            <td> { casedata["5yB"] + casedata["5yP"] + casedata["5yR"] } </td>
          </tr>
          <tr>
          <th scope="row">ค้างเกิน 5 ปี</th>
            <td> {casedata["6yB"]} </td>
            <td> {casedata["6yP"]} </td>
            <td> {casedata["6yR"]} </td>
            <td> { casedata["6yB"] + casedata["6yP"] + casedata["6yR"] } </td>
          </tr>
          <tr>
          <th scope="row">รวม</th>
            <td>{ sum1 }</td>
            <td>{ sum2 }</td>
            <td>{ sum3 }</td>
            <td>{ sum1+sum2+sum3 }</td>
          </tr>
        </tbody>
      </table>
      </> }
    </div>


    </div>
    </div>

    </>
    
  );

};

export default ViewRemainT;
