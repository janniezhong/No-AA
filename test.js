var http = require("http");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
 
var options = {
    host: 'lcmspubcontact.lc.ca.gov',
    path: '/PublicLCMS/ContactPopupSubmit.php',
    port: '1338',
    method: 'POST',
    headers: {'custom': 'Custom Header Demo works'}
};

callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });
  
    response.on('end', function () {
      console.log(str);
    });
}



var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at %s:%s Port", host, port);
});

app.get('/form', function (req, res) {
  var html='';
  html +="<body>";
  html += "<form action='/thank'  method='post' name='form1'>";
  html += "Name:<input type= 'text' name='name'></p>";
  html += "Email:<input type='text' name='email'></p>";
  html += "address:<input type='text' name='address'></p>";
  html += "Mobile number:<input type='text' name='mobilno'></p>";
  html += "<input type='submit' value='submit'>";
  html += "<INPUT type='reset'  value='reset'>";
  html += "</form>";
  html += "</body>";
  res.send(html);
});
 
app.post('/thank', urlencodedParser, function (req, res){
  var reply='';
  reply += "Your name is" + req.body.name;
  reply += "Your E-mail id is" + req.body.email; 
  reply += "Your address is" + req.body.address;
  reply += "Your mobile number is" + req.body.mobilno;
  res.send(reply);



  var req = http.request(options, callback);
  req.end();

 });



