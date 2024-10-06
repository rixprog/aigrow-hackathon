// Croppredict.jsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import './Croppredict.css';

const Croppredict = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorous: '',
    pottasium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${backendURL}/predict`, formData);

      if (response.status === 200) {
        setPrediction(response.data);
      } else {
        setError('Unexpected response from the server.');
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while fetching the prediction.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
     <h2 className="text-center">CROP PREDICTION</h2>
      <Form className="cropinputform" onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formNitrogen">
              <Form.Label>Nitrogen</Form.Label>
              <Form.Control
                type="number"
                name="nitrogen"
                value={formData.nitrogen}
                onChange={handleChange}
                placeholder="Enter nitrogen value"
                required
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formPhosphorous">
              <Form.Label>Phosphorous</Form.Label>
              <Form.Control
                type="number"
                name="phosphorous"
                value={formData.phosphorous}
                onChange={handleChange}
                placeholder="Enter phosphorous value"
                required
                min="0"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formPottasium">
              <Form.Label>Pottasium</Form.Label>
              <Form.Control
                type="number"
                name="pottasium"
                value={formData.pottasium}
                onChange={handleChange}
                placeholder="Enter pottasium value"
                required
                min="0"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formTemperature">
              <Form.Label>Temperature (°C)</Form.Label>
              <Form.Control
                type="number"
                name="temperature"
                value={formData.temperature}
                onChange={handleChange}
                placeholder="Enter temperature"
                required
                min="-50"
                max="60"
                step="0.1"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formHumidity">
              <Form.Label>Humidity (%)</Form.Label>
              <Form.Control
                type="number"
                name="humidity"
                value={formData.humidity}
                onChange={handleChange}
                placeholder="Enter humidity"
                required
                min="0"
                max="100"
                step="0.1"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="formPH">
              <Form.Label>pH Value</Form.Label>
              <Form.Control
                type="number"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
                placeholder="Enter pH value"
                required
                min="0"
                max="14"
                step="0.1"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="formRainfall">
              <Form.Label>Rainfall (mm)</Form.Label>
              <Form.Control
                type="number"
                name="rainfall"
                value={formData.rainfall}
                onChange={handleChange}
                placeholder="Enter rainfall"
                required
                min="0"
                step="0.1"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col className="text-center">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
            </button>
          </Col>
        </Row>
      </Form>


      <div className="centered-card mt-4">
        {error && <Alert variant="danger">{error}</Alert>}
        {prediction && (
          <Card>
            <Card.Header as="h5">PREDICTION RESULT</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong>Crop:</strong> {prediction.crop}
              </Card.Text>
              <Card.Text>
                <strong>Probability:</strong> {(prediction.probability * 100).toFixed(2)}%
              </Card.Text>
            </Card.Body>
          </Card>
        )}
      </div>  
    </Container>

  );
};

export default Croppredict;
