# YouTube-Analysis-Node.js-Service
Checks to see the validity of every sentence of a Youtube video verifying whether it is AI generated or not
The port which this application runs on is 8080.
The following Application was built using the following dependencies
elevenlabs-js,
axios,
express,
fluent-ffmpeg,
ytdl-core,
puppeteer, (The following are dependencies that allow puppeteer to run on the GCE VM)...
ca-certificates,
fonts-liberation,
libappindicator3-1,
libasound2,
libatk-bridge2.0-0,
libatk1.0-0,
libcups2,
libdbus-1-3,
libgdk-pixbuf2.0-0,
libnspr4,
libnss3,
libx11-xcb1,
libxcomposite1,
libxdamage1,
libxrandr2,
xdg-utils. For environment variables, we makes sure that puppeteer_skip_download is set to false, but it was my preference to not use them this way. The design of the application had to be easy to use and very digestible to work with. The process of the application runs very systematically with one process happening after the other (verify playback, get image-url,get the transcript, etc.) However, one important and apparent design choice was the change from ChatGPT_Zero to GPT_Detector. This was due primarily because there was no free API access key, so I decided to use zeroGPT, but I also used my full free subscription for that service as well, so my final work around was this GPT_Detector model. This program makes sure to carefully and methodically go through every function end to end in an easy to use way! Also note that if the external IP is not accessible we can use port-forward fallback --> gcloud compute ssh instance-20250702-174056 -- -L 8080:localhost:8080. A firewall rule has been set on the GCE VM such that traffic will be listened to at port 8080.
*Sample Output is in the repo*

THIS HAS BEEN SUPER FUN XD

