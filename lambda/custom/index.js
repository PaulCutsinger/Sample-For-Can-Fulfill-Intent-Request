/* eslint-disable  func-names */
/* eslint-disable  no-console */
 /*jshint esversion: 6 */

const Alexa = require('ask-sdk-core');

const CFIRAboutIntentHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `CanFulfillIntentRequest` &&
     handlerInput.requestEnvelope.request.intent.name === 'aboutIntent';
  },
  handle(handlerInput){
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    console.log ("in CFIR AboutIntentHandler " + JSON.stringify(slotValues));

    if (slotValues.voiceExpert.isValidated) {
      console.log ("in CFIR AboutIntentHandler YES");
      return handlerInput.responseBuilder
      .withCanFulfillIntent(
        {
          "canFulfill": "YES",
          "slots":{
              "voiceExpert": {
                  "canUnderstand": "YES",
                  "canFulfill": "YES"
                }
            }
        })
        .getResponse();
    } else {
      console.log ("in CFIR AboutIntentHandler canFulfill == NO");
      return handlerInput.responseBuilder
      .withCanFulfillIntent(
        {
          "canFulfill": "YES",
          "slots":{
              "voiceExpert": {
                  "canUnderstand": "YES",
                  "canFulfill": "NO"
                }
            }
        })
        .getResponse();
    }

    return handlerInput.responseBuilder
      .speak(speechoutput)
      .reprompt(speechoutput)
      .getResponse();
  }
};

const AboutIntentHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `IntentRequest`  &&
     handlerInput.requestEnvelope.request.intent.name === 'aboutIntent';
  },
  handle(handlerInput){
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    let speechoutput = intentName; //default response
    const filledSlots = handlerInput.requestEnvelope.request.intent.slots;
    const slotValues = getSlotValues(filledSlots);
    console.log ("in AboutIntentHandler " );
    console.log ("   slotValues " + JSON.stringify(slotValues));
    console.log ("   bio " + voiceExpertBios[slotValues.voiceExpert.value.toLowerCase()]);

    //TODO disambiguate if needed

    if (slotValues.voiceExpert.isValidated) {
      speechoutput = slotValues.voiceExpert.value + " " + voiceExpertBios[slotValues.voiceExpert.value.toLowerCase()];
    }

    return handlerInput.responseBuilder
      .speak(speechoutput)
      .reprompt(speechoutput)
      .getResponse();
  }
};


const LaunchHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `LaunchRequest` ||
    (handlerInput.requestEnvelope.request.type === `IntentRequest`  &&
     handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent');
  },
  handle(handlerInput){
    //const requestType = handlerInput.requestEnvelope.request.type;
    //bios = getRandomItem(voiceExpertBios);
    //console.log(voiceExpertBios);

    let speech = "We have a long list of voice experts like, "+ Object.keys(getRandomItem(voiceExpertBios))+ " or "+ Object.keys(getRandomItem(voiceExpertBios))+ ". Who would you like to hear about?";
    let repromt = "Would you prefer to hear about "+ Object.keys(getRandomItem(voiceExpertBios))+ " or "+ Object.keys(getRandomItem(voiceExpertBios))+"?";
    return handlerInput.responseBuilder
      .speak(speech)
      .reprompt(repromt)
      .getResponse();
  }
};

const StopHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `IntentRequest`  &&
     (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent' ||
   handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' )
    ;
  },
  handle(handlerInput){
    //const requestType = handlerInput.requestEnvelope.request.type;
    //bios = getRandomItem(voiceExpertBios);
    //console.log(voiceExpertBios);

    let speech = getRandomItem(["goodbye","see you next time", "", "bye", ""]);
      return handlerInput.responseBuilder
      .speak(speech)
      .getResponse();
  }
};

const IntentReflectorHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `IntentRequest`;
  },
  handle(handlerInput){
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    return handlerInput.responseBuilder
      .speak(intentName)
      .getResponse();
  }
};
const SessionEndedReflectorHandler ={
  canHandle(handlerInput){
    return handlerInput.requestEnvelope.request.type === `SessionEndedRequest`;
  },
  handle(handlerInput){
    const requestType = handlerInput.requestEnvelope.request.type;
    const sessionEndedReason = handlerInput.requestEnvelope.request.reason;
    console.log(`~~~~~~~~~~~~~~~~~~~`);
    console.log(requestType+ " "+sessionEndedReason);
    console.log(`~~~~~~~~~~~~~~~~~~~`);
  }
};

