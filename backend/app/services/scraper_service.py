import json
import os
import sys
from pathlib import Path

FILE_PATH = Path(__file__).resolve()
BACKEND_DIR = FILE_PATH.parent.parent.parent

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

os.environ["SCRAPY_SETTINGS_MODULE"] = "app.scraping.settings"

from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings


def get_blog_scrapy(carro: str) -> list[dict]:
    """
    Executa apenas o scraping nas 3 fontes (AutoMaisTV, CarAndDriver, Motor1).
    Salva os resultados em data/raw/scraping.json e retorna a lista de dados.
    """
    settings_scrapy = get_project_settings()

    data_raw_dir = BACKEND_DIR / "data" / "raw"
    data_raw_dir.mkdir(parents=True, exist_ok=True)

    temp_file = data_raw_dir / "temp_results.jsonl"
    settings_scrapy.set(
        "FEEDS",
        {str(temp_file): {"format": "jsonl", "encoding": "utf8"}},
    )

    process = CrawlerProcess(settings_scrapy)

    from app.scraping.spiders.automaistv_spider import AutoMaisTVSpider
    from app.scraping.spiders.caranddriver_spider import CarAndDriverSpider
    from app.scraping.spiders.motor1_spider import Motor1Spider

    process.crawl(AutoMaisTVSpider, carro=carro)
    process.crawl(CarAndDriverSpider, carro=carro)
    process.crawl(Motor1Spider, carro=carro)

    print(f"Iniciando scraping para o modelo: {carro}...")
    process.start()

    resultados = []
    if temp_file.exists():
        with open(temp_file, "r", encoding="utf-8") as f:
            for linha in f:
                if linha.strip():
                    resultados.append(json.loads(linha))

        perm_file = data_raw_dir / "scraping.json"
        with open(perm_file, "w", encoding="utf-8") as f:
            json.dump(resultados, f, ensure_ascii=False, indent=4)

        temp_file.unlink()  # Remove o temporário
        print(f"Sucesso! {len(resultados)} itens coletados e salvos em {perm_file}")
    else:
        print("Aviso: Nenhum dado foi retornado pelas spiders.")

    return resultados


if __name__ == "__main__":
    get_blog_scrapy("Ford Ranger 2025")
