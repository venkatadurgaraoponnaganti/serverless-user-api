const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const db = new DynamoDBClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    if (!body.name || !body.email) {
      return { statusCode: 400, body: JSON.stringify({ error: "name and email required" }) };
    }
    const userId = Date.now().toString();
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        userId: { S: userId },
        name: { S: body.name },
        email: { S: body.email }
      }
    };
    await db.send(new PutItemCommand(params));
    return { statusCode: 201, body: JSON.stringify({ message: "User created", userId }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal error" }) };
  }
};

