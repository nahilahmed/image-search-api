var express = require("express");
var request = require("request");
var queryData = require("./queryData");
//var stylus = require("stylus");


//ensure the html and style files are in the same folder

//app.use(stylus.middleware(__dirname + '/views'));

var app = express();

app.get("/", function(req, res){
    
    var q = req.query.q;
    if (q){
        var start = req.query.offset || 0;
    request.get("https://www.googleapis.com/customsearch/v1?key=" +
    process.env.google_key + "&cx=" + process.env.google_cx + "&searchType=image&q=" + q + "&start=" + start, 
    function(error, response, body){
        if (!error && response.statusCode == 200){ 
            var arr = [];
            var items = JSON.parse(body).items;
            
            items.forEach(function(item, ind){
                var myjson = {
                    imgURL : item.link,
                    alt: item.snippet,
                    thumbnail: item.image.thumbnailLink,
                    contextLink: item.image.contextLink
                };
                arr.push(myjson);
            })
            //var arr2 = [{images: arr}];
            res.send(arr);
            //queryData.find(arr2, res);
            queryData.insert(q);
        } 
    });
    }
    else{
        app.set('views',  './views');
        app.set("view engine", "pug");
        //app.set('view options', { pretty: true });
        res.render("index");
    }
    
});

app.listen(process.env.PORT, function(){
    console.log("Your Connection Listening at port: ", process.env.PORT);
});