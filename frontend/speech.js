//Speech Recognition
const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//Speech Synthesis
var synth = window.speechSynthesis;
var voices = [];

function populateVoiceList(voiceSelect, voiceName) {
    voices = synth.getVoices();
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === voiceName) {
            var option = document.createElement('option');
            option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

            option.setAttribute('data-lang', voices[i].lang);
            option.setAttribute('data-name', voices[i].name);
            voiceSelect.appendChild(option);
        }
    }
}

//Speak Function
function speak(data, checkboxPara, voiceName) {
    if (checkboxPara.checked === true) {
        var utterThis = new SpeechSynthesisUtterance(data);
        for (let i = 0; i < voices.length; i++) {
            if (voices[i].name === voiceName) {
                utterThis.voice = voices[i];
            }
        }
        synth.speak(utterThis);
    }
}

module.exports = {
    SpeechRecognition,
    SpeechGrammarList,
    SpeechRecognitionEvent,
    populateVoiceList,
    speak
}
