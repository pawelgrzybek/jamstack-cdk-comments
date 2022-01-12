#!/usr/bin/env node
import "source-map-support/register";
import { App } from "aws-cdk-lib";
import { CommentsStack } from "../lib/jamstack-cdk-comments-stack";

const app = new App();
new CommentsStack(app, "CommentsStack", {
  allowOrigins: ["https://example.com"],
});
