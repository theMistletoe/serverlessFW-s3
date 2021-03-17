const serverless = require("serverless-http");
const express = require("express");
var AWS = require('aws-sdk');
AWS.config.update({region: 'ap-northeast-1'});
const app = express();

const multer = require("multer");
const multerS3 = require('multer-s3');
const path = require('path');
// const upload = multer();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', '*');
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', '*');
  next();
});

let s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'ap-northeast-1',
});

var upload = multer();

app.get("/", (req, res, next) => {
  console.log('ok')
  // // Create S3 service object
  // s3 = new AWS.S3({apiVersion: '2006-03-01'});

  // // Create the parameters for calling listObjects
  // var bucketParams = {
  //   Bucket : 'sample-20210313-open',
  // };

  // // Call S3 to obtain a list of the objects in the bucket
  // let data = ""
  // s3.listObjects(bucketParams, function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //     data = err;
  //   } else {
  //     console.log("Success", data);
  //     data = data;
  //   }
  // });

  return res.status(200).json({
    message: "Hello from root!",
    // data: data
  });
});

app.get("/hello", async (req, res, next) => {
  console.log('hello');
  // s3 = new AWS.S3({apiVersion: '2006-03-01'});

  var params = {
    Bucket: "20210313-sample-open",
    Key: "homecredit.png"
  };

  const data = await s3.getObject(params).promise();
  // console.log(data);
  const buffer = data.Body.toString('base64');
  // console.log(buffer);

  return res.status(200).json({
    message: "Hello from path!",
    // data : data,
    base64: buffer,
  });
});

app.post('/test_file_upload', upload.single('sample_file'), async (req, res) => {
// app.post('/test_file_upload', (req, res, next) => {
  req.setEncoding('binary')
  console.log(req.file);
  console.log(req.file.buffer.toString('base64'));
  // var s3 = new AWS.S3();
  var params = {
    Bucket: '20210313-sample-open',
    Key: `${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
    encoding: req.file.encoding,
    ACL: "public-read"
  };
  const uploadResult = await s3.upload(params, ).promise();
  return res.json({url: uploadResult.Location});

  // profileImgUpload(req, res, (error) => {
  //   if (error) {
  //     console.log('errors', error);
  //     res.json({ error: error });
  //   } else {
  //     // If File not found
  //     if (req.file === undefined) {
  //       console.log('Error: No File Selected!');
  //       res.json('Error: No File Selected');
  //     } else {
  //       // If Success
  //       const imageName = req.file.key;
  //       const imageLocation = req.file.location;
  //       console.log(imageName);
  //       console.log(imageLocation);
  //       // Save the file name into database into profile model
  //       res.json({
  //         image: imageName,
  //         location: imageLocation
  //       });
  //     }
  //   }
  // });
})

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
