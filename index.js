const AWS = require('aws-sdk');
const S3 = new AWS.S3();


exports.handler = async (event) => {
  try {
    if (!event || !event.Records || !event.Records[0]) {
      throw new Error('invalid event');
    }

    // dynamic way of getting from bucket
    let Bucket = event.Records[0].s3.bucket.name;
    let Key = event.Records[0].s3.object.key;

    console.log(JSON.stringify(event));

    if (Key === 'images.json') {
      let imgArr = [];
    }

    let imageJson = await S3.getObject({ Bucket, Key: 'images.json' }).promise();
    let strImageJson = imageJson.Body.toString();
    let imgArr = JSON.parse(strImageJson);

    imgArr.push({
      name: event.Records[0].s3.object.key,
      size: event.Records[0].s3.object.size,
    });


    //console.warn(imgArr);

    await S3.putObject({
      Bucket,
      Key: 'images.json',
      Body: JSON.stringify(imgArr),
    }).promise();

    const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda!'),
    };

    return response;
  }
  catch (e) {
    console.error(e);
    const response = {
      statusCode: 500,
      body: JSON.stringify('Error'),
    };
    return response;
  }




};
