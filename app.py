#!flask/bin/python
from flask import Flask, jsonify
import tweepy
import json

app = Flask(__name__)

#get auth keys
keys = open("keys.txt", "r")
consumer_key = keys.readline()
consumer_secret = keys.readline()
access_token = keys.readline()
access_token_secret = keys.readline()
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
