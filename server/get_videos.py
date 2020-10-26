import requests

class GetVideoId:
    def __init__(self, api_key: str) -> None:
        self.API_KEY = api_key  # os.environ.get("MultiTubeYTKEY")

    def get_playlist_videos(self, playlist_id: str, next_page_token: str) -> dict:
        params = {
            "key": self.API_KEY,
            "playlistId": playlist_id,
            "part": "contentDetails",
            "maxResults": "15",
            "pageToken": next_page_token,
        }

        r = requests.get(
            "https://www.googleapis.com/youtube/v3/playlistItems", params=params
        )

        playlist_data = r.json()
        try:
            video_ids = []
            for video_id in playlist_data["items"]:
                video_id = video_id["contentDetails"]["videoId"]
                video_ids.append(video_id)

            next_page_token = playlist_data.get("nextPageToken")

            return {"video_ids": video_ids, "nextPageToken": next_page_token}
        except KeyError:
            error_code = playlist_data["error"]["code"]
            return {"error": error_code}

    def get_channel_videos(self, channel_id: str, next_page_token: str) -> dict:
        try:
            id = "id" if channel_id[:2] == "UC" else "forUsername"
        except TypeError:
            return {"error": "Please provide a channel ID"}
        
        params = {
            "key": self.API_KEY,
            id: channel_id,
            "part": "contentDetails",
            "pageToken": next_page_token,
        }

        r = requests.get(
            "https://www.googleapis.com/youtube/v3/channels", params=params
        )

        channel_data = r.json()
        try:
            upload_id = channel_data["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
        except KeyError:
            return {"error": 403} if channel_data.get("error") else {"error": 404}

        videos_ids = self.get_playlist_videos(upload_id, next_page_token)
        return videos_ids
