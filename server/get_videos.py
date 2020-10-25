import requests
import os
from pprint import pprint


class GetVideoId:
    def __init__(self) -> None:
        self.API_KEY = os.environ.get("MultiTubeYTKEY")

    def get_playlist_videos(self, playlist_id: str, next_page_token: str) -> dict:
        params = {
            "key": self.API_KEY,
            "playlistId": playlist_id,
            "part": "contentDetails",
            "maxResults": "15",
            "pageToken": next_page_token,
        }

        r = requests.get(
            "https://www.googleapis.com/youtube/v3/playlistItems", 
            params=params
        )
        playlist_data = r.json()
        video_ids = []
        for video_id in playlist_data["items"]:
            video_id = video_id["contentDetails"]["videoId"]
            video_ids.append("https://www.youtube.com/watch?v=" + video_id)

        next_page_token = playlist_data.get("nextPageToken")

        return {"video_ids": video_ids, "nextPageToken": next_page_token}

    def get_channel_videos(self, channel_id: str, next_page_token: str) -> dict:
        id = "id" if channel_id[:2] == "UC" else "forUsername"
        params = {
            "key": self.API_KEY,
            id: channel_id,
            "part": "contentDetails",
            "maxResults": "15",
            "pageToken": next_page_token,
        }

        r = requests.get(
            "https://www.googleapis.com/youtube/v3/channels", 
            params=params
        )
        upload_id = r.json()["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
        videos_ids = self.get_playlist_videos(upload_id, next_page_token)

        return videos_ids
