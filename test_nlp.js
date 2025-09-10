const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient({
  keyFilename: './nlp_key/secret_key.json',
});

const positiveText = 'I love programming and solving problems!';
const negativeText = 'I hate bugs and errors in my code.';
const positiveDocument = {
    content: positiveText,
    type: 'PLAIN_TEXT',
};
const negativeDocument = {
    content: negativeText,
    type: 'PLAIN_TEXT',
};

(async () => {
    try {
    const [positiveResult] = await client.analyzeSentiment({ document: negativeDocument });
    console.log(positiveResult);
} catch (error) {
    console.error('Error analyzing sentiment:', error);
}
})();