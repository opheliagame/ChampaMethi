let myVoice = new p5.Speech('Google 日本語'); // new P5.Speech object
let lyrics = 'baa baa black sheep have you any wool';
let words = lyrics.split(' ');
let rhythm = [];
let song = [];
words.forEach(word => {
  let rate = Math.random();
  rhythm.push(rate);
  song.push({word: word, rate: rate});
})
let speakButton, singButton;
let currentUtterance = null;

function setup()
{
  createCanvas(400, 400);
 
  speakButton = createButton('speak');
  speakButton.mousePressed(() => {
    // myVoice.listVoices();
    let index = Math.floor(Math.random()*song.length);
    let utterance = song[index];
    myVoice.setRate(utterance.rate);
    myVoice.speak(utterance.word);
    currentUtterance = utterance;
  });

  singButton = createButton('sing');
  singButton.mousePressed(() => {
     singSong(song)
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

// using web speech api directly 
// p5 library probably has a bug with queuing speech utterance event objects
var synth = window.speechSynthesis;

function singSong(song) {
  // queuing song elements one after the other
  song.forEach(element => {
    let utterance = new SpeechSynthesisUtterance();
    utterance.voice = synth.getVoices().filter(v => v.name === "Google 日本語")[0];
    utterance.rate = element.rate;
    utterance.text = element.word;
    synth.speak(utterance);
    utterance.onstart = utteranceOnStart;
  })
}

function utteranceOnStart(event) {
  console.log(event.utterance.text, event.utterance.rate);
  currentUtterance = {word: event.utterance.text, rate: event.utterance.rate};
}

