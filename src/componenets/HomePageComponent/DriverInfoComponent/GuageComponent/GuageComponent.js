import React, { useState, useRef, useCallback } from 'react'
import GaugeChart from 'react-gauge-chart'
import { Button } from 'reactstrap';
import '@fortawesome/fontawesome-free/js/all.js';

function GuageComponent(props) {
    const chartStyle = { marginTop: '70px', color: 'black' }



    return (
        <div>
            <div style={{ maxWidth: "500px", margin: "auto" }}>
                <GaugeChart
                    id="gauge-chart1"
                    nrOfLevels={20}
                    percent={props.GasReading}
                    style={chartStyle}
                    textColor='black'
                    colors={["#46BCFF", "#028BFF"]}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>

                <Button onClick={props.onStartButtonClick} color="info" style={{ width: '200px', maxWidth: '40%', margin: '5px' }}>Connect <i class="fab fa-bluetooth"></i></Button>
                <Button onClick={props.onStopButtonClick} color="info" style={{ width: '200px', maxWidth: '40%', margin: '5px' }}>Disconnect</Button>

            </div>
        </div>
    )
}

export default GuageComponent
