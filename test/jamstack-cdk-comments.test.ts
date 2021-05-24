import {
  expect as expectCDK,
  haveResource,
  haveResourceLike,
  haveOutput,
  countResources,
} from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Comments from "../lib/jamstack-cdk-comments-stack";

describe("JAMstack CDK comments Stack", () => {
  const app = new cdk.App();
  const stack = new Comments.CommentsStack(app, "MyTestStack", {
    allowOrigins: ["https://pawelgrzybek.com"],
  });

  it("creates DynamoDB", () => {
    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
  });

  it("creates Lambdas", () => {
    expectCDK(stack).to(countResources("AWS::Lambda::Function", 2));
    expectCDK(stack).to(
      haveResource("AWS::Lambda::Function", {
        Handler: "index.handler",
        Runtime: "nodejs14.x",
      })
    );
  });

  it("creates API Gateway", () => {
    expectCDK(stack).to(
      haveResourceLike("AWS::ApiGatewayV2::Api", {
        CorsConfiguration: {
          AllowHeaders: ["Content-Type"],
          AllowMethods: ["GET", "POST"],
          AllowOrigins: ["https://pawelgrzybek.com"],
        },
        Name: "CommentsApi",
        ProtocolType: "HTTP",
      })
    );
  });

  it("creates GET route", () => {
    expectCDK(stack).to(
      haveResource("AWS::ApiGatewayV2::Route", {
        RouteKey: "GET /",
      })
    );
  });

  it("creates POST route", () => {
    expectCDK(stack).to(
      haveResource("AWS::ApiGatewayV2::Route", {
        RouteKey: "POST /",
      })
    );
  });

  it("creates output", () => {
    expectCDK(stack).to(
      haveOutput({
        outputName: "CommentsApiOutput",
        exportName: "CommentsApiOutput",
      })
    );
  });
});
