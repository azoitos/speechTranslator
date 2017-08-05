import axios from 'axios'
import indexJPN, { socket } from './indexJPN'

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;


var diagnosticPara = document.querySelector('.outputENG');
var translatePara = document.querySelector('.translatedJPN');
var testBtn = document.querySelector('.engButton');
var testBtn1 = document.querySelector('.jpnButton');


socket.on('onEnglish', function (data) {
  translatePara.textContent = 'Translated speech: ' + data
})



function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = 'Test in progress';
  diagnosticPara.textContent = 'Speech rendering';

  //   var grammar = '#JSGF V1.0; grammar phrase; public <phrase> = ' + phrase +';';
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  //   speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = 'en-US';
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
    
    axios.post('/', { speechResult }).then(result => {
      socket.emit('onEnglish', result.data)
    })
  }

  recognition.onspeechend = function () {
    testBtn.disabled = false;
    testBtn.textContent = 'Click Here for English Speakers';
    recognition.stop();
  }

  recognition.onerror = function (event) {
    testBtn.disabled = false;
    testBtn.textContent = 'Click Here for English Speakers';
    diagnosticPara.textContent = 'Error occurred in recognition: ' + event.error;
  }

}


testBtn.addEventListener('click', testSpeech);

testBtn1.addEventListener('click', indexJPN);

