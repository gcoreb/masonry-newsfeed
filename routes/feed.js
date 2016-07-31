/**
 * Created by bryanchen on 7/28/16.
 */
var request = require('request');
module.exports = function(req,res){
    console.log(req.url.slice(6));
    request("http://api.nytimes.com/svc/news/v3/content/all/"+req.query.category+"/.json?api-key=get-your-own"+req.url.slice(6), function(err,data){
        if(err){
            console.log(err);
        }
        console.log(JSON.parse(data.body).results);
        res.send(data.body);
    });

}
