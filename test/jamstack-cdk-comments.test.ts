import {
  expect as expectCDK,
  haveResource,
  haveResourceLike,
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
      haveResourceLike("AWS::ApiGateway::RestApi", {
        Name: "CommentsApi",
      })
    );
  });
});
