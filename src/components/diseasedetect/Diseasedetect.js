import React, { useState } from 'react';
import './Diseasedetect.css'; // Ensure to create this CSS file

const Diseasedetect = () => {
  const [image, setImage] = useState(null);
  const [diseaseName, setDiseaseName] = useState('');

  // Function to handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to simulate disease detection (for demonstration purposes)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a detected disease name (replace with actual detection logic)
    setDiseaseName('Detected Disease: Leaf Spot');
  };

  return (
    <div className="container">
      <h2 className="header">Plant Disease Detector</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          <strong style={{marginRight:'2rem'}}>Upload Image of Plant Disease</strong>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="file-input"
          />
        </label>
        {image && (
          <div className="image-preview">
            <img src={image} alt="Plant Disease" className="preview-image" />
          </div>
        )}
        <button type="submit" className="submit-button">
          Detect Disease
        </button>
      </form>
      {diseaseName && (
        <div className="result-card">
          <h3>Detection Result</h3>
          <p>{diseaseName}</p>
        </div>
      )}
    </div>
  );
};

export default Diseasedetect;
