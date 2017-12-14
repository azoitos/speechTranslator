import axios from 'axios'
import io from 'socket.io-client'
const { populateVoiceList, speak, SpeechRecognition, SpeechGrammarList, SpeechRecognitionEvent } = require('./speech.js');

export const socket = io(window.location.origin);

var checkboxPara = document.querySelector('.soundOn1');
var voiceSelect = document.querySelector('select');

populateVoiceList(voiceSelect, 'Daniel');
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

var diagnosticPara = document.querySelector('.outputJPN');
var translatePara = document.querySelector('.translatedENG');
var testBtn = document.querySelector('.jpnButton');

socket.on('connect', () => {
  console.log('I have made a persistant two-way connection to the server!');

  socket.on('onJapanese', function (data) {
    translatePara.textContent = 'Translated speech: ' + data;
    speak(data, checkboxPara, 'Daniel');
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
    diagnosticPara.textContent = '話した： ' + speechResult + '.';

    axios.post('/nihongo', { speechResult })
      .then(result => {
        socket.emit('onJapanese', result.data);
        return result.data;
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