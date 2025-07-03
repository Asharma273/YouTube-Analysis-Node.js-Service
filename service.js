const express = require('express');
const analyzeYtVideo = require('./analyze.js');
const app = express();
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const transcribe = require('./transcription.js');
const predict = require('./prediction.js');
const results = {}

const port = 8080; // We will listen on port 8080
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function convertToWav(inputStream, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputStream)
      .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(16000)
      .format('wav')
      .on('end', () => {
        console.log(' FFmpeg conversion complete');
        resolve(); // FFmpeg finished and resolved
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err.message);
        reject(err); // FFmpeg failed and rejected
      })
      .save(outputPath);
  });
}


app.use(express.urlencoded({ extended: true }));

app.get("/", (req,res) => {
   res.send( ` 
    <h2> Please Paste a Youtube Link :) </h2>
    <form action="/analyze_vid" method="POST">
    <input type="text" name="yt_url" placeholder="Paste YT URL required"/>
    <button type="submit"> Submit </button>
    </form> 
    `)
})

app.post("/analyze_vid", async (req,res) => {
console.log(req);
const yt_URL = req.body.yt_url;
console.log(yt_URL);
if (!yt_URL) {
    res.status(400).json({error:"Please add a youtube link"});
}
console.log(yt_URL + " has been recieved...");

try {
const analysis = await analyzeYtVideo(yt_URL);
const vidId = analysis.video_id;
const imageUrl = analysis.image_url;
output_path = `./yt_vid${vidId}.wav`;
console.log(  "Playback Start Verified And Screen Shot Taken");
const youtube_stream = ytdl(yt_URL, {
    quality:'highestaudio',
    filter: 'audioonly',
    highWaterMark: 1 << 25 // Buffer added
})

await convertToWav(youtube_stream, output_path);
trans_res = await transcribe(output_path);
const document = trans_res.text;
const sentences = document.split(/(?<=[.?!])\s+/);
const prob_list = []
for (let i =0; i < sentences.length; i++) { // applies buffer for sentences less than 10 words since this is not supported in GPT_detector
while (sentences[i].length < 10) {
    sentences[i]+='.'
}
}
for (let i = 0; i < sentences.length; i++) {
  try {
    const response = await predict(sentences[i]);
    const output = response.data.data?.output;

    if (output) {
      prob_list.push({
        sentence: sentences[i],
        probability_real: output.probability_real,
        probability_fake: output.probability_fake
      });
    }
  } 
  catch (error) {
    if (error.response?.status === 429) {
      console.warn('Rate limit hit');
      await delay(5000);
      i--; // retry this sentence... too many attempts too fast a rate limit for this subscription level of GPT_detector
    } else {
      console.error(`Error on sentence ${i}:`, error.message);
    }
    } 
delay(500);
}
results[vidId] = {
    "transcript":trans_res,
    "sentence_probabilities":prob_list,
    "imageUrl":imageUrl
}
    res.redirect(`/result/${vidId}`)
}
catch(err){
    console.error(err)
    res.status(500).send("Error loading and retrieving infromation from the youtube video")
}


});

app.get('/result/:id',(req,res) => {
    const result = results[req.params.id] // Grab the result that was cached in results
    if (!result){
            return res.status(404).json({ error: 'Result not found' });
    }
    else{
        const html = `<h2> Transcript Stamps and Probabilites </h2> \ 
        <pre> ${JSON.stringify(result,null,2)}</pre>
        <img src=${result.imageUrl} height=500px width=700px>` // The result is printed in a readable format

        return res.send(html)  
    }
})

app.listen(port,'0.0.0.0',() => {
    console.log(`Listening at port ${port}`);
})