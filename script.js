const scenarioSelect = document.getElementById('scenario');
const customText = document.getElementById('customText');
const speakBtn = document.getElementById('speakBtn');
const conversationDiv = document.getElementById('conversation');

const scenarios = {
    greeting: "Hi! How are you today?",
    restaurant: "I'd like to order a cheeseburger, please.",
    shopping: "How much does this cost?"
};

scenarioSelect.addEventListener('change', () => {
    if (scenarioSelect.value === 'custom') {
        customText.style.display = 'block';
    } else {
        customText.style.display = 'none';
    }
});

speakBtn.addEventListener('click', () => {
    let text = '';
    if (scenarioSelect.value === 'custom') {
        text = customText.value.trim();
    } else {
        text = scenarios[scenarioSelect.value];
    }
    conversationDiv.textContent = text;
    speakText(text);
});

function speakText(text) {
    if (!('speechSynthesis' in window)) {
        alert('Speech synthesis not supported');
        return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utter);
}
