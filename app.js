const express = require('express');
const app = express();
const path = require('path');

const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hell, world!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
