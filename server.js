var cluster = require("cluster");

if (cluster.isMaster){
    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    
    // Listen for dying workers
cluster.on('exit', function (worker) {

    // Replace the dead worker,
    // we're not sentimental
    console.log('Worker %d died :(', worker.id);
    cluster.fork();

});

// Code to run if we're in a worker process
}
else{
    var express = require("express");
    //var request = require("request");

    var app = express();

app.get("/", function(req, res){
    var q = req.query.q;
    var request = require("request");
    var queryData = require("./queryData");
    var MONGODB_URI=process.env.MONGODB_URI;
    var google_cx=process.env.google_cx;
    var google_key=process.env.google_key;
    
    if (q){
        var start = req.query.offset || 1;
    request.get("https://www.googleapis.com/customsearch/v1?key=" + google_key + "&cx=" + google_cx + "&searchType=image&q=" + q + "&start=" + start, 
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
            var arr2 = [{images: arr}];
            //res.send(queryData.find(arr));
            queryData.find(arr2, res);
            queryData.insert(q);
        }
        else{
            res.end(error);
        }
    });
    }
    else{
        app.set('views',  './views');
        app.set("view engine", "pug");
        //app.set('view options', { pretty: true });
        res.render("index");
    }
})
.listen(process.env.PORT, function(){
    console.log("Your Connection Listening at port: ", process.env.PORT);
});
}

