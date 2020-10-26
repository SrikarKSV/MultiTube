from flask import Flask, request, jsonify
from get_videos import GetVideoId
import os

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello World"

@app.route("/playlist")
def playlist():
    api_key = request.args.get("apikey")
    get_videos_id = api_key if api_key else GetVideoId(os.environ.get("MultiTubeYTKEY"))
    playlist_id = request.args.get("id")
    next_page_token = request.args.get("nextPageToken")
    return jsonify(get_videos_id.get_playlist_videos(playlist_id, next_page_token))

if __name__ == "__main__":
    app.run(debug=True)
