# app/services/scraper_service.py
import json
import os
import sys
from pathlib import Path
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings

from app.core.config import settings
from app.services.youtube_service import get_youtube_transcripts

def executar_scrapy_para_carro(carro: str) -> list[dict]:
    """
    Executa as 3 aranhas do Scrapy para um determinado carro.
    Retorna uma lista de dicionários com 'titulo', 'conteudo' e 'url'.
    """
    # 1. Força o caminho do settings para o Scrapy encontrar as spiders
    os.environ['SCRAPY_SETTINGS_MODULE'] = 'app.scraping.settings'

    # Adiciona o diretório raiz ao sys.path para importar 'app.scraping.spiders'
    if str(settings.BASE_DIR) not in sys.path:
        sys.path.append(str(settings.BASE_DIR))

    # Configura o settings do Scrapy
    settings_scrapy = get_project_settings()
    temp_file = settings.DATA_RAW_DIR / "temp_results.jsonl"
    settings_scrapy.set('FEEDS', {str(temp_file): {'format': 'jsonl', 'encoding': 'utf8'}})

    # 2. Executa o Crawler
    process = CrawlerProcess(settings_scrapy)
    # Importa as spiders dinamicamente
    from app.scraping.spiders.automaistv_spider import AutoMaisTVSpider
    from app.scraping.spiders.caranddriver_spider import CarAndDriverSpider
    from app.scraping.spiders.motor1_spider import Motor1Spider

    process.crawl(AutoMaisTVSpider, carro=carro)
    process.crawl(CarAndDriverSpider, carro=carro)
    process.crawl(Motor1Spider, carro=carro)
    process.start()  # Bloqueia até terminar

    # 3. Lê os resultados e limpa
    resultados = []
    if temp_file.exists():
        with open(temp_file, 'r', encoding='utf-8') as f:
            for linha in f:
                if linha.strip():
                    resultados.append(json.loads(linha))
        # Salva cópia permanente
        perm_file = settings.DATA_RAW_DIR / "scraping.json"
        with open(perm_file, 'w', encoding='utf-8') as f:
            json.dump(resultados, f, ensure_ascii=False, indent=4)
        temp_file.unlink()  # Remove temp

    return resultados

def buscar_dados_completos_veiculo(carro: str) -> dict:
    """
    Une os dados do Scrapy + YouTube em um único dicionário.
    Pode ser usado para popular o banco ou retornar para o usuário.
    """
    scraped_articles = executar_scrapy_para_carro(carro)
    youtube_data = get_youtube_transcripts(carro)

    # Concatena todo o conteúdo textual para análise ou armazenamento
    texto_completo = " ".join([a.get('conteudo', '') for a in scraped_articles])

    return {
        "carro": carro,
        "artigos": scraped_articles,
        "videos": youtube_data,
        "texto_bruto": texto_completo
    }
