import * as cdk from "@aws-cdk/core";
import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as path from "path";

interface CommentsStackProps extends cdk.StackProps {
  allowOrigins: string[];
}

export class CommentsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: CommentsStackProps) {
    super(scope, id, props);

    // DynamoDB
    const commentsTable = new dynamodb.Table(this, "CommentsTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    // Lambdas
    const commentsGet = new NodejsFunction(this, "CommentsGet", {
      entry: path.join(__dirname, "..", "src", "commentsGet.ts"),
      handler: "handler",
      environment: {
        TABLE_NAME: commentsTable.tableName,
      },
    });

    const commentsPost = new NodejsFunction(this, "CommentsPost", {
      entry: path.join(__dirname, "..", "src", "commentsPost.ts"),
      handler: "handler",
      environment: {
        TABLE_NAME: commentsTable.tableName,
      },
    });

    // Grant lambdas read/write access
    commentsTable.grantReadData(commentsGet);
    commentsTable.grantWriteData(commentsPost);

    // API
    const commentsApi = new RestApi(this, "CommentsApi", {
      defaultCorsPreflightOptions: {
        allowHeaders: ["Content-Type"],
        allowOrigins: props.allowOrigins,
        allowMethods: ["GET", "POST"],
      },
      deployOptions: {
        throttlingRateLimit: 1,
        throttlingBurstLimit: 1,
      },
    });
    commentsApi.root.addMethod("GET", new LambdaIntegration(commentsGet));
    commentsApi.root.addMethod("POST", new LambdaIntegration(commentsPost));
  }
}
