const Alexa = require('ask-sdk-core');
const aws = require('aws-sdk');
const GoogleSearch = require('google-searcher');
const uuidv1 = require('uuid/v1');

const dynamodb = new aws.DynamoDB();
const dbTable = process.env.DYNAMDBTABLE;

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = '<voice name="Brian">I am woodhouse, your personal browser helper ask me to open something!</voice>';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(speechText)
      .getResponse();
  },
};

const OpenIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'OpenIntent';
  },
  handle(handlerInput) {
    let query = '';
    if (handlerInput.requestEnvelope.request.intent.slots.query.value && handlerInput.requestEnvelope.request.intent.slots.query.value !== '?') {
      query = handlerInput.requestEnvelope.request.intent.slots.query.value;
    }
    new GoogleSearch()
      .host('www.google.com')
      .lang('en')
      .query(query)
      .exec()
      .then((results) => {
        const resultURL = results[0];

        const params = {
          Item: {
            id: {
              S: uuidv1(),
            },
            url: {
              S: resultURL,
            },
            creationTime: {
              N: Date.now().toString(),
            },
            ttl: {
              N: (Date.now() + 30).toString(),
            },
          },
          ReturnConsumedCapacity: 'TOTAL',
          TableName: dbTable,
        };
        dynamodb.putItem(params, (err, data) => {
          if (err) console.log(err, err.stack); // an error occurred
          else console.log(data); // successful response
        });
      });
    const speechText = `<voice name="Brian">Opening ${query} now</voice>`;
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(speechText)
      .getResponse();
  },
};

// /////////////////////////////////////////////////////////////////////////////////////////
// ///////////////////////////BORING HANDLERS BELOW/////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Ask me to open something!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    OpenIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
