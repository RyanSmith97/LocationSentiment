# Locational Sentiment Analyser

This simple web app allows a user to click on any area on a map, and check the overall sentiment of the people in that area, based off realtime twitter data

## setup

Firstly create virtual environment and activate
```bash
python3 -m venv venv
source venv/bin/activate

```
Then install requirements.txt 
```bash
pip install -r requirements.txt
```
To properly display the map, you must place your Google Maps API key within the .env file in the **ui** directory

To collect and process data, the appropriate Twitter and Google API keys must be added under the **service** directory

Add your twitter keys to the twitterKeys.txt file

To set the Google Natural Language API Key, place the APIKey.json in the directory and run

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/api/key/APIKey.json"

```

Now, within the **ui** directory, run
```bash
npm start
```

In another terminal activate virtual environment and cd to **service** directory and run

```bash
flask run
```

visit [http://localhost:3000](http://localhost:3000/) to view the interactive map

## Usage

Clicking anywhere on the map will make a request to process and display the sentiment of people in that area

this is based off of Twitter data using Twitters rest API and using Google's natural language API
