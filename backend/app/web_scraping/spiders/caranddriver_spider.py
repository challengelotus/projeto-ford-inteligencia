import scrapy
import re

class CarAndDriverSpider(scrapy.Spider):
  name = 'caranddriver'

  def __init__(self, carro='', *args, **kwargs):
    super(CarAndDriverSpider, self).__init__(*args, **kwargs)
    self.termo = carro
    self.start_urls = [f"https://www.caranddriver.com/search/?q={carro.replace(' ', '+')}"]

  def parse(self, response):
    # # Captura os links dos resultados da busca
    links = response.css('#main-content section a::attr(href)').getall()
    
    for link in links[:2]:
      url_completa = response.urljoin(link)
      # Filtro para pegar apenas notícias
      if any(x in url_completa for x in ['/news/', '/reviews/', '/features/']):
        yield scrapy.Request(url_completa, callback=self.extrair_dados)

  def extrair_dados(self, response):
    titulo = response.css('h1::text').get()

    # Fazendo busca em seletor específico
    conteudo_principal = response.css('div.review-body-content, div.article-body-content, .css-1vpv2k4')
    
    # Pega todos os parágrafos dentro desses containers
    paragrafos = conteudo_principal.css('p ::text').getall()

    # Caso o seletor específico falhe, pega o conteúdo de <article>
    if not paragrafos:
      paragrafos = response.css('article p ::text').getall()

    texto_bruto = " ".join([p.strip() for p in paragrafos if p.strip()])
    texto_limpo = re.sub(r'\s+', ' ', texto_bruto).strip()

    if len(texto_limpo) > 100:
      yield {
        'url': response.url,
        # 'fonte': 'Car and Driver',
        # 'carro': self.termo,
        'titulo': titulo.strip() if titulo else "C&D Review",
        'conteudo': texto_limpo
      }