import json
import os
from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings
from web_scraping.spiders.automaistv_spider import AutoMaisTVSpider
from web_scraping.spiders.caranddriver_spider import CarAndDriverSpider
from web_scraping.spiders.motor1_spider import Motor1Spider

def executar_busca(carro):
  settings = get_project_settings()
  settings.set('FEEDS', {'temp_results.jsonl': {'format': 'jsonl', 'encoding': 'utf8'}})
  
  process = CrawlerProcess(settings)
  process.crawl(AutoMaisTVSpider, carro=carro)
  process.crawl(CarAndDriverSpider, carro=carro)
  process.crawl(Motor1Spider, carro=carro)
  process.start()

  resultados = []
  if os.path.exists('temp_results.jsonl'):
    with open('temp_results.jsonl', 'r', encoding='utf-8') as f:
      for linha in f:
        resultados.append(json.loads(linha))
    
    with open('results.json', 'w', encoding='utf-8') as f:
      json.dump(resultados, f, ensure_ascii=False, indent=4)
    
    os.remove('temp_results.jsonl')
    print(f"Sucesso! {len(resultados)} itens salvos em results.json")

if __name__ == "__main__":
  executar_busca("Ford Ranger 2025")
