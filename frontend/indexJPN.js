import axios from 'axios'
import io from 'socket.io-client'

export const socket = io(window.location.origin);

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

//Speech Synthesis
var synth = window.speechSynthesis;
var voices = [];

var checkboxPara = document.querySelector('.soundOn');
var voiceSelect = document.querySelector('select');


function populateVoiceList() {
  voices = synth.getVoices();
  var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === "Daniel") {
      var option = document.createElement('option');
      option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

      option.setAttribute('data-lang', voices[i].lang);
      option.setAttribute('data-name', voices[i].name);
      checkboxPara.appendChild(option);
    }
  }
  voiceSelect.selectedIndex = selectedIndex;

}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}


//Speak Function
function speak(data) {
  if (checkboxPara.checked === true) {
    var utterThis = new SpeechSynthesisUtterance(data);
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === "Daniel" && voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }
    synth.speak(utterThis);
  }
}

var diagnosticPara = document.querySelector('.outputJPN');
var translatePara = document.querySelector('.translatedENG');
var testBtn = document.querySelector('.jpnButton');

socket.on('connect', () => {
  console.log('I have made a persistant two-way connection to the server!');

  socket.on('onJapanese', function (data) {
    translatePara.textContent = 'Translated speech: ' + data
  })
})


export default function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = '話している。。';
  diagnosticPara.textContent = '';

  //   var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  //   speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'ja';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function (event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object 
    var speechResult = event.results[0][0].transcript;
    diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';

    axios.post('/nihongo', { speechResult })
      .then(result => {
        socket.emit('onJapanese', result.data, speak(result.data));
      })
      .catch(e => console.error(e))

  }

  recognition.onspeechend = function () {
    testBtn.disabled = false;
    testBtn.textContent = '日本人のため';
    recognition.stop();
  }

  recognition.onerror = function (event) {
    testBtn.disabled = false;
    testBtn.textContent = '日本人のため';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

}