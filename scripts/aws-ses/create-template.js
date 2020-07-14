/* eslint-disable no-console */
const AWS = require('aws-sdk');
const emailTemplate = require('../../templates/emails/welcome/welcome.html.js');

const createTemplate = new AWS.SES()
  .createTemplate({
    Template: {
      TemplateName: 'welcome',
      HtmlPart: emailTemplate.html,
      SubjectPart: 'Subject',
    },
  })
  .promise();

const run = async () => {
  try {
    const data = await createTemplate;
    console.log('EMAIL-TEMPLATE: Created', data);
  } catch (err) {
    console.log('EMAIL-TEMPLATE: Failed', err);
  }
};

run();
