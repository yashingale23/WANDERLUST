const chatbotContainer = document.getElementById('chatbot-container');
const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
const closeChatbotBtn = document.getElementById('close-chatbot');
const chatbotInput = document.getElementById('chatbot-input');
const sendBtn = document.getElementById('send-btn');
const messagesContainer = document.getElementById('chatbot-messages');

chatbotToggleBtn.addEventListener('click', () => {
    chatbotContainer.style.display = 'flex';
    chatbotToggleBtn.style.display = 'none';
});

closeChatbotBtn.addEventListener('click', () => {
    chatbotContainer.style.display = 'none';
    chatbotToggleBtn.style.display = 'flex';
});

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerText = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(input) {
    input = input.toLowerCase();

    if (input.includes('budget') || input.includes('cheap') || input.includes('low cost')) {
        const destinations = [
            "Vietnam: Amazing street food and stunning landscapes at very low prices.",
            "Bali, Indonesia: Beautiful beaches, culture, and affordable luxury.",
            "Portugal: One of Western Europe's most affordable countries with great food and wine.",
            "Mexico: Rich culture, delicious food, and very budget-friendly.",
            "India: Incredible diversity and extremely low cost of living for travelers.",
            "Thailand: A classic budget destination with great beaches and food.",
            "Turkey: A bridge between East and West with great history and value."
        ];
        const randomDestination = destinations[Math.floor(Math.random() * destinations.length)];
        return `For a budget-friendly trip, I recommend ${randomDestination}`;
    } else if (input.includes('hello') || input.includes('hi')) {
        return "Hello! Ready to plan your next adventure?";
    } else if (input.includes('thank')) {
        return "You're welcome! Happy travels!";
    } else {
        return "I'm best at finding budget travel spots. Try asking about 'budget' or 'cheap' places!";
    }
}

function handleSendMessage() {
    const text = chatbotInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        chatbotInput.value = '';

        setTimeout(() => {
            const response = getBotResponse(text);
            addMessage(response, 'bot');
        }, 500);
    }
}

sendBtn.addEventListener('click', handleSendMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
});
