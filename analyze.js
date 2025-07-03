const puppeteer = require('puppeteer')

async function analyzeYtVideo (youtubeURL) {
const browser = await puppeteer.launch({headless: true});
const page = await browser.newPage();

try {
await page.goto(youtubeURL,{waitUntil:'networkidle2',timeout:30000});
await page.waitForSelector('video',{timeout:20000});

const verifyPlay = await page.evaluate(() => {
  const video = document.querySelector('video');
  if (video) {
    video.muted = true;     
    video.play();          
  }

  return new Promise(resolve => {
    setTimeout(() => {
      resolve(video && !video.paused && !video.ended && video.readyState > 2);
    }, 1500); 
  });
});

const url = new URL(youtubeURL);
const vidId = url.searchParams.get('v') || url.pathname.split('/').pop(); // ["", vidId] -> extracts vid id if there is no v param
const thumbnailUrl = `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg`;
await browser.close();

if (verifyPlay) {
console.log("Playback Start Verified");
}
else {
    console.log("Unable to verify playback...");
}
return {
  "image_url":thumbnailUrl, 
  "video_id":vidId} // return thumbnail url and the video id
}
catch (err) {
    await browser.close()
    throw(err)
    }
}
module.exports = analyzeYtVideo;