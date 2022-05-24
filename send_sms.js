// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid ="AC3cdeeea09eef69c4217ab53533ee02a5";
const authToken = "ad8d8ef553fb89c11232674ca6e6fed2";
const client = require('twilio')(accountSid, authToken);

client.messages
  .create({
      
     body: 'Hi shelby',
     from: '[+][1][9207813910]',
     to: '[+][1][4062393092]'
   })
  .then(message => console.log(message.sid));