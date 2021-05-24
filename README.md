# JAMstack CDK comments

Add comments to your JAMstack website in few minutes. Maybe it is not a comprehensive solution that serves all your needs, but it works great as a starting point. [I have been using it for months on my personal website](https://pawelgrzybek.com/bye-bye-disqus-i-built-my-commenting-system-using-aws-serverless-stack-and-netlify-build-hooks/) and it worked like a charm. I hope it will help you too!

## Prerequisites

- [AWS account](https://aws.amazon.com)
- [AWS CLI configured](https://aws.amazon.com/cli/)
- [Node.js](https://nodejs.org/en/) installed
- [CDK](https://docs.aws.amazon.com/cdk/latest/guide/work-with.html) installed

## How it works

[The AWS Cloud Development Kit (AWS CDK)](https://aws.amazon.com/cdk/) is AaaS (Architecture as a Service) framework to deploy your cloud application resources all at once. It is an abstraction on top of the [AWS Cloud​Formation](https://aws.amazon.com/cloudformation/). This stack creates a simple API that consists of few resources:

- API Gateway - creates `GET` and `POST` endpoint
- AWS Lambdas - handler logic for `GET` and `POST` request
- DynamoDB - database to store your comments

### How to get all comments

To get all the comments, you have to call your API with `GET` request. Ideally, in a JAMstack manner, you should make this call as part of your build process, not on the client. Popular static site generators make this process very convenient.

```
curl --request GET \
  --url {{ COMMENTS_API_OUTPUT_URL_GOES_HERE }}
```

### How to post a comment

To post a comment, send a `POST` request with few mandatory fields: `name`, `comment` and `slug`.

```
curl --request POST \
  --url {{ COMMENTS_API_OUTPUT_URL_GOES_HERE }}
  --header 'Content-Type: application/json' \
  --data '{
	"name": "Pawel Grzybek",
	"comment": "Bye bye Disqus! I don't need ya anymore!",
	"slug": "slug-of-a-page"
}'
```

## How to deploy your own JAMstack CDK comments stack

1. Install dependencies
2. Bootstrap an environment
3. Configure stack
4. Deploy stack

### Install dependencies

```
npm i
```

or

```
yarn
```

### Bootstrap an environment

If you haven't already, you need to [bootstrap an environment](https://docs.aws.amazon.com/cdk/latest/guide/bootstrapping.html) to be able to deploy AWS CDK apps. This process will create required resources (Amazon S3 bucket for storing files and IAM roles that grant permissions needed to perform deployments) and needs to be done per environment (a combination of an AWS account and region).

```
cdk bootstrap
```

### Configure stack

Configure `allowOrigins` in `bin/comments.ts`. This value is used in CORS configuration.

```ts
// bin/comments.ts

new CommentsStack(app, "CommentsStack", {
  allowOrigins: ["https://pawelgrzybek.com"],
});
```

### Deploy stack

This process may take few seconds. It will result with your stack API URL printed to the console.

```
cdk deploy
```

Example output:

```
Outputs:
CommentsStack.CommentsApiOutput = https://mp5chwpwy4.execute-api.eu-west-2.amazonaws.com/
```

## Your contribution

Don't be a jerk and stop complaining on Twitter of HackerNews. If there is something that you can think of to improve it, please [reach out to me](https://twitter.com/pawelgrzybek) or submit a pull request. Let's build a better web together instead of spamming shit all over the place please.

Enjoy 👋
