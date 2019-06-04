const Alexa = require('ask-sdk-core');
const aws      = require('aws-sdk');
const GoogleSearch = require("google-searcher");
const uuidv1 = require('uuid/v1');

const dynamodb = new aws.DynamoDB();
const dbTable = 'woodhouse-table';

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
    var query = "";
    var searchURL = "";
    if (handlerInput.requestEnvelope.request.intent.slots.query.value && handlerInput.requestEnvelope.request.intent.slots.query.value !== "?") {
      query = handlerInput.requestEnvelope.request.intent.slots.query.value;
    }
    new GoogleSearch()
    .host("www.google.com")
    .lang("en")
    .query(query)
    .exec()
    .then(results => {
      searchURL = results[0]
      var params = {
        Item: {
          "id": {
            S: uuidv1()
          },
          "url": {
            S: searchURL
          },
          "creationTime": {
            N: Date.now().toString()
          },
          "ttl": {
            N: (Date.now()+30).toString()
          }
        },
        ReturnConsumedCapacity: "TOTAL",
        TableName: dbTable
      };
      dynamodb.putItem(params, (err, data) => {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
      });

    });
    const speechText = `<voice name="Brian">Opening ${query} now</voice>`;
    return handlerInput.responseBuilder
    .speak(speechText)
    .withSimpleCard(speechText)
    .getResponse();
  },
};
const FightIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'FightIntent';
  },
  handle(handlerInput) {
    const speechText = `<voice name="Brian">What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.</voice>`;
    return handlerInput.responseBuilder
    .speak(speechText)
    .withSimpleCard(speechText)
    .getResponse();
  },
};

///////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////BORING HANDLERS BELOW/////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
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
      .withSimpleCard('Hello World', speechText)
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
    FightIntentHandler,
    OpenIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
