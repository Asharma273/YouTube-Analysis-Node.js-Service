# YouTube-Analysis-Node.js-Service
Checks to see the validity of every sentence of a Youtube video verifying whether it is AI generated or not
The following Application was built using the following dependencies
elevenlabs-js,
axios,
express,
fluent-ffmpeg,
puppeteer,
ytdl-core
There were no environment variables (although the api keys could be set as an env var), but it was my preference to not use them this way...
Design Choices:
The design of the application had to be easy to use and very digestible to work with. The process of the application runs very systematically with one process happening after the other (verify playback, get image-url,get the transcript, etc.) However, one important and apparent design choice was the change from ChatGPT_Zero to GPT_Detector. This was due primarily because there was no free API access key, so I decided to use zeroGPT, but I also used my full free subscription for that service as well, so my final work around was this GPT_Detector model. This program makes sure to carefully and methodically go through every function end to end in an easy to use way! 

