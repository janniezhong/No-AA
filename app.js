//const serverless = require('serverless-http');
//const StaticFileHandler = require('serverless-aws-static-file-handler');
var http = require("http");
var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
const storage = require('node-persist');
const csv = require('csv-parser');
const fs = require('fs');
var HashMap = require('hashmap');



app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('views')); /* this line tells Express to use the public folder as our static folder from which we can serve static files*/
//const clientFilesPath = path.join(__dirname, "./data-files/")
//const fileHandler = new StaticFileHandler(clientFilesPath);

var zipmap = new HashMap();


fs.createReadStream('views/data.csv')
  .pipe(csv())
  .on('data', function (row) {

    //console.log(row.ZipCodes);
    var zipString = row.ZipCodes.toString();
    var zipArray = zipString.split(",");
    var dist = row.AD.toString();

    for (var j = 0; j<zipArray.length; j++){
      if (zipmap.has(zipArray[j])){
        var curr = zipmap.get(zipArray[j]).push(dist);
      } else {
        zipmap.set(zipArray[j],[dist]);
      }
    }

    //console.log(zipmap.size);


  })
  .on('end', () => {
    //console.log(zipmap.get("94087"));

  });


var counter = 0;
var districts = ["AD17", "AD77", "AD66", "AD63", "AD27", "AD49", "AD25", "AD19", "AD02", "AD08", "AD38", "AD28", "AD76", "AD74", "AD20", "AD18", "AD65", "AD16", "SD34", "SD05", "SD10", "SD06", "SD31", "SD22", "SD09", "SD11", "SD15", "SD18", "SD40", "SD32", "SD03"];

var districts = ["AD01","AD05","AD13","AD16","AD18","AD20","AD30","AD34","AD45","AD49","AD50","AD51","AD56","AD57","AD72","AD73","AD74","AD80","SD01","SD02","SD03","SD04","SD05","SD06","SD07","SD08","SD09","SD10","SD11","SD12","SD13","SD14","SD15","SD16","SD17","SD18","SD19","SD20","SD21","SD22","SD23","SD24","SD25","SD26","SD27","SD28","SD29","SD30","SD31","SD32","SD33","SD34","SD35","SD36","SD37","SD38","SD39","SD40"];
//, "SD34", "SD05", "SD10", "SD06", "SD31", "SD22", "SD09", "SD11", "SD15", "SD18", "SD40", "SD32", "SD03"

var postData = {
  district: 'AD',
  inframe: 'N',
  headerimg: 'Y',
  txtFirstName: '',
  txtLastName: '',
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
  text_num: '',
  jv_text: '',
  submitButton: 'Submit',

};

var url = 'https://lcmspubcontact.lc.ca.gov/PublicLCMS/ContactPopupSubmit.php'

var options = {
  /*host: 'lcmspubcontact.lc.ca.gov',
  connection: 'keep-alive',
  origin: 'https://lcmspubcontact.lc.ca.gov',
  path: '/PublicLCMS/ContactPopupSubmit.php', */
  headers: {
    //'Content-Type': 'application/x-www-form-urlencoded',
    'Host': 'lcmspubcontact.lc.ca.gov',
    'Connection': 'keep-alive',
    'Origin': 'https://lcmspubcontact.lc.ca.gov',
    'Referer': 'https://lcmspubcontact.lc.ca.gov/PublicLCMS/ContactPopup.php?district=',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
  },
  method: 'post',
  body: postData,
  json: true,
  url: url,
  'Path': '/PublicLCMS/ContactPopupSubmit.php',

};


storage.init().then(() => storage.getItem("counter")).then((value) => {
  // Checks if value read is valid, otherwise set it to 0
  if (value > 35000) {
      counter = value;
  } else {
      counter = 34897;
  }
  console.log(counter);
  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

});

// [END gae_flex_node_static_files]
module.exports = app;




app.get('/', function (req, res) {
  
  res.json(counter);
  console.log("Counter is currently "+ counter+".");
  //res.render('index.html');

  res.render("index.html", {counter:counter});
  
  
});
app.get('/index.html', function (req, res) {
  
  //res.json(counter);
  res.render("index.html", {counter:counter});  
});

app.get('/counter', function (req, res) {
  res.json(counter);
});


app.post('/thank', function (req, res) {

  res.render('thank.html');
  counter++;    
  //console.log(counter + ":2nd one");

  
  // Saves counter into the store and send response AFTER the store has been saved
  storage.setItem("counter", counter);


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


  for (var i of districts) {
    //setTimeout(wait, 3000);
    postData.district = i;
    options.headers.Referer += postData.district;

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

    //postData.district = "AD";
    options.headers.Referer = 'https://lcmspubcontact.lc.ca.gov/PublicLCMS/ContactPopup.php?district=';

  }

  for (var i of zipmap.get(postData.txtZip)){
    postData.district = i;
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

  }


  /*
  var req = http.request(options, callback);
  req.end();
  */
/*
  var port = process.env.PORT || 3000;
  var server = app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
  });
*/

});


//module.exports.handler = app;

function wait() {
  // all the stuff you want to happen after that pause
  //await delay();
  console.log('waiting');
}
function delay() {
  return new Promise(resolve => setTimeout(resolve, 300));
}


