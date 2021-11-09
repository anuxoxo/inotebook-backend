const connectToMongo = require('./db');
connectToMongo();
const express = require('express')
const app = express()
const port = 3000

app.use(express.json());
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})