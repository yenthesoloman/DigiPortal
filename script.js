const scenarioSelect = document.getElementById('scenario');
const customText = document.getElementById('customText');
const speakBtn = document.getElementById('speakBtn');
const conversationDiv = document.getElementById('conversation');

const scenarioFlows = {
    greeting: [
        "Hi! How are you today?",
        "That's nice. What are your plans for today?",
        "Great! Let's practice again soon."
    ],
    restaurant: [
        "Welcome! What would you like to order?",
        "Would you like something to drink?",
        "Your order will be ready shortly."
    ],
    shopping: [
        "Hello! Are you looking for something specific?",
        "This item costs twenty dollars.",
        "You can pay at the register when you're ready."
    ]
};

let currentFlow = [];
let step = 0;
let recognition;

scenarioSelect.addEventListener('change', () => {
    if (scenarioSelect.value === 'custom') {
        customText.style.display = 'block';
    } else {
        customText.style.display = 'none';
    }
});

speakBtn.addEventListener('click', startConversation);

function startConversation() {
    if (scenarioSelect.value === 'custom') {
        const first = customText.value.trim();
        if (!first) return;
        currentFlow = [first, 'Thanks for sharing.'];
    } else {
        currentFlow = scenarioFlows[scenarioSelect.value];
    }
    step = 0;
    conversationDiv.innerHTML = '';
    continueConversation();
}

function continueConversation() {
    if (step >= currentFlow.length) {
        addMessage('bot', 'Conversation finished.');
        return;
    }
    const line = currentFlow[step];
    addMessage('bot', line);
    speakText(line, listenUser);
}

function addMessage(type, text) {
    const div = document.createElement('div');
    div.className = type;
    div.textContent = text;
    conversationDiv.appendChild(div);
    conversationDiv.scrollTop = conversationDiv.scrollHeight;
}

function speakText(text, onEnd) {
    if (!('speechSynthesis' in window)) {
        alert('Speech synthesis not supported');
        return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = onEnd;
    window.speechSynthesis.speak(utter);
}

function listenUser() {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        addMessage('bot', 'Speech recognition not supported');
        return;
    }
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        addMessage('user', transcript);
    };
    recognition.onend = () => {
        step++;
        continueConversation();
    };
    recognition.start();
}
