import React from 'react'
import { Container, Row, Col } from 'reactstrap';
import './HomePageComponent.css'
import GetCarFormComponent from './GetCarFormComponent/GetCarFormComponent';
import { useHttpClient } from '../hooks/useHttpClient'
import { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import { Alert } from 'reactstrap';
import DriverInfoComponent from './DriverInfoComponent/DriverInfoComponent';
import MapComponent from './DriverInfoComponent/MapComponent/MapComponent';

import QrComponent from './QrComponent/QrComponent'


function HomePageComponent(props) {

    const maintainance_period = 30; // max time for maintainance gap in days TODO: fetch this value from the db


    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);


    const [FetchedCar, setFetchedCar] = useState(null);
    const [ScannedQr, setScannedQr] = useState(null);
    const [UpdatedCar, setUpdatedCar] = useState(null);


    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    useEffect(() => {
        console.log(ScannedQr)
    }, [ScannedQr])

    const onCancel = () => {
        setFetchedCar(null)
        setScannedQr(null)
        setUpdatedCar(null)
    }


    const Find_maint_state = (car) => {
        let str = car.maintenances[car.maintenances.length - 1];
        let date = moment(str);
        let last_maint_date = date.utc().format('DD-MM-YYYY');

        //calculating reamaing days for maintainance 
        let current_date = moment()
        let date_diff = current_date.diff(date, 'days')
        if (date_diff <= maintainance_period) {
            return (
                <Alert color="success">
                    Car can be fuled
                </Alert>
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


    return (

        <>
            <div style={{}}>

                <div>
                    {/* {FetchedCar?.data[0].qr_str ? */}
                    {ScannedQr === FetchedCar?.data[0].qr_str ?

                        <Container className='driver_info_container' style={{ padding: 0 }}>
                            {/* {Find_maint_state(FetchedCar?.data[0])} */}
                            <DriverInfoComponent car={FetchedCar?.data[0]} />
                            <Button style={{ height: "50px", width: "80%", marginTop: "30px" }} color="danger" onClick={onCancel}>Sign out</Button>

                        </Container>
                        :
                        <Container className='Form_container' style={{ marginTop: '0px' }}>
                            <Row>
                                <Col xs="12" md="4">
                                    <div className='page_title' > Driver Account</div>
                                    <div className='page_sub_title' > Enter your car's plate info then scan the QR code to log in to your account</div>
                                    <GetCarFormComponent setFetchedCar={setFetchedCar} />
                                </Col>
                                <Col xs="0" md="1">
                                </Col>
                                <Col xs="12" md="7">
                                    <div>
                                        {FetchedCar &&
                                            <>
                                                <div style={{ width: '90%', marginTop: "30px", margin: '30px auto 30px auto' }}>
                                                    <button className='scan_qr_button' style={{ width: '100%' }} color="success" onClick={toggle}>
                                                        <div style={{ marginLeft: '10px' }}> SCAN QR CODE</div>
                                                        <img style={{ marginRight: '10px', height: '50px' }} src='/qr_logo.png' alt='qr' />
                                                    </button>
                                                </div>
                                                <Modal isOpen={modal} toggle={toggle}>
                                                    <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                                                    <ModalBody>
                                                        {!toggle ? <div>test</div> :
                                                            <QrComponent setScannedQr={setScannedQr} />
                                                        }
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button color="danger" onClick={toggle}>Cancel</Button>
                                                    </ModalFooter>
                                                </Modal>
                                            </>
                                        }
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    }
                </div>



            </div >
        </>
    )
}

export default HomePageComponent
