const expect = require('chai').expect;
const LambdaTester = require( 'lambda-tester' );

const woodhouse = require( '../handler' );

const openNetflixEvent = require('./events/event_openNetflix');
const helpEvent = require('./events/event_help');
const launchEvent = require('./events/event_launch');

describe('Alexa skill tests', () => {
  it('Add Netflix to dynamoDB', () => {
    return LambdaTester( woodhouse.handler )
    .event(openNetflixEvent)
    .expectResult( ( result ) => {
      expect(result.response.outputSpeech.ssml).to.equal('<speak><voice name="Brian">Opening netflix now</voice></speak>')
    });
  })
  it('Shows help', () => {
    return LambdaTester( woodhouse.handler )
    .event(helpEvent)
    .expectResult( ( result ) => {
      expect(result.response.outputSpeech.ssml).to.equal('<speak>Ask me to open something!</speak>')
      // expect(result.response.outputSpeech.ssml).to.equal('<speak><voice name="Brian">Opening netflix now</voice></speak>')
    });
  })
  it('Should start woodhouse', () => {
    return LambdaTester( woodhouse.handler )
    .event(launchEvent)
    .expectResult( ( result ) => {
      expect(result.response.outputSpeech.ssml).to.equal('<speak><voice name=\"Brian\">I am woodhouse, your personal browser helper ask me to open something!</voice></speak>')
      // expect(result.response.outputSpeech.ssml).to.equal('<speak><voice name="Brian">Opening netflix now</voice></speak>')
    });
  })
});
