import React, { useState, useRef, useCallback } from 'react'
import GaugeChart from 'react-gauge-chart'
import { Button } from 'reactstrap';
import '@fortawesome/fontawesome-free/js/all.js';

function GuageComponent() {
    const chartStyle = { marginTop: '70px', color: 'black' }

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


    return (
        <div>
            <div style={{ maxWidth: "500px", margin: "auto" }}>
                <GaugeChart
                    id="gauge-chart1"
                    nrOfLevels={20}
                    percent={GasReading}
                    style={chartStyle}
                    textColor='black'
                    colors={["#46BCFF", "#028BFF"]}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>

                <Button onClick={onStartButtonClick} color="info" style={{ width: '200px', maxWidth: '40%', margin: '5px' }}>Connect <i class="fab fa-bluetooth"></i></Button>
                <Button onClick={onStopButtonClick} color="info" style={{ width: '200px', maxWidth: '40%', margin: '5px' }}>Disconnect</Button>

            </div>
        </div>
    )
}

export default GuageComponent
