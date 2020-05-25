var http = require("http");
var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
//var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/


var postData = {
  district : 'AD',
  inframe: 'N',
  headerimg: 'Y',
  txtFirstName : '',
  txtLastName : '',
  txtAddress: '',
  txtCity: '',
  txtZip: '',
  txtAreaCode: '',
  txtPhone1: '',
  txtPhone2: '',
  txtExt: '',
  phoneTypeListbox: 'home',
  txtEmail: '',
  IssueListBox: '',
  text_num:'',
  jv_text:'',
  submitButton: '',

};

var url = 'https://lcmspubcontact.lc.ca.gov/PublicLCMS/ContactPopupSubmit.php'

var options = {
    /*host: 'lcmspubcontact.lc.ca.gov',
    connection: 'keep-alive',
    origin: 'https://lcmspubcontact.lc.ca.gov',
    path: '/PublicLCMS/ContactPopupSubmit.php', */
    method: 'post',
    body: postData,
    json: true,
    url: url,

};



var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at %s:%s Port", host, port);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/index.html'));
});
 
app.post('/thank', function (req, res){
  res.sendFile(path.join(__dirname+'/public/thank.html'));

  postData.txtFirstName = req.body.txtFirstName;
  postData.txtLastName = req.body.txtLastName;
  postData.txtAddress = req.body.txtAddress;
  postData.txtCity = req.body.txtCity;
  postData.txtZip = req.body.txtZip;
  postData.txtAreaCode = req.body.txtAreaCode;
  postData.txtPhone1 = req.body.txtPhone1;
  postData.txtPhone2 = req.body.txtPhone2;
  postData.txtExt = req.body.txtExt;
  postData.txtEmail = req.body.txtEmail;
  postData.jv_txt = req.body.jv_text;
  postData.txtNum = 2000 - postData.jv_txt.length;

  for (let i = 1; i < 31; i++){
  postData.district += i;

  request(options, 
  function (err, httpResponse, body) {
    if (err) {
      console.error('error posting json: ', err)
      throw err
    }
    var headers = httpResponse.headers
    var statusCode = httpResponse.statusCode
    console.log('headers: ', headers)
    console.log('statusCode: ', statusCode)
    console.log('body: ', body)

  })
  
  postData.district = "AD";

  }


  /*
  var req = http.request(options, callback);
  req.end();
  */
 });



