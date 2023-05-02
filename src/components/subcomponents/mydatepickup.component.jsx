import React, { useState } from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import 'moment/locale/th';

function MyDatepickup(props) {
    const [dateData, setDateData] = useState( new Date() );

    const renderYear = (props, year, selectedDate) => {
        return <td {...props}>{year +543}</td>;
    }

    const handleChange = (moment) => {
        setDateData(moment.format());
        if (props.onChange) {
          props.onChange(moment);
        }
      };
    
  
    return (
      <Datetime
        value={moment(dateData)}
        onChange={ handleChange }
        inputProps={{ placeholder: 'Select a date and time' }}
        locale="th"
        format="DD/MM/YYYY"
        timeFormat={false}
        closeOnSelect={true}
        // defaultValue={ new Date() }
        closeOnClickOutside={true}
        renderYear={renderYear}
      />
    );
}
export default MyDatepickup;