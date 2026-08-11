# app/services/youtube_service.py
import os
import json
from pathlib import Path
import google_auth_oauthlib.flow
import googleapiclient.discovery
from youtube_transcript_api import YouTubeTranscriptApi
from app.core.config import settings

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

def get_youtube_transcripts(carro: str, max_results: int = 2) -> list[dict]:
    """
    Busca vídeos no YouTube sobre o carro e retorna os transcripts.
    """
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

    # Autenticação
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
        settings.YOUTUBE_SECRET_FILE, SCOPES
    )
    credentials = flow.run_local_server(port=0)
    youtube = googleapiclient.discovery.build("youtube", "v3", credentials=credentials)

    # Busca
    request = youtube.search().list(
        part="snippet",
        maxResults=max_results,
        q=f"review {carro.lower()}",
        type="video"
    )
    response = request.execute()

    data = []
    for item in response.get('items', []):
        video_id = item['id']['videoId']
        video_title = item['snippet']['title']
        video_url = f"https://www.youtube.com/watch?v={video_id}"

        try:
            transcript_list = YouTubeTranscriptApi.fetch(video_id, languages=['pt', 'en'])
            transcript_all = " ".join([t['text'] for t in transcript_list.to_raw_data() if '[' not in t['text']])
        except Exception:
            transcript_all = "Transcript não disponível"

        data.append({
            "title": video_title,
            "url": video_url,
            "transcript": transcript_all
        })

    # Salva em arquivo (opcional)
    output_file = settings.DATA_RAW_DIR / "transcript_youtube.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    return data
