import React from 'react'
import './DriverInfoComponent.css'
import { useState } from 'react'
import MapComponent from './MapComponent/MapComponent'
import { Alert } from 'reactstrap';
import moment from 'moment';
import GuageComponent from './GuageComponent/GuageComponent';


function DriverInfoComponent(props) {

    const maintainance_period = 30; // max time for maintainance gap in days TODO: fetch this value from the db

    const Find_maint_state = (car) => {
        let str = car.maintenances[car.maintenances.length - 1];
        let date = moment(str);
        // let last_maint_date = date.utc().format('DD-MM-YYYY');

        //calculating reamaing days for maintainance 
        let current_date = moment()
        let date_diff = current_date.diff(date, 'days')
        if (date_diff <= maintainance_period) {
            return (
                <div>

                    <div className='days_count'> {maintainance_period - date_diff}</div>
                    <div className='days_text'>days remaining in maintainance allowance</div>
                </div>
            )
        }
        else {
            return (
                <Alert color="danger">
                    Needs maintainence
                </Alert>
            )
        }
    }


    const [Display, setDisplay] = useState('maint')
    const display_body = (display_state) => {
        if (display_state === 'maint') {
            return (
                <div>
                    {Find_maint_state(props.car)}

                </div>
            )
        }
        else if (display_state === 'dial') {

            return (
                <div>
                    <GuageComponent />
                </div>
            )
        }
        else if (display_state === 'map') {
            return (
                <div className="map_wrapper" style={{ width: '100%', height: '100%' }}>
                    <MapComponent />
                </div>
            )
        }
    }
    return (
        <div>
            {/* <div className='signed_as_div'></div> */}
            <div className='main_body_div'>
                {display_body(Display)}
            </div>
            <div className='navigation_div'>
                <div onClick={() => { setDisplay('maint') }} className='info_button maint_button'>
                    <img className='info_button_image' src='/tools.png' alt='maintainance' />
                </div>
                <div onClick={() => { setDisplay('dial') }} className='info_button dial_button'>
                    <img className='info_button_image' src='/dial.png' alt='dial' />
                </div>
                <div onClick={() => { setDisplay('map') }} className='info_button map_button'>
                    <img className='info_button_image' src='/map.png' alt='map' />
                </div>
            </div>
        </div>
    )
}

export default DriverInfoComponent
