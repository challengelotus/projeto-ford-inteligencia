import os
import json

import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors

from youtube_transcript_api import YouTubeTranscriptApi

BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SECRET_FILE = os.path.join(BACKEND_DIR, "utils", "secret_file.json")
DATA_DIR = os.path.join(BACKEND_DIR, "data", "raw", "transcript_youtube.json")

scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"]

def get_videos(carro):
  # Disable OAuthlib's HTTPS verification when running locally.
  # *DO NOT* leave this option enabled in production.
  os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

  api_service_name = "youtube"
  api_version = "v3"

  flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
    SECRET_FILE, scopes)
  credentials = flow.run_local_server(port=0)
  youtube = googleapiclient.discovery.build(
    api_service_name, api_version, credentials=credentials)

  request = youtube.search().list(
    part="snippet",
    maxResults=2,
    q=f"review {carro.lower()}", # O que o usuário quer buscar
    type="video"
  )
  response = request.execute()

  data = []
  for item in response['items']:
    video_id = item['id']['videoId']
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    video_title = item['snippet']['title']
    video_transcript = get_transcript(video_id, video_url, video_title)
    data.append(video_transcript)
  
  with open(DATA_DIR, 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)


def get_transcript(video_id, video_url, video_title):
  ytb_api = YouTubeTranscriptApi()
  fetch_video = ytb_api.fetch(video_id, languages=['pt', 'en'])

  transcript_all = ""
  for item in fetch_video.to_raw_data():
    if '[' in item['text'] or ']' in item['text']:
      continue
    transcript_all += f" {item['text']}"

  return {
    "title": video_title,
    "url": video_url,
    "transcript": transcript_all
  }


if __name__ == "__main__":
    get_videos('Ford Ranger Raptor 2025')
