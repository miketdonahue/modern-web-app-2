/* eslint-disable no-console */
const AWS = require('aws-sdk');

const deleteTemplate = new AWS.SES()
  .deleteTemplate({
    TemplateName: 'welcome',
  })
  .promise();

const run = async () => {
  try {
    const data = await deleteTemplate;
    console.log('EMAIL-TEMPLATE: Deleted', data);
  } catch (err) {
    console.log('EMAIL-TEMPLATE: Failed', err);
  }
};

run();
