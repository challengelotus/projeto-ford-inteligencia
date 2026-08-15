# app/services/youtube_service.py
import os
import sys
import json
from pathlib import Path

FILE_PATH = Path(__file__).resolve()
BACKEND_DIR = FILE_PATH.parent.parent.parent

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

import google_auth_oauthlib.flow
import googleapiclient.discovery
from youtube_transcript_api import YouTubeTranscriptApi
from app.core.config import settings

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]


def get_transcript(video_id: str, video_url: str, video_title: str) -> dict | None:
    """
    Busca o transcript de um vídeo. Tenta português e inglês (incluindo legendas automáticas).
    Se não encontrar ou falhar, retorna None.
    """
    try:
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['pt', 'pt-BR', 'en'])
        except Exception:
            ytb_api = YouTubeTranscriptApi()
            transcript_list = ytb_api.fetch(video_id, languages=['pt', 'pt-BR', 'en']).to_raw_data()

        transcript_all = ""
        for item in transcript_list:
            text = item.get('text', '')
            if '[' in text or ']' in text:
                continue
            transcript_all += f" {text}"

        transcript_clean = transcript_all.strip()
        if not transcript_clean:
            return None

        return {
            "title": video_title,
            "url": video_url,
            "transcript": transcript_clean
        }
    except Exception:
        return None


def get_youtube_transcripts(carro: str, max_results: int = 2) -> list[dict]:
    """
    Busca vídeos no YouTube sobre o carro e retorna apenas os que possuem transcript.
    """
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_config(
        settings.YOUTUBE_CLIENT_CONFIG, SCOPES
    )
    credentials = flow.run_local_server(port=0)
    youtube = googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

    request = youtube.search().list(
        part="snippet",
        maxResults=max_results * 3,
        q=f"review {carro.lower()}",
        type="video"
    )
    response = request.execute()

    data = []
    for item in response.get('items', []):
        if len(data) >= max_results:
            break

        video_id = item['id']['videoId']
        video_title = item['snippet']['title']
        video_url = f"https://www.youtube.com/watch?v={video_id}"

        video_transcript = get_transcript(video_id, video_url, video_title)

        if video_transcript:
            data.append(video_transcript)

    settings.DATA_RAW_DIR.mkdir(parents=True, exist_ok=True)

    output_file = settings.DATA_RAW_DIR / "transcript_youtube.json"
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

    return data


if __name__ == "__main__":
    get_youtube_transcripts("Ford Ranger 2025", max_results=2)