const axios = require('axios');
async function geminiResponse(prompt) {
    try {
        const apiUrl = process.env.GEMINI
        const result = await axios.post(apiUrl,{
        "contents": [{
        "parts": [{"text": prompt}]
      }]
      })
      return result.data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.log(error)
    }

}

module.exports = {geminiResponse};




// const axios = require('axios');
// async function geminiResponse(prompt) {
//   try {
//     const apiUrl = process.env.GEMINI_API_URL;
//     const apiKey = process.env.GEMINI_API_KEY;

//     const response = await axios.post(
//       apiUrl,
//       {
//         contents: [
//           { parts: [{ text: prompt }] }
//         ]
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'x-goog-api-key': apiKey
//         }
//       }
//     );

    
    
//     console.log(response.data.candidates[0]?.content?.parts)
//     const text = response.data.candidates[0]?.content?.parts;
//     return text;

//   } catch (error) {
//     console.error("Gemini API error:", error.response?.data || error.message);
//     return { text: "Error from Gemini API" };
//   }
// }

// module.exports = { geminiResponse };