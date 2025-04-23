// Plant Disease Detection JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const fileInput = document.getElementById('file-input');
    const uploadArea = document.getElementById('upload-area');
    const uploadInstructions = document.getElementById('upload-instructions');
    const previewImage = document.getElementById('preview-image');
    const selectImageBtn = document.getElementById('select-image-btn');
    const detectBtn = document.getElementById('detect-btn');
    const loadingIndicator = document.getElementById('loading-indicator');
    const resultImage = document.getElementById('result-image');
    const detectedDiseases = document.getElementById('detected-diseases');
    const resultsPlaceholder = document.getElementById('results-placeholder');
    const resultsContent = document.getElementById('results-content');
    
    // File upload handling
    selectImageBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function(e) {
        handleFileSelect(e.target.files[0]);
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('dragover');
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    });
    
    // Click on upload area to select file
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Detect disease button
    detectBtn.addEventListener('click', function() {
        detectDisease();
    });
    
    // Handle file selection
    function handleFileSelect(file) {
        if (!file) return;
        
        // Check if file is an image
        if (!file.type.match('image.*')) {
            showError('Please select an image file (JPEG, PNG, etc.)');
            return;
        }
        
        // Display preview
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            uploadInstructions.classList.add('hidden');
            detectBtn.disabled = false;
        };
        reader.readAsDataURL(file);
    }
    
    // Detect disease function
    function detectDisease() {
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        detectBtn.disabled = true;
        
        // Clear previous results
        detectedDiseases.innerHTML = '';
        resultsContent.classList.add('hidden');
        resultsPlaceholder.classList.remove('hidden');
        
        // Create form data
        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        
       
        fetch('/api/detect', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            
            loadingIndicator.classList.add('hidden');
            detectBtn.disabled = false;
            
            if (data.success) {
                displayResults(data);
            } else {
                showError(data.error || 'Failed to detect diseases');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            loadingIndicator.classList.add('hidden');
            detectBtn.disabled = false;
            showError('An error occurred. Please try again.');
        });
    }
    
    
    function displayResults(data) {
        
        resultImage.src = data.image;
        
        
        resultsPlaceholder.classList.add('hidden');
        resultsContent.classList.remove('hidden');
        
        
        if (data.detections && data.detections.length > 0) {
            data.detections.forEach(disease => {
                const diseaseEl = document.createElement('div');
                diseaseEl.className = 'disease-item';
                
                const confidenceClass = disease.confidence > 80 ? 'high' : 
                                      disease.confidence > 50 ? 'medium' : 'low';
                
                diseaseEl.innerHTML = `
                    <div class="disease-name">
                        <h4>${disease.name}</h4>
                        <span class="confidence ${confidenceClass}">${disease.confidence}% Confidence</span>
                    </div>
                    <div class="treatment">
                        <h5>Recommended Treatment:</h5>
                        <p>${disease.treatment}</p>
                    </div>
                `;
                
                detectedDiseases.appendChild(diseaseEl);
            });
        } else {
            
            detectedDiseases.innerHTML = '<div class="disease-item"><h4>No diseases detected</h4><p>The plant appears to be healthy.</p></div>';
        }
        
        
        resultsContent.scrollIntoView({ behavior: 'smooth' });
    }
    
    
    function showError(message) {
        
        alert(message);
        
       
        detectBtn.disabled = false;
        loadingIndicator.classList.add('hidden');
    }
    
   
    function init() {
        
        if (!window.File || !window.FileReader || !window.FormData) {
            document.querySelector('.disease-detection').innerHTML = '<div class="error-message">Your browser does not support the File API. Please update your browser.</div>';
            return;
        }
        
        
        if (/Edge\/|Trident\/|MSIE/.test(navigator.userAgent)) {
            document.body.classList.add('ms-browser');
        }
    }
    
    // Initialize the app
    init();
});