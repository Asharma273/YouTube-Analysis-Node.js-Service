const axios = require('axios');

async function predict(document) {

const options = {
  method: 'POST',
  url: 'https://chatgpt-detector.p.rapidapi.com/gpt/detect',
  headers: {
    'content-type': 'application/json',
		'x-rapidapi-key': 'fae2e3dbc2msh392ecfce8acc838p140e3ajsn8379a0f6ef64', // This is the chatGPT detector model...
		'x-rapidapi-host': 'chatgpt-detector.p.rapidapi.com',
  },
  data: {
    text: document
  }
};

try {
  const response = await axios.request(options);
  return response;
} catch (error) {
  console.error(error);
    }
}



module.exports = predict;