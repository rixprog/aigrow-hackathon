// Weather Forecast JavaScript - Farmer's Assistant

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const weatherForm = document.querySelector('.weather-form');
  const cityInput = document.getElementById('city');
  const loadingIndicator = document.getElementById('loading-indicator');
  const errorMessage = document.getElementById('error-message');
  const weatherResult = document.getElementById('weather-result');
  const tipsContainer = document.getElementById('tips-container');
  const placeholderMessage = document.getElementById('placeholder-message');
  const weatherIconContainer = document.getElementById('weather-icon-container');
  
  // Check if we have weather data
  const hasWeatherData = weatherResult !== null;
  
  // Event Listeners
  if (weatherForm) {
      weatherForm.addEventListener('submit', function(e) {
          // Validate the form
          if (cityInput.value.trim() === '') {
              e.preventDefault();
              showError('Please enter a city name');
              return;
          }
          
          // Show loading indicator when form is submitted
          if (loadingIndicator) {
              loadingIndicator.classList.remove('hidden');
          }
          
          // Hide error message if visible
          if (errorMessage) {
              errorMessage.classList.add('hidden');
          }
      });
  }
  
  // If we have weather data, add the weather icon
  if (hasWeatherData) {
      addWeatherIcon();
      generateFarmingTips();
  }
  
  // Function to show error message
  function showError(message) {
      if (errorMessage) {
          errorMessage.textContent = message;
          errorMessage.classList.remove('hidden');
          
          // Hide error after 5 seconds
          setTimeout(() => {
              errorMessage.classList.add('hidden');
          }, 5000);
      }
  }
  
  // Function to add weather icon based on condition
  function addWeatherIcon() {
      if (weatherIconContainer) {
          // Find the condition text
          const conditionElements = document.querySelectorAll('.weather-info p');
          let condition = '';
          
          // Loop through elements to find the condition
          for (let i = 0; i < conditionElements.length; i++) {
              if (conditionElements[i].textContent.includes('Condition:')) {
                  condition = conditionElements[i].querySelector('span').textContent.toLowerCase();
                  break;
              }
          }
          
          // Determine the icon based on the condition
          let iconUrl = '';
          if (condition.includes('rain') || condition.includes('drizzle')) {
              iconUrl = 'https://cdn-icons-png.flaticon.com/512/3351/3351979.png';
          } else if (condition.includes('cloud')) {
              iconUrl = 'https://cdn-icons-png.flaticon.com/512/414/414927.png';
          } else if (condition.includes('clear') || condition.includes('sun')) {
              iconUrl = 'https://cdn-icons-png.flaticon.com/512/869/869869.png';
          } else if (condition.includes('snow')) {
              iconUrl = 'https://cdn-icons-png.flaticon.com/512/642/642102.png';
          } else if (condition.includes('storm') || condition.includes('thunder')) {
              iconUrl = 'https://cdn-icons-png.flaticon.com/512/1146/1146860.png';
          } else if (condition.includes('fog') || condition.includes('mist')) {
              iconUrl = 'https://cdn-icons-png.flaticon.com/512/4005/4005901.png';
          } else {
              iconUrl = 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png';
          }
          
          // Create and add the icon
          const iconImg = document.createElement('img');
          iconImg.src = iconUrl;
          iconImg.alt = condition;
          iconImg.className = 'weather-icon';
          weatherIconContainer.appendChild(iconImg);
      }
  }
  
  // Function to generate farming tips based on weather
  function generateFarmingTips() {
      if (tipsContainer) {
          // Get weather data from the page
          let temperature = null;
          let condition = '';
          let windSpeed = null;
          let humidity = null;
          
          // Get temperature
          const temperatureElements = document.querySelectorAll('.weather-info p');
          for (let i = 0; i < temperatureElements.length; i++) {
              if (temperatureElements[i].textContent.includes('Temperature:')) {
                  const tempText = temperatureElements[i].querySelector('span').textContent;
                  temperature = parseFloat(tempText);
                  break;
              }
          }
          
          // Get condition
          const conditionElements = document.querySelectorAll('.weather-info p');
          for (let i = 0; i < conditionElements.length; i++) {
              if (conditionElements[i].textContent.includes('Condition:')) {
                  condition = conditionElements[i].querySelector('span').textContent.toLowerCase();
                  break;
              }
          }
          
          // Get wind speed
          const windElements = document.querySelectorAll('.weather-info p');
          for (let i = 0; i < windElements.length; i++) {
              if (windElements[i].textContent.includes('Wind Speed:')) {
                  const windText = windElements[i].querySelector('span').textContent;
                  windSpeed = parseFloat(windText);
                  break;
              }
          }
          
          // Get humidity
          const humidityElements = document.querySelectorAll('.weather-info p');
          for (let i = 0; i < humidityElements.length; i++) {
              if (humidityElements[i].textContent.includes('Humidity:')) {
                  const humidityText = humidityElements[i].querySelector('span').textContent;
                  humidity = parseFloat(humidityText);
                  break;
              }
          }
          
          // Generate tips based on weather conditions
          const tips = [];
          
          // Temperature-based tips
          if (temperature !== null) {
              if (temperature > 30) {
                  tips.push('High temperature alert: Ensure crops have adequate water.');
                  tips.push('Consider providing shade for sensitive plants.');
                  tips.push('Avoid spraying chemicals during the hottest part of the day.');
              } else if (temperature > 25) {
                  tips.push('Maintain regular watering schedules for optimal growth.');
                  tips.push('Good conditions for most summer crops.');
              } else if (temperature < 10) {
                  tips.push('Low temperature alert: Protect frost-sensitive crops.');
                  tips.push('Delay seeding of warm-season crops.');
                  tips.push('Consider using row covers to protect plants.');
              } else if (temperature < 15) {
                  tips.push('Cool conditions: Good for cool-season crops like lettuce and spinach.');
                  tips.push('Water less frequently as evaporation rates are lower.');
              }
          }
          
          // Condition-based tips
          if (condition) {
              if (condition.includes('rain') || condition.includes('drizzle')) {
                  tips.push('Rainfall expected: Hold off on irrigation.');
                  tips.push('Check drainage systems to prevent waterlogging.');
                  tips.push('Delay fertilizer application to prevent runoff.');
              } else if (condition.includes('clear') || condition.includes('sun')) {
                  tips.push('Clear weather: Good time for field operations.');
                  tips.push('Monitor soil moisture levels as evaporation may increase.');
                  tips.push('Ideal conditions for harvesting and drying crops.');
              } else if (condition.includes('cloud')) {
                  tips.push('Cloudy conditions: Good time for transplanting seedlings.');
                  tips.push('Reduced water stress for plants due to lower evaporation.');
              } else if (condition.includes('snow')) {
                  tips.push('Snow provides insulation for winter crops and supplies moisture when it melts.');
                  tips.push('Check structures for snow load and damage.');
                  tips.push('Ensure livestock have adequate shelter and access to feed and water.');
              } else if (condition.includes('fog') || condition.includes('mist')) {
                  tips.push('Foggy conditions increase disease risk. Ensure good air circulation in greenhouses.');
                  tips.push('Delay spraying operations until visibility improves.');
              }
          }
          
          // Wind-based tips
          if (windSpeed !== null) {
              if (windSpeed > 8) {
                  tips.push('High winds: Avoid spraying operations to prevent drift.');
                  tips.push('Check and secure any structures, coverings, or young plants that could be damaged.');
              } else if (windSpeed < 3) {
                  tips.push('Low wind conditions are ideal for spraying operations.');
              }
          }
          
          // Humidity-based tips
          if (humidity !== null) {
              if (humidity > 80) {
                  tips.push('High humidity: Monitor for fungal diseases.');
                  tips.push('Ensure good ventilation in greenhouses and storage facilities.');
              } else if (humidity < 40) {
                  tips.push('Low humidity: Crops may need additional irrigation.');
                  tips.push('Watch for increased pest activity, such as spider mites.');
              }
          }
          
          // Create the tips list
          if (tips.length > 0) {
              const tipsList = document.createElement('ul');
              tipsList.className = 'tips-list';
              
              // Add up to 5 tips to avoid overwhelming the user
              const displayTips = tips.slice(0, 5);
              displayTips.forEach(tip => {
                  const listItem = document.createElement('li');
                  listItem.textContent = tip;
                  tipsList.appendChild(listItem);
              });
              
              tipsContainer.innerHTML = '';
              tipsContainer.appendChild(tipsList);
          } else {
              tipsContainer.innerHTML = '<p class="tip-placeholder">Enter a city to get weather-specific farming tips.</p>';
          }
      }
  }
  
  // Enhance UI for better user experience
  function enhanceUI() {
      // Add hover effects to buttons
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(button => {
          button.addEventListener('mouseenter', () => {
              if (!button.disabled) {
                  button.style.transform = 'translateY(-2px)';
                  button.style.boxShadow = 'var(--shadow-md)';
              }
          });
          
          button.addEventListener('mouseleave', () => {
              if (!button.disabled) {
                  button.style.transform = '';
                  button.style.boxShadow = '';
              }
          });
      });
      
      // Add animation to weather cards
      const weatherCards = document.querySelectorAll('.weather-container, .tips-container, .step');
      weatherCards.forEach(card => {
          card.addEventListener('mouseenter', () => {
              card.style.transform = 'translateY(-5px)';
              card.style.boxShadow = 'var(--shadow-lg)';
              card.style.transition = 'transform var(--transition-medium), box-shadow var(--transition-medium)';
          });
          
          card.addEventListener('mouseleave', () => {
              card.style.transform = '';
              card.style.boxShadow = '';
          });
      });
      
      // Improve focus styles for accessibility
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
          input.addEventListener('focus', () => {
              input.style.boxShadow = '0 0 0 3px rgba(76, 175, 80, 0.3)';
              input.style.borderColor = 'var(--primary-color)';
          });
          
          input.addEventListener('blur', () => {
              input.style.boxShadow = '';
              input.style.borderColor = '';
          });
      });
  }
  
  // Call enhanceUI to improve user experience
  enhanceUI();
  
  // Add responsiveness for the weather display
  function makeResponsive() {
      const handleResize = () => {
          const windowWidth = window.innerWidth;
          
          // Adjust layout based on screen size
          if (windowWidth < 768) {
              // Mobile layout adjustments
              if (weatherResult) {
                  weatherResult.style.flexDirection = 'column';
              }
          } else {
              // Desktop layout adjustments
              if (weatherResult) {
                  weatherResult.style.flexDirection = 'row';
              }
          }
      };
      
      // Initial call and resize event listener
      handleResize();
      window.addEventListener('resize', handleResize);
  }
  
  // Initialize responsive behavior
  makeResponsive();
  
  // Add seasonal crop recommendations based on weather and current month
  function addSeasonalRecommendations() {
      // If tips container exists and we have weather data
      if (tipsContainer && hasWeatherData) {
          const currentMonth = new Date().getMonth(); // 0-11 (Jan-Dec)
          const season = getSeason(currentMonth);
          
          // Get temperature from page if it exists
          let temperature = null;
          const temperatureElements = document.querySelectorAll('.weather-info p');
          for (let i = 0; i < temperatureElements.length; i++) {
              if (temperatureElements[i].textContent.includes('Temperature:')) {
                  const tempText = temperatureElements[i].querySelector('span').textContent;
                  temperature = parseFloat(tempText);
                  break;
              }
          }
          
          // Add a seasonal crop recommendation section
          const seasonalSection = document.createElement('div');
          seasonalSection.className = 'seasonal-recommendations';
          seasonalSection.innerHTML = `<h3>Seasonal Crop Recommendations</h3>`;
          
          // Get recommendations based on season and temperature
          const recommendations = getSeasonalRecommendations(season, temperature);
          
          if (recommendations.length > 0) {
              const recommendationsList = document.createElement('ul');
              recommendationsList.className = 'tips-list';
              
              recommendations.forEach(rec => {
                  const listItem = document.createElement('li');
                  listItem.textContent = rec;
                  recommendationsList.appendChild(listItem);
              });
              
              seasonalSection.appendChild(recommendationsList);
              
              // Add the seasonal section after the tips container
              tipsContainer.parentNode.insertBefore(seasonalSection, tipsContainer.nextSibling);
          }
      }
  }
  
  // Function to determine season based on month
  function getSeason(month) {
      // Northern Hemisphere seasons
      if (month >= 2 && month <= 4) return 'spring';
      if (month >= 5 && month <= 7) return 'summer';
      if (month >= 8 && month <= 10) return 'fall';
      return 'winter';
  }
  
  // Function to get seasonal crop recommendations
  function getSeasonalRecommendations(season, temperature) {
      const recommendations = [];
      
      switch(season) {
          case 'spring':
              recommendations.push('Consider planting leafy greens like spinach, lettuce, and kale.');
              recommendations.push('Good time to start peas, carrots, and radishes.');
              if (temperature > 15) {
                  recommendations.push('Begin preparing soil for summer crops like tomatoes and peppers.');
              }
              break;
              
          case 'summer':
              recommendations.push('Focus on heat-loving crops like tomatoes, peppers, and cucumbers.');
              recommendations.push('Regularly water summer crops, preferably in early morning.');
              if (temperature > 30) {
                  recommendations.push('Provide shade for lettuce and other cool-season crops to prevent bolting.');
              }
              break;
              
          case 'fall':
              recommendations.push('Plant cool-weather crops like broccoli, Brussels sprouts, and cauliflower.');
              recommendations.push('Consider cover crops to protect and enrich soil over winter.');
              if (temperature < 15) {
                  recommendations.push('Start thinking about frost protection for sensitive plants.');
              }
              break;
              
          case 'winter':
              recommendations.push('Focus on planning for the next growing season.');
              recommendations.push('Consider growing cold-hardy crops in greenhouses or under row covers.');
              if (temperature > 5) {
                  recommendations.push('Plant garlic and onions for harvest next year.');
              }
              break;
      }
      
      return recommendations;
  }
  
  // Add seasonal recommendations if weather data is available
  if (hasWeatherData) {
      addSeasonalRecommendations();
  }
  
  // Add forecast accuracy disclaimer
  function addDisclaimer() {
      if (weatherResult) {
          const disclaimer = document.createElement('div');
          disclaimer.className = 'weather-disclaimer';
          disclaimer.innerHTML = '<p><small>Note: Weather forecasts are provided for planning purposes. Always check local weather services for the most up-to-date information.</small></p>';
          
          // Add disclaimer to the end of weather result
          weatherResult.appendChild(disclaimer);
      }
  }
  
  // Add disclaimer if weather data is available
  if (hasWeatherData) {
      addDisclaimer();
  }
});