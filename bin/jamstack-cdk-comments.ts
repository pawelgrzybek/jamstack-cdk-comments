#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { CommentsStack } from "../lib/jamstack-cdk-comments-stack";

const app = new cdk.App();
new CommentsStack(app, "CommentsStack", {
  allowOrigins: ["https://jamstack-cdk-comments.netlify.app"],
});
