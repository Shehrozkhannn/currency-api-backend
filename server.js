const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const API_KEY = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2';
const BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';

let conversionHistory = [];

app.get('/api/convert',async (req,res)=> {
  try{
    const {from , to , amount} = req.query;
    const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&base_currency=${from}`);

    const rate = response.data.data[to];
    const convertedAmount = (rate * amount).toFixed(2);

    const record = {
      from,
      to,
      amount,
      convertedAmount,
      date: new Date()
    };
    conversionHistory.push(record);
    res.json({ convertedAmount, record });
  } catch(error){
    res.status(500).json({ message: 'Error fetching currency data', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
  console.log('Server is runnning');
})