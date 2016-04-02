(function () {

  'use strict';

  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition,
      recognition = new SpeechRecognition(),
      synth = window.speechSynthesis;

  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  var diagnostic = document.querySelector('.output');

  var say = function (sentence) {
    var utterThis = new SpeechSynthesisUtterance(sentence);

    synth.getVoices().forEach(function (voice) {
      if (voice.name === 'Kathy') {
        utterThis.voice = voice;
      }
    });

    utterThis.pitch = 1;
    utterThis.rate = 0.75;
    synth.speak(utterThis);
  };

  recognition.onresult = function (event) {
    var result = event.results[0][0].transcript,
        req = new XMLHttpRequest();

    diagnostic.textContent = result;

    if (result === 'Mozilla give me the temperature') {
      diagnostic.textContent = result;

      req.open('GET', 'http://10.0.1.104:3000/28-000007843e93', true);
      req.onreadystatechange = function () {
        if (req.readyState == 4) {
          if (req.status == 200) {
            say('It is 29 degree.');
          } else {
            say('There is a connectivity issue with the sensor service.');
          }
        }
      };
      req.send(null);
    }

    console.log('Confidence: ' + event.results[0][0].confidence);
  };

  recognition.onspeechend = function () {
    recognition.stop();
  };

  recognition.onnomatch = function (event) {
    diagnostic.textContent = 'I didnt recognise that color.';
  };

  recognition.onerror = function (event) {
    diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
  };

  window.onload = function() {
    recognition.start();
    console.log('Ready to receive a color command.');
  };
})();