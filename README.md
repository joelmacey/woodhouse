# Woodhouse Alexa Skills

Woodhouse is an alexa skill, that along with its chrome extension, allow you to search google with your voice, and open the top result in a new tab.

## Architecture

The alexa skill's lambda function requires the IAM role to have write access to the DynamoDB table that will be used for the skill.

The Chrome extension requires a Cognito Identity Pool ID that has access to read from the same DynamoDB table.

Both the DynamoDB and Cognito Identity Pool and it's associated roles are created via the serverless framework and can be found in resources as a cloudformation yml file.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Alexa Skill

### Prerequisites

For this project I used
- Node version 8.10.0
- NPM version 5.6.0
- Serverless Framework version 1.25.0 (Due to issues with 1.32.0 and the serverless-alexa-skills)

Please set all environment variables by copying and filling in the assocaited details if you have any issues getting ID's please read the tutorial [here](### Prerequisites

For this project I used
- Node version 8.10.0
- NPM version 5.6.0
- Serverless Framework version 1.25.0 (Due to issues with 1.32.0 and the serverless-alexa-skills)

### Installing

A step by step series of examples that tell you how to get a development env running

Run
```
npm install
```
in order to install all dependencies required for local development

### Linting

Linting is handled by eslint using airbnb standards and can be run by
```
npm run lint
```
to show the faults in the code or

```
npm run lint-fix
```
to fix all faults found in the code

### Testing

Running
```
npm run test
```
Will run the chai tests that will ensure the function returns accurate results.

### Deployment

Deployment is handled by the serverless framework
```
sls deploy
```
will deploy your functions

If you encounter any issues with deploying the alexa  please read more about the serverless alexa plugin [here](https://serverless.com/blog/how-to-manage-your-alexa-skills-with-serverless/)

## Chrome Extension

### Prerequisites

The chrome extension was built on version 72 of Google chrome

### Installing

Please update the IdentityPoolId with the one created by the deployed Cognito Pool.

In order to load the extension onto your browser.
1. Open your [chrome extensions page](chrome://extensions/)
2. Ensure Developer Mode is enabled
3. Click 'Load Unpacked'
4. Locate the 'client' folder and open it
5. The Extension should now be added to your browser.

For more details about loading an unpacked extension, click [here](https://developer.chrome.com/extensions/getstarted)
