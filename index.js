// Import Module -----------------------------------------------------------------------------------------------------------------------------------------------------------------

var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer');
const upload = multer({ dest: "uploads/" });
const mongoose = require('mongoose');
const mongoUri = require('./info.js');

var app = express();

// App Display, Mongoose Connect, Access, Tools and Server ----------------------------------------------------------------------------------------------------------------------------------------------------
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

// Schema and Model Creation --------------------------------------------------------------------------------------------------------------------------------------------------------------

// SCHEMA Creation
const Schema = mongoose.Schema;

const fileSchema = new Schema({
  fieldname: {type: String},
  encoding: {type: String},
  type: {type: String},
  destination: {type: String},
  filename: {type: String},
  path: {type: String},
  size: {type: Number},
});

// Model Creation

let File = mongoose.model('File', fileSchema);

//Reset DB Collection----------------------------------------------------------------------------------------------------------------------------------------------------------------
// File.deleteMany({})
//   .then(result => {
//     console.log(`${result.deletedCount} document(s) deleted`);
//   })
//   .catch(error => {
//     console.error('Error clearing documents:', error);
//   });


// END POINT ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

app.post('/api/fileanalyse', upload.single("upfile"), function(req, res) {
  try {
    let fieldname = req.file.fieldname;
    let encoding = req.file.encoding;
    let type = req.file.mimetype;
    let destination = req.file.destination;
    let filename = req.file.originalname;
    let path = req.file.path;
    let size = req.file.size; 

    File.create({
      fieldname: fieldname,
      encoding: encoding,
      type: type,
      destination: destination,
      filename: filename,
      path: path,
      size: size,
    })

    return res.json({
      name: filename,
      type: type,
      size: size,
    })

  } catch (err) {
    console.log(err);
      res.json({ error: 'Failed upload file'});
  }
});