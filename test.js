var client;
var audio;
var input;
var recorder;
var stream;

function init() {
  client = new Dropbox.Client(
    {
      key: 'rqw8kp4q6rqwq5g'
    }
  );
  navigator.webkitGetUserMedia(
    {
      audio: true
    },
    onUserMediaReady,
    onUserMediaError
  );
}

function recordAudio() {
  audio = new AudioContext();
  input = audio.createMediaStreamSource(stream);
  input.connect(audio.destination);
  recorder = new Recorder(input);
  recorder.record();
  // record two seconds and export to dropbox
  setTimeout(function() {
    recorder.stop();
    input.disconnect();
    recorder.exportWAV(onExportWavReady);
  }, 2000);
}

function onExportWavReady(blob) {
  console.info('onExportWavReady');
  client.writeFile('latest.wav', blob, onWriteFileReady);
}

function onUserMediaReady(aStream) {
  console.info('onUserMediaReady');
  stream = aStream;
  client.authenticate(function (error, client) {
    if (error) {
      console.log('Error: ' + error);
    } else {
      recordAudio();
    }
  });
}

function onWriteFileReady(error) {
  console.info('onWriteFileReady');
  if (error) {
    console.error('Error: ' + error);
  } else {
    console.log('File written successfully!');
  }
}

function onUserMediaError(error) {
  console.error('No live audio input: ' + error);
}

init();
