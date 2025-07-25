const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000'  // frontend URL
}));

app.post('/predict', (req, res) => {
  const python = spawn('python', ['predict.py', JSON.stringify(req.body)]);

  python.stdout.on('data', (data) => {
    res.send({ prediction: data.toString() });
  });

  python.stderr.on('data', (data) => console.error(data.toString()));
});

app.listen(8000, () => console.log('Server running on http://localhost:8000'));
