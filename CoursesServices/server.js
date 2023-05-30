const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    cors = require('cors'),
    routers = require('./ServerSide/routes.js');
let app = express();

let port = 3001;
app.listen(port,()=>{
    console.log(`Starting server on port ${port}`);
});

//load index page when opening port
app.use(express.static(__dirname));

// app.get('/courses', (req, res) => {
//     // Read the courses.json file and send the data as a response
//     res.sendFile(__dirname + '/courses.json');
// });

app.post('/courses',(res,req)=>{
    console.log(req.params);
});



