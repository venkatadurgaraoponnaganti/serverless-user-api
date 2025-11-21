const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const db = new DynamoDBClient();

exports.handler = async (event) => {
  try {
    const userId = event.pathParameters && event.pathParameters.id;
    if (!userId) return { statusCode: 400, body: JSON.stringify({ error: "Missing id" }) };

    const params = { TableName: process.env.TABLE_NAME, Key: { userId: { S: userId } } };
    const result = await db.send(new GetItemCommand(params));
    if (!result.Item) return { statusCode: 404, body: JSON.stringify({ error: "Not found" }) };

    // convert DynamoDB item to simple JSON
    const item = {};
    for (const k of Object.keys(result.Item)) {
      const v = result.Item[k];
      if (v.S) item[k] = v.S;
      else if (v.N) item[k] = Number(v.N);
    }
    return { statusCode: 200, body: JSON.stringify(item) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Internal error" }) };
  }
};

