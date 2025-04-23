document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cropForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            predictCrop();
        });
    }
});

function predictCrop() {
    const inputs = [
        'nitrogen', 'phosphorus', 'potassium', 
        'temperature', 'humidity', 'ph', 'rainfall'
    ];
    
    let formIsValid = true;
    const formData = new FormData(document.getElementById('cropForm'));
    const resultContainer = document.getElementById('result');
    
    // Validate inputs
    inputs.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;
        
        // Remove any previous validation styles
        input.classList.remove('invalid');
        
        // Check if input is empty or invalid
        if (!input.value.trim() || !input.checkValidity()) {
            input.classList.add('invalid');
            formIsValid = false;
        }
    });
    
    if (!formIsValid) {
        resultContainer.innerHTML = `
            <div class="result-placeholder result-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-triangle">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <p>Please fill in all fields with valid values</p>
            </div>
        `;
        return;
    }
    
    // Reset result container
    resultContainer.innerHTML = `
        <div class="result-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            <p>Analyzing your agricultural conditions...</p>
        </div>
    `;
    
    fetch('/crop-recommendation', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(result => {
        if (result.error) {
            throw new Error(result.error);
        }
        
        // Create detailed result display
        const inputDetails = result.inputs;
        resultContainer.innerHTML = `
            <div class="result-content">
                <h2>Crop Recommendation</h2>
                <div class="recommended-crop">
                    <h3>Recommended Crop</h3>
                    <p class="crop-name">${result.recommended_crop}</p>
                </div>
                <h3>Input Conditions</h3>
                <div class="condition-grid">
                    <p><strong>Nitrogen:</strong> ${inputDetails.Nitrogen}</p>
                    <p><strong>Phosphorus:</strong> ${inputDetails.Phosphorus}</p>
                    <p><strong>Potassium:</strong> ${inputDetails.Potassium}</p>
                    <p><strong>Temperature:</strong> ${inputDetails.Temperature}°C</p>
                    <p><strong>Humidity:</strong> ${inputDetails.Humidity}%</p>
                    <p><strong>pH Level:</strong> ${inputDetails.pH}</p>
                    <p><strong>Rainfall:</strong> ${inputDetails.Rainfall} mm</p>
                </div>
            </div>
        `;
        resultContainer.classList.add('result-success');
    })
    .catch(error => {
        console.error('Error:', error);
        resultContainer.innerHTML = `
            <div class="result-placeholder result-error">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p>${error.message || 'Failed to get prediction. Please try again.'}</p>
            </div>
        `;
        resultContainer.classList.add('result-error');
    });
}