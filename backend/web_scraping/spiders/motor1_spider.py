import scrapy
import re

class Motor1Spider(scrapy.Spider):
  name = 'motor1'

  def __init__(self, carro='', *args, **kwargs):
    super(Motor1Spider, self).__init__(*args, **kwargs)
    self.termo = carro
    self.start_urls = [f"https://motor1.uol.com.br/search/?q={carro.replace(' ', '+')}"]

  def parse(self, response):
    # Seletor mais simples
    links = response.css('h2 a::attr(href)').getall()
    
    # Filtragem apra pegar links de notícias/artigos
    links_noticias = [l for l in links if '/news/' in l or '/reviews/' in l or '/features/' in l]

    for link in links_noticias[:2]:
      yield scrapy.Request(response.urljoin(link), callback=self.extrair_noticia)

  def extrair_noticia(self, response):
    titulo = response.css('h1::text').get() or response.xpath('//h1/text()').get()

    # Pegando caminho mapeado
    paragrafos = response.css('#article_box .postBody p ::text').getall()
    
    if not paragrafos:
      paragrafos = response.css('#article_box div.postBody ::text').getall()
        
    texto_limpo = re.sub(r'\s+', ' ', " ".join([p.strip() for p in paragrafos if p.strip()])).strip()

    if len(texto_limpo) > 100:
      yield {
        'url': response.url,
        # 'fonte': 'Motor1',
        # 'carro': self.termo,
        'titulo': titulo.strip() if titulo else "Motor1",
        'conteudo': texto_limpo
      }
