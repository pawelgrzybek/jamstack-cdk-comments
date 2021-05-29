import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { obfuscateId, generateResponse } from "./utils";

const { AWS_REGION: region, TABLE_NAME: TableName } = process.env;

// clients init
const dbClient = new DynamoDBClient({ region });

async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (!event?.body) {
    console.error("Required body is missing.");

    return generateResponse(403, { message: "Required body is missing." });
  }

  try {
    const { name, comment, slug } = JSON.parse(event.body);

    const input = {
      id: uuidv4(),
      name,
      comment,
      slug,
      createdAt: new Date().getTime().toString(),
    };

    await dbClient.send(
      new PutItemCommand({
        TableName,
        Item: marshall(input),
      })
    );

    return generateResponse(200, {
      ...input,
      id: obfuscateId(input.id),
    });
  } catch (error) {
    console.error(error.message);

    return generateResponse(400, { message: error.message });
  }
}

export { handler };
