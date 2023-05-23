let express = require('express');
let app = express();

let port = 3001;
app.listen(port,()=>{
    console.log(`Starting server on port ${port}`);
});

app.use(express.static(__dirname));

app.get('/courses', (req, res) => {
    // Read the courses.json file and send the data as a response
    res.sendFile(__dirname + '/courses.json');
});


