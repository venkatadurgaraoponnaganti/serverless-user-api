const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client();

exports.handler = async (event) => {
  try {
    const userId = event.pathParameters && event.pathParameters.id;
    if (!userId) return { statusCode: 400, body: JSON.stringify({ error: "Missing id" }) };

    // Expecting base64 body with image bytes (Content-Type header is optional)
    const body = event.isBase64Encoded ? Buffer.from(event.body, "base64") : Buffer.from(event.body || "", "base64");
    if (!body || body.length === 0) return { statusCode: 400, body: JSON.stringify({ error: "Empty image" }) };

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `${userId}.jpg`,
      Body: body,
      ContentType: "image/jpeg"
    };
    await s3.send(new PutObjectCommand(params));
    return { statusCode: 200, body: JSON.stringify({ message: "Image uploaded" }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal error" }) };
  }
};

