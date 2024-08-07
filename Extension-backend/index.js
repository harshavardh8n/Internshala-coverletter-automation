const express = require("express")
const app = express();
const cors = require('cors')
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// const { GoogleGenerativeAI } = require("@google/generative-ai");
// Access your API key as an environment variable
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const corsOptions = {
    // origin: '', // Replace with your frontend URL
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type'
};
app.use(cors(corsOptions));

// const arr = ["whonis ben 10","who is ninja hattori","who is akinator","who is chimpui","who is krish mehra"]
app.use(express.json())

// app.get('/',async(req,res)=>{
//     res.send("Hello");
//     const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            
//     // console.log(name, skills,education,exp,projects,email);
//     // const arr2 = []
//     for(let i=0;i<arr.length;i++){
//         const prompt = arr[i];
//         const result = await model1.generateContent(prompt);
//         const response = await result.response;
//         const text1 = await response.text();
//         console.log(text1);
//     }
//     res.end();

// })

app.post("/coverletter",async(req,res)=>{
    const prompt  = req.body.prompt;

    // console.log(prompt);
    console.log("------------------------------------------------------------------")
    const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const myprompt = `${prompt},these are the details of my and the internship i want to apply, then write a ready answer for 'Why should we hire you' i can directly copy and paste into the answer. assume that i already have the skills required forthe job/internship and experience in the field. Use normal writing format , dont use other symbols like '#'`;
    const result = await model1.generateContent(myprompt);
    const response = result.response;
    const text1 = response.text();
        console.log(text1);
        res.status(200).json({coverLetter:text1});
        res.end();

})

// app.post("/answer",async(req,res)=>{
//     try {
//         console.log("inside answer")
//         const question  = req.body.question;
//         // console.log(question);
        
//         // const model1 = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//         //  const myprompt = `${question}, answer this as if you are human, dont add any extra thing, dont explain anything !! i just want the answer thats it, it should look like it is written by a human. write it in a normal format, it shouldnt have any extra character or symbol`;
//         //  const result = await model1.generateContent(myprompt);
//         // const response = result.response;
//         // const text1 = response.text();

//         // res.status(200).json({answer:text1})
//         res.status(200).json({answer:"answer"})

//         // res.send()
//         res.end();
//     } catch (error) {
//         res.status(400).json({answer:error})
//     }
   
// })


app.post('/answer', (req, res) => {
    const { question } = req.body;
  
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
  
    console.log('Received question:', question);
  
    let answer = '';
  
    // Example logic to generate an answer. Replace with your own logic as needed.
    switch (question.toLowerCase()) {
      case 'q1. write an algorithm or code to count odd numbers in a given integer array\nif you want to share any documents or files, please upload it on google drive or dropbox and paste the public link in the answer.':
        answer = 'Here is a sample algorithm to count odd numbers in an integer array:\n```javascript\nfunction countOddNumbers(arr) {\n  let count = 0;\n  for (let num of arr) {\n    if (num % 2 !== 0) {\n      count++;\n    }\n  }\n  return count;\n}\n```';
        break;
      case 'q2. what does this function do? function whatdoido (matrix,m,n){ if(m==n && m%2!=0){ count = 0; t=(m-1)/2; for (i=0;i<m;i++) for(j=0;j<n;j++) if(matrix[i][j]==matrix[t][t]) count++; return count; } return 0; }\nif you want to share any documents or files, please upload it on google drive or dropbox and paste the public link in the answer.':
        answer = 'The function `whatDoIDo` checks if the matrix is square and has an odd dimension. If true, it counts how many times the middle element of the matrix appears in the matrix. If the conditions are not met, it returns 0.';
        break;
      default:
        answer = 'This is a sample answer for your question.';
    }
  
    res.json({ answer });
  });



app.listen(3002)