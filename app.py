#!flask/bin/python
from flask import Flask, jsonify
import tweepy

# Imports the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums, types

# Instantiates a client
client = language.LanguageServiceClient()

# The text to analyze
text = u'Hello, world!'
document = types.Document(
    content=text,
    type=enums.Document.Type.PLAIN_TEXT)

# Detects the sentiment of the text
sentiment = client.analyze_sentiment(document=document).document_sentiment

print('Text: {}'.format(text))
print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))



app = Flask(__name__)

#get auth keys
keys = open("twitterKeys.txt", "r")
consumer_key = keys.readline().rstrip('\n')
consumer_secret = keys.readline().rstrip('\n')
access_token = keys.readline().rstrip('\n')
access_token_secret = keys.readline().rstrip('\n')
keys.close()


@app.route('/')
def index():
    # Authenticate
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    tweetlist = []
    api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    for tweet in tweepy.Cursor(api.search, since="2018-11-17", lang="en",
                               geocode="55.8642,-4.2518,30km").items(50):
        tweetlist.append(tweet.text)

    return jsonify({'tweets': tweetlist})


if __name__ == '__main__':
    app.run(debug=True)