const RequestHandlerChainErrorHandler = {
  canHandle(handlerInput, error) {
    console.log(`~~~~~~~~~`);
    console.log(error.message);
    console.log(`~~~~~~~~~`);
    return error.message === `RequestHandlerChain not found!`;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Oops! Looks like you forgot to register a handler again')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const CFIRErrorHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === `CanFulfillIntentRequest`;
  },
  handle(handlerInput, error) {
    console.log(`CFIR Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .withCanFulfillIntent(
        {
          "canFulfill": "NO",
          "slots":{
              "voiceExpert": {
                  "canUnderstand": "NO",
                  "canFulfill": "NO"
                }
            }
        })
      .getResponse();
  },
};


const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

function getSlotValues(filledSlots) {
  const slotValues = {};

  console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
  Object.keys(filledSlots).forEach((item) => {
    const name = filledSlots[item].name;

    if (filledSlots[item] &&
      filledSlots[item].resolutions &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
      filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
      switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        case 'ER_SUCCESS_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            value: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
            id: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id,
            isValidated: true
          };
          break;
        case 'ER_SUCCESS_NO_MATCH':
          slotValues[name] = {
            synonym: filledSlots[item].value,
            value: filledSlots[item].value,
            id: null,
            isValidated: false,
          };
          break;
        default:
          break;
      }
    } else {
      slotValues[name] = {
        synonym: filledSlots[item].value,
        value: filledSlots[item].value,
        id: filledSlots[item].id,
        isValidated: false
      };
    }
  }, this);

  return slotValues;
}

function getRandomItem(arrayOfItems) {
    // can take an array, or a dictionary
    if (Array.isArray(arrayOfItems)) {
      // the argument is an array []
      let i = 0;
      i = Math.floor(Math.random() * arrayOfItems.length);
      return (arrayOfItems[i]);
    }
    if (typeof arrayOfItems === 'object') {
      // argument is object, treat as dictionary
      const result = {};
      const key = getRandomItem(Object.keys(arrayOfItems));
      result[key] = arrayOfItems[key];
      return result;
    }
    // not an array or object, so just return the input
    return arrayOfItems;
  }

const voiceExpertBios = {
  "anna van brookhoven":"works on alexa.design slash guide.",
  "jedidiah esposito":"is our instructional designer for voice user experience training.",
  "amit jotwani":"leads online training.",
  "azi frajar":"leads australia evangelism.",
  "sohan maheshwar":"leads India evangelism.",
  "ankit kala":"is in charge of in person training in India.",
  "max amordeluso":"leads the E.U. evangelism.",
  "andrea muttoni":"leads U.K evangelism.",
  "rob pulciani":"leads the Alexa Skills Kit team.",
  "eric king":"leads developer and consumer programs for the Alexa Skills Kit.",
  "kenny mathers":"leads in person and online training.",
  "franklin lobb":"is in charge of our training content.",
  "akersh srivastava":"runs in person training and can be found on twitter as, the only Akersh.",
  "glenn cameron":"runs the Alexa Champions program.",
  "mike maas":"leads smart home evangelism.",
  "cassidy williams":"can be found on twitter as, cassidoo",
  "cami williams":"leads gaming evangelism and can be found on twitter as, c willy c.s.",
  "justin jeffress":"runs in person training and focuses on dialog management.",
  "jeff blankenburg":"leads in skill purchasing evangelism.",
  "memo doring":"and his beard are regularly seen on twitch.tv slash Amazon Alexa.",
  "paul cutsinger":"can be found on twitter at Paul Cutsinger."
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    CFIRAboutIntentHandler,
    AboutIntentHandler,
    LaunchHandler,
    StopHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(
    CFIRErrorHandler,
    RequestHandlerChainErrorHandler,
    ErrorHandler
  )
  .lambda();
