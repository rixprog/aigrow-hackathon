// Chatbot.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the chatbot UI
    initChatbot();
    
    // Add event listener for Enter key
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Show welcome message
    setTimeout(() => {
        addBotMessage("Hello! I'm your AIGrow farming assistant. Ask me any farming-related questions about crops, diseases, techniques, or equipment.");
    }, 500);
    
    // Mobile menu toggle functionality
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('show');
        });
    }
});

/**
 * Initialize the chatbot interface
 */
function initChatbot() {
    // Focus on the input
    const userInput = document.getElementById('user-input');
    userInput.focus();
    
    // Adjust height for smaller screens
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
}

function adjustHeight() {
    const header = document.querySelector('.header');
    const chatSection = document.querySelector('.chat-section');
    
    if (header && chatSection) {
        const headerHeight = header.offsetHeight;
        chatSection.style.height = `calc(100vh - ${headerHeight}px)`;
    }
}

function sendMessage() {
    const userInput = document.getElementById('user-input');
    const userMessage = userInput.value.trim();
    
    // Don't send empty messages
    if (userMessage === '') {
        return;
    }
    
    // Add user message to chat
    addUserMessage(userMessage);
    
    // Clear input
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Fetch response from Gemini
    fetchGeminiResponse(userMessage);
}

function addUserMessage(message) {
    const chatbox = document.getElementById('chatbox');
    
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';
    messageContainer.style.justifyContent = 'flex-end';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.textContent = message;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'timestamp';
    timestamp.textContent = getCurrentTime();
    messageDiv.appendChild(timestamp);
    
    messageContainer.appendChild(messageDiv);
    
    chatbox.appendChild(messageContainer);
    
    scrollToBottom();
}

function addBotMessage(message) {
    const chatbox = document.getElementById('chatbox');
    
    // Remove typing indicator if present
    const typingIndicator = document.querySelector('.typing-indicator-container');
    if (typingIndicator) {
        chatbox.removeChild(typingIndicator);
    }

    // Create a container for the bot message
    const messageContainer = document.createElement('div');
    messageContainer.className = 'message-container';

    // Add bot icon
    const botIcon = document.createElement('div');
    botIcon.className = 'bot-icon';
    botIcon.textContent = '👨‍🌾';
    messageContainer.appendChild(botIcon);

    // Add the bot message
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';

    // Split message into lines
    const lines = message.split('\n');

    // Type each line with a delay
    typeLineByLine(lines, messageDiv, () => {
        // Add timestamp after typing is complete
        const timestamp = document.createElement('div');
        timestamp.className = 'timestamp';
        timestamp.textContent = getCurrentTime();
        messageDiv.appendChild(timestamp);
    });

    messageContainer.appendChild(messageDiv);
    chatbox.appendChild(messageContainer);

    // Scroll to the bottom of the chatbox
    scrollToBottom();
}

function typeLineByLine(lines, element, onComplete) {
    if (lines.length === 0) {
        if (onComplete) onComplete();
        return;
    }

    const line = lines.shift();
    typeMessage(line, element, () => {
        // Add a new line after each line is typed
        if (lines.length > 0) {
            element.appendChild(document.createElement('br'));
        }
        
        // Continue with next line
        typeLineByLine(lines, element, onComplete);
    });
}

function typeMessage(message, element, onComplete) {
    let i = 0;
    const speed = 5; 
    
    function typeWriter() {
        if (i < message.length) {
            if (element.lastChild && element.lastChild.nodeType === Node.TEXT_NODE) {
                element.lastChild.nodeValue += message.charAt(i);
            } else {
                element.appendChild(document.createTextNode(message.charAt(i)));
            }
            i++;
            scrollToBottom();
            setTimeout(typeWriter, speed);
        } else {
            if (onComplete) onComplete();
        }
    }
    
    // Start typing
    typeWriter();
}

function showTypingIndicator() {
    const chatbox = document.getElementById('chatbox');
    
    // Create container for typing indicator
    const container = document.createElement('div');
    container.className = 'message-container typing-indicator-container';
    
    // Create bot icon
    const botIcon = document.createElement('div');
    botIcon.className = 'bot-icon';
    botIcon.textContent = '👨‍🌾';
    
    // Create typing indicator
    const indicator = document.createElement('div');
    indicator.className = 'message bot-message';
    indicator.style.padding = '10px';
    
    const typingDots = document.createElement('div');
    typingDots.className = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        typingDots.appendChild(dot);
    }
    
    indicator.appendChild(typingDots);

    container.appendChild(botIcon);
    container.appendChild(indicator);

    chatbox.appendChild(container);
    
    scrollToBottom();
}

function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    return hours + ':' + minutes + ' ' + ampm;
}

/**
 * Scroll the chatbox to the bottom with smooth animation
 */
function scrollToBottom() {
    const chatbox = document.getElementById('chatbox');
    chatbox.scrollTo({
        top: chatbox.scrollHeight,
        behavior: 'smooth'
    });
}

/**
 * Fetch a response from Gemini API
 */
function fetchGeminiResponse(userMessage) {
    // Regular API call for other messages
    const data = {
        message: userMessage,
        context: "farming"
    };
    
    fetch('/chatbot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.response) {
            addBotMessage(data.response);
        } else {
            addBotMessage("I'm sorry, I couldn't process your request. Please try again.");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        addBotMessage("I'm having trouble connecting right now. Please try again in a moment.");
    });
}