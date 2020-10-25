import requests
import os
from pprint import pprint

API_KEY = os.environ.get('MultiTubeYTKEY')

def get_playlist_videos(playlist_id: str):
    params = {
        "key": API_KEY,
        "playlistId": playlist_id,
        "part": "contentDetails",
        "maxResults": "15"
    }

    r = requests.get('https://www.googleapis.com/youtube/v3/playlistItems', params=params)
    playlist_data = r.json()
    video_ids = []
    for video_id in playlist_data["items"]:
        video_id = video_id["contentDetails"]["videoId"]
        video_ids.append("https://www.youtube.com/watch?v=" + video_id)
    
    return video_ids

# video_ids = get_playlist_videos("PLT98CRl2KxKHaKA9-4_I38sLzK134p4GJ")
# pprint(video_ids)


def get_channel_videos(channel_id: str):
    params = {
        "key": API_KEY,
        "id": channel_id,
        "part": "contentDetails",
        "maxResults": "15"
    }

    r = requests.get("https://www.googleapis.com/youtube/v3/channels", params=params)
    upload_id = r.json()["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]
    videos_ids = get_playlist_videos(upload_id)
    pprint(videos_ids)

    

get_channel_videos("UCOvidg1tD2CxSrEDtmUKfBw")
