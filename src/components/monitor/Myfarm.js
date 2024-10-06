import React, { useState } from 'react';
import { Container, Row, Col, Form, Card, InputGroup, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Myfarm.css'; 
import { FaCloudSun, FaSearch } from 'react-icons/fa';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

function Myfarm() {
    const [city, setCity] = useState('');
    const [soilData, setSoilData] = useState({});
    const [weatherData, setWeatherData] = useState({});
    const [showAlert, setShowAlert] = useState(false);

    const handleCityChange = (e) => {
        setCity(e.target.value);
        if (showAlert) setShowAlert(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (city.trim() === '') {
            setShowAlert(true);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/get_data', { place: city });
            setWeatherData(response.data.weather);
            setSoilData(response.data.soil);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <Container fluid className="soil-container d-flex flex-column justify-content-center align-items-center min-vh-100">
            <Card className="search-card mb-4 shadow-lg">
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className="align-items-center">
                            <Col xs={12} md={8} className="mb-3 mb-md-0">
                                <InputGroup>
                                    
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter city name"
                                        aria-label="City Name"
                                        aria-describedby="search-icon"
                                        value={city}
                                        onChange={handleCityChange}
                                        className="rounded-pill"
                                    />
                                </InputGroup>
                            </Col>
                            <Col xs={12} md={4} className="text-center cloud-pattern">
                                <FaCloudSun size={24} className="me-2" />
                                <span>Cloud Pattern</span>
                            </Col>
                        </Row>

                        <Row className="mt-4">
                            <Col className="text-center">
                                <Button
                                    type="submit"
                                    className="submit-button"
                                    variant="success"
                                >
                                    Submit
                                </Button>
                            </Col>
                        </Row>

                        {showAlert && (
                            <Row className="mt-3">
                                <Col>
                                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                                        Please enter a city name.
                                    </Alert>
                                </Col>
                            </Row>
                        )}
                    </Form>
                </Card.Body>
            </Card>
            <div className='circleprogress'>
                <div style={{ width: 100, height: 100, margin: '3rem' }}>
                    <CircularProgressbar 
                        value={weatherData.main?.temp_celsius} // Accessing temp_celsius here
                        text={`${weatherData.main?.temp_celsius.toFixed(2)}°C`} // Display with 2 decimal points
                    />
                    <h7>Temperature (°C)</h7>
                </div>
                <div style={{ width: 100, height: 100, margin: '3rem' }}>
                    <CircularProgressbar 
                        value={weatherData.main?.humidity} 
                        text={`${weatherData.main?.humidity}%`} 
                    />
                    <h7>Humidity</h7>
                </div>
                <div style={{ width: 100, height: 100, margin: '3rem' }}>
                    <CircularProgressbar 
                        value={weatherData.clouds?.all} 
                        text={`${weatherData.clouds?.all}%`} 
                    />
                    <h7>Cloud Coverage</h7>
                </div>
                <div style={{ width: 100, height: 100, margin: '3rem' }}>
                    <CircularProgressbar 
                        value={weatherData.wind?.speed} 
                        maxValue={10} 
                        text={`${weatherData.wind?.speed} m/s`} 
                    />
                    <h7>Wind (m/s)</h7>
                </div>
            </div>
            <Card className="soil-properties-card shadow-lg">
                <h3>Soil Properties</h3>
                <Card.Body>
                    <Row className="mb-3">
                        <Col xs={4} className="label">
                            <strong>Soil Type:</strong>
                        </Col>
                        <Col xs={8} className="value text-dark">
                            {soilData.soil_type || 'N/A'}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={4} className="label">
                            <strong>BDOD Value:</strong>
                        </Col>
                        <Col xs={8} className="value text-dark">
                            {soilData.bdod_value || 'N/A'}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Myfarm;
