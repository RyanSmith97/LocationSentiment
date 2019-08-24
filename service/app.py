#!flask/bin/python
from flask import Flask, jsonify
import tweepy

# Imports the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums, types

# Instantiates a client


app = Flask(__name__)

# get auth keys
keys = open("twitterKeys.txt", "r")
consumer_key = keys.readline().rstrip('\n')
consumer_secret = keys.readline().rstrip('\n')
access_token = keys.readline().rstrip('\n')
access_token_secret = keys.readline().rstrip('\n')
keys.close()


@app.route('/getSentinment')
def index():
    print("getting")
    # Authenticate
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    #get tweets
    tweetlist = []
    api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    for tweet in tweepy.Cursor(api.search, since="2019-8-20", lang="en",
                               geocode="55.8642,-4.2518,30km", tweet_mode='extended').items(5):
        tweetlist.append(tweet.full_text)


    client = language.LanguageServiceClient()

    #analyse tweets
    avgSentiment = 0
    for text in tweetlist:
        # text = u'Hello, world!'
        document = types.Document(
            content=text,
            type=enums.Document.Type.PLAIN_TEXT)

        # Detects the sentiment of the text
        sentiment = client.analyze_sentiment(document=document).document_sentiment
        avgSentiment += sentiment.score
        # print('Text: {}'.format(text))
        # print('Sentiment: {}, {}'.format(sentiment.score, sentiment.magnitude))

    #return analysed data
    return jsonify({'tweets': tweetlist, 'sentiment': avgSentiment / len(tweetlist)})


if __name__ == '__main__':
    app.run(debug=True)
