import * as path from "path";
import { Construct } from "constructs";
import {
  Stack,
  StackProps,
  aws_lambda_nodejs as NodejsFunction,
  aws_apigateway as ApiGateway,
  aws_dynamodb as dynamodb,
} from "aws-cdk-lib";
// import { NodejsFunction } from "@aws-cdk/aws-lambda-nodejs";
// import { RestApi, LambdaIntegration } from "@aws-cdk/aws-apigateway";
// import * as dynamodb from "@aws-cdk/aws-dynamodb";

interface CommentsStackProps extends StackProps {
  allowOrigins: string[];
}

export class CommentsStack extends Stack {
  constructor(scope: Construct, id: string, props: CommentsStackProps) {
    super(scope, id, props);

    // DynamoDB
    const commentsTable = new dynamodb.Table(this, "CommentsTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
    });

    // Lambdas
    const commentsGet = new NodejsFunction.NodejsFunction(this, "CommentsGet", {
      entry: path.join(__dirname, "..", "src", "commentsGet.ts"),
      handler: "handler",
      environment: {
        TABLE_NAME: commentsTable.tableName,
      },
    });

    const commentsPost = new NodejsFunction.NodejsFunction(
      this,
      "CommentsPost",
      {
        entry: path.join(__dirname, "..", "src", "commentsPost.ts"),
        handler: "handler",
        environment: {
          TABLE_NAME: commentsTable.tableName,
        },
      }
    );

    // Grant lambdas read/write access
    commentsTable.grantReadData(commentsGet);
    commentsTable.grantWriteData(commentsPost);

    // API
    const commentsApi = new ApiGateway.RestApi(this, "CommentsApi", {
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
    commentsApi.root.addMethod(
      "GET",
      new ApiGateway.LambdaIntegration(commentsGet)
    );
    commentsApi.root.addMethod(
      "POST",
      new ApiGateway.LambdaIntegration(commentsPost)
    );
  }
}
