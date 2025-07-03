const axios = require('axios');
const { response } = require('express');
const formData = require('form-data');
const API_KEY = 'sk_1fc44c20f9374d14007c89912cf95af5b2e834889298884a';
const fs = require('fs');
const { json } = require('stream/consumers');
const { ElevenLabsClient } = require('@elevenlabs/elevenlabs-js');
require('dotenv').config;

async function transcribe(file) {
//const { Blob } = await import('fetch-blob');
const elevenlabs = new ElevenLabsClient({apiKey:API_KEY});
 // const audioBuffer = fs.readFileSync(file);
  const stream = fs.createReadStream(file);
 // console.log("length is" + audioBuffer.length)
  //const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' }); 
 // console.log("audioBlob is" + audioBlob);
 // console.log()
try {
  const transcription = await elevenlabs.speechToText.convert({
  file: stream,
  modelId: "scribe_v1", // Model to use, for now only "scribe_v1" is supported.
  tagAudioEvents: true, // Tag audio events like laughter, applause, etc.
  languageCode: "eng", // Language of the audio file. If set to null, the model will detect the language automatically.
  diarize: true, // Whether to annotate who is speaking
})
return transcription;
}
catch(err) {
  console.error(" Transcription failed:", err);
}
}
module.exports = transcribe;





/*output_file = file;
const fd = new formData();
fd.append('file',fs.createReadStream(output_file));
fd.append('model_id','scribe-v1');
fd.append('diarize',true);
//fd.append('timestamps',true);
fd.append('timestamps_granularity');
try {
    response = await axios.post('https://api.elevenlabs.io/v1/scribe', fd, {
        headers:{
            ...fd.getHeaders(),
            'xi-api-key':API_KEY

        },
        maxBodyLength:Infinity,
        maxContentLength: Infinity,
        timeout: 60000

    })
   return "Transcription Processed \n" + JSON.stringify(response.data,null,2);
}
catch(err) {
    console.log(err);
    console.error("Transcription Failed :<", err.message);

    }
    */