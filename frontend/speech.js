//Speech Recognition
export const SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
export const SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
export const SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//Speech Synthesis
var synth = window.speechSynthesis;
var voices = [];

export function populateVoiceList(voiceSelect, voiceName) {
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
export function speak(data, checkboxPara, voiceName) {
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
