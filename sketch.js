let singVoice = 'Google 日本語';
let myVoice = new p5.Speech(singVoice); // new P5.Speech object
let lyrics = 'baa baa black sheep have you any wool';
let song = makeSong(lyrics);
let speakButton, singButton, lyricsInput;
let currentUtterance = null;

function setup() {
  createCanvas(400, 400);

  lyricsInput = createInput(lyrics);
  lyricsInput.elt.style.width = `${width}px`;
  lyricsInput.elt.style.height = `${width/6}px`;
 
  speakButton = createButton('speak');
  speakButton.mousePressed(() => {
    lyrics = lyricsInput.value();
    song = makeSong(lyrics);
    let index = Math.floor(Math.random()*song.length);
    let utterance = song[index];
    myVoice.setRate(utterance.rate);
    myVoice.speak(utterance.word);
    currentUtterance = utterance;
  });

  singButton = createButton('sing');
  singButton.mousePressed(() => {
    lyrics = lyricsInput.value();
    song = makeSong(lyrics);
    singSong(song);
  });


  textSize(32);
}


function draw() {
  background(220);

  if(currentUtterance) {
    text(currentUtterance.word, 20, 100);
    text(currentUtterance.rate, 20, 200);
  }
}

function makeSong(lyrics) {
  let words = lyrics.split(' ');
  let rhythm = [];
  let song = [];
  words.forEach(word => {
    let rate = Math.random();
    rhythm.push(rate);
    song.push({word: word, rate: rate});
  })
  return song;
}

// using web speech api directly 
// p5 library probably has a bug with queuing speech utterance event objects
var synth = window.speechSynthesis;

function getVoice(voice) {
    return voice.name === singVoice;
}

function singSong(song) {
  // queuing song elements one after the other
  song.forEach(element => {
    let utterance = new SpeechSynthesisUtterance();
    utterance.voice = synth.getVoices().find(getVoice);
    utterance.rate = element.rate;
    utterance.text = element.word;
    synth.speak(utterance);
    utterance.onstart = utteranceOnStart;
  })
}

function utteranceOnStart(event) {
  console.log(event.utterance.text, event.utterance.rate);
  currentUtterance = {word: event.utterance.text, rate: event.utterance.rate.toFixed(2)};
}

