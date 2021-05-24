import { APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { generateResponse, orderComments } from "./utils";

// Env
const { AWS_REGION: region, TABLE_NAME: TableName } = process.env;

// Clients init
const dbClient = new DynamoDBClient({ region });

interface IComment {
  id: string;
  name: string;
  comment: string;
  slug: string;
  createdAt: number;
}

async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const { Items } = await dbClient.send(
      new ScanCommand({
        TableName,
      })
    );

    const unmarshalledItems = Items?.map((i) => unmarshall(i)) as IComment[];

    return generateResponse(200, orderComments(unmarshalledItems));
  } catch (error) {
    console.error(error.message);

    return generateResponse(400, error.message);
  }
}

export { handler };
