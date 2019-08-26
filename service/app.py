#!flask/bin/python
from flask import Flask, jsonify, request
import tweepy

# Imports the Google Cloud client library
from google.cloud import language
from google.cloud.language import enums, types
import re

# Instantiates a client


app = Flask(__name__)

# get auth keys
keys = open("twitterKeys.txt", "r")
consumer_key = keys.readline().rstrip('\n')
consumer_secret = keys.readline().rstrip('\n')
access_token = keys.readline().rstrip('\n')
access_token_secret = keys.readline().rstrip('\n')
keys.close()


# get cleaned list of tweets using Twitters rest API
def getTweets(geocode):
    tweetList = []

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)

    for tweet in tweepy.Cursor(api.search, since="2019-8-20", lang="en",
                               geocode=geocode, tweet_mode='extended').items(5):
        cleanTweet = ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)",
                                     " ", tweet.full_text).split())
        tweetList.append(cleanTweet.lower())
    return getSentiment(tweetList)


# get the sentiment of each tweet using Google's sentiment API
def getSentiment(tweetList):
    avgSentiment = 0

    client = language.LanguageServiceClient()

    for text in tweetList:
        document = types.Document(
            content=text,
            type=enums.Document.Type.PLAIN_TEXT)

        sentiment = client.analyze_sentiment(document=document).document_sentiment

        avgSentiment += sentiment.score

    return avgSentiment / len(tweetList)


@app.route('/getSentiment', methods=['POST'])
def main():

    lat = str(request.json.get("lat"))
    lng = str(request.json.get("lng"))

    geocode = lat + ',' + lng + ',30km'  # format geocode string

    #function call to get tweets which in turn will get sentiment
    avgSentiment = getTweets(geocode)

    # return analysed data
    return jsonify({'sentiment': avgSentiment})


if __name__ == '__main__':
    app.run(debug=True)
