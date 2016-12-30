var express = require("express");
var request = require("request");

var app = express();

app.get("/", function(req, res){
    var q = req.query.q;
    var start = req.query.start || 0;
    request.get("https://www.googleapis.com/customsearch/v1?key=" +
    process.env.google_key + "&cx=" + process.env.google_cx + "&searchType=image&q=" + q + "&start=" + start, 
    function(error, response, body){
        if (!error && response.statusCode == 200){ 
            var items = JSON.parse(body).items;
            res.send(items); 
        } 
    });
});

app.listen(process.env.PORT, function(){
    console.log("Your Connection Listening at port: ", process.env.PORT);
});