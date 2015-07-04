var alexa = require('alexarank');
var express = require('express');
var app = express();
var fs = require("fs");
var csv = require('ya-csv');
var bodyParser = require('body-parser');
var multer  = require('multer');
var results;
var next=-1;
var previous;
var csv_data=[];
//var file;
require('events').EventEmitter.prototype._maxListeners = 100000;
//require('http').globalAgent.maxSockets = 100000;
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: '/tmp/'}));
app.get('/', function (req, res) {
   res.sendFile( __dirname + "/" + "dashboard.html" );
})
app.post('/file_upload', function (req, res) {
   console.log(req.files.file);
   var file = __dirname + "/" + req.files.file.name;
   console.log(file);
   fs.readFile( req.files.file.path, function (err, data) {
        /*
        fs.writeFile(file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully',
                   filename:req.files.file.name
              };
          }
        });*/
          response = {
                   message:'File uploaded successfully',
                   filename:req.files.file.name
                 };
          //console.log( response );
    });
    var reader = csv.createCsvFileReader(req.files.file.path, {
                                                'separator': ',',
                                                'quote': '"',
                                                'escape': '"',   
                                                'comment': ''
                                             });
   reader.addListener('data', function(data) {
                csv_data.push(data);
        });
    res.sendFile( __dirname + "/" + "dashboard1.html" );
})
app.get('/alexarank', function (req, res) {
  //console.log(req);
  url_value=req._parsedOriginalUrl.query
  //console.log(url_value);
  alexa(url_value, function(error, result) {
          if (!error) {
            results=result['rank'];
            console.log(JSON.stringify(result));
          } else {
            console.log(error);
          }
            res.send(results);
        });
})
app.get('/next', function (req, res) {
        chk_prev1=csv_data.length-1;
        chk_prev=next;
        if(chk_prev==chk_prev1){
          //next=(csv_data.length);
          next=0;  
          //console.log(next);
          //console.log(csv_data[next][1]);
        }
        next=next+1;
        console.log(next);
        console.log(csv_data[next][1]);
        //console.log(csv_data[next][1]);
        var udata="http://"+String(csv_data[next][1])
          //next=next+1;
          var test="www.yahoo.com";
          var request = require('request');
          request(udata, function (error, response, body) {
             //console.log(response.statusCode);
          if (!error && response.statusCode == 200) {
            //console.log(body);
            // response.send(body);
            body=udata+"<-->"+body
            res.send(body);
          }
          else{ res.send("problem");} 
      })
  })
app.get('/prev', function (req, res) {
//console.log(csv_data);
//console.log(next);
check_next=next-1;
if(check_next<0){
next=(csv_data.length);
next=next-1;
//console.log(next);
//console.log(csv_data[next][1]);
}
else{
  next=next-1;
}
console.log(next);
console.log(csv_data[next][1]);
var udata="http://"+String(csv_data[next][1])
//console.log(udata);
var request = require('request');
          request(udata, function (error, response, body) {
             //console.log(response.statusCode);
          if (!error && response.statusCode == 200) {
            //console.log(body);
            // response.send(body);
            body=udata+"<-->"+body
            res.send(body);
          }
          else{ res.send("problem");} 
      })
})
app.get('/switchposition', function (req, res) {
  console.log(req._parsedOriginalUrl.query);
  switch_next=req._parsedOriginalUrl.query
  if(switch_next < -1 && switch_next > (csv_data.length-1) )
  {
    res.end("ERROR:GIVEN DATA NOT IN RANGE");
  }
  else{
    next=parseInt(switch_next);
  var udata="http://"+String(csv_data[switch_next][1])
//console.log(udata);
var request = require('request');
          request(udata, function (error, response, body) {
             //console.log(response.statusCode);
          if (!error && response.statusCode == 200) {
            //console.log(body);
            // response.send(body);
            body=udata+"<-->"+body
            res.send(body);
          }
          else{ res.send("problem");} 
      })
        }

})
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})