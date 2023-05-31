const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const routers = require('./ServerSide/routes.js');

let app = express();
let port = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '/ClientSide')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/ClientSide/index.html'));
});

// Correctly send the Forum.html file
app.get('/addForum', (req, res) => {
    res.sendFile(path.join(__dirname, '/ClientSide/Forum/Forum.html'));
});

// Correctly send the Students.html file
app.get('/studentsList',(req,res)=>{
    res.sendFile(path.join(__dirname,'/ClientSide/StudentsPage/Students.html'));
});

app.use('/', routers);

app.listen(port, () => {
    console.log(`Starting server on port ${port}`);
});
