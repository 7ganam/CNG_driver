import React, { useState, useRef, useCallback } from 'react'

import './DriverInfoComponent.css'
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



    // state for the gauge component -- this is defined here so the bluetooth connection is still available when user navigate out of the dial component
    const [GasReading, setGasReading] = useState(0)
    // 
    // let myCharacteristic;
    let myCharacteristic = useRef(null)

    const handleNotifications = useCallback((event) => {
        const value = new TextDecoder().decode(event.target.value);
        let _receiveBuffer = '';
        for (const c of value) {
            if (c === ';') {
                const data = _receiveBuffer.trim();
                _receiveBuffer = '';
                if (data) {
                    console.log('> ' + data / 5);
                    setGasReading(data / 5)
                }
            } else {
                _receiveBuffer += c;
            }
        }
    }, [])

    const onStartButtonClick = useCallback(async () => {
        let serviceUuid = '0xFFE0';
        if (serviceUuid.startsWith('0x')) {
            serviceUuid = parseInt(serviceUuid);
        }

        let characteristicUuid = '0xFFE1';
        if (characteristicUuid.startsWith('0x')) {
            characteristicUuid = parseInt(characteristicUuid);
        }

        try {
            console.log('Requesting Bluetooth Device...');
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [serviceUuid] }]
            });

            console.log('Connecting to GATT Server...');
            const server = await device.gatt.connect();

            console.log('Getting Service...');
            const service = await server.getPrimaryService(serviceUuid);

            console.log('Getting Characteristic...');
            myCharacteristic.current = await service.getCharacteristic(characteristicUuid);

            await myCharacteristic.current.startNotifications();

            console.log('> Notifications started');
            myCharacteristic.current.addEventListener('characteristicvaluechanged',
                handleNotifications);
        } catch (error) {
            console.log('Argh! ' + error);
        }
    }, [myCharacteristic, handleNotifications])

    const onStopButtonClick = useCallback(async () => {
        console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>. ');
        if (myCharacteristic.current) {
            try {
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>. ');
                myCharacteristic.current.removeEventListener('characteristicvaluechanged',
                    handleNotifications);
                await myCharacteristic.current.stopNotifications();
                console.log('> Notifications stopped');
                myCharacteristic.current.removeEventListener('characteristicvaluechanged',
                    handleNotifications);
            } catch (error) {
                console.log('Argh! ' + error);
            }
        }
    }, [myCharacteristic, handleNotifications])








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
                    <GuageComponent onStopButtonClick={onStopButtonClick} onStartButtonClick={onStartButtonClick} GasReading={GasReading} />
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
