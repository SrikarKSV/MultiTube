from flask import Flask, request, jsonify
from get_videos import GetVideoId
import os
from flask_cors import cross_origin

app = Flask(__name__)


@app.route("/")
def home():
    return "Hello World"


@app.route("/playlist")
@cross_origin()
def playlist():
    api_key = request.args.get("apikey")
    get_videos_id = (
        GetVideoId(api_key) if api_key else GetVideoId(os.environ.get("MultiTubeYTKEY"))
    )
    playlist_id = request.args.get("id")
    next_page_token = request.args.get("nextPageToken")
    next_page_token = None if next_page_token == "null" else next_page_token
    return jsonify(get_videos_id.get_playlist_videos(playlist_id, next_page_token))


@app.route("/channel")
@cross_origin()
def channel():
    api_key = request.args.get("apikey")
    get_videos_id = (
        GetVideoId(api_key) if api_key else GetVideoId(os.environ.get("MultiTubeYTKEY"))
    )
    channel_id = request.args.get("id")
    next_page_token = request.args.get("nextPageToken")
    next_page_token = None if next_page_token == "null" else next_page_token
    return jsonify(get_videos_id.get_channel_videos(channel_id, next_page_token))


if __name__ == "__main__":
    app.run(debug=True)
