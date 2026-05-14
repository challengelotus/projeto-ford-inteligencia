import scrapy
import re

class AutoMaisTVSpider(scrapy.Spider):
  name = 'automaistv'

  def __init__(self, carro='', *args, **kwargs):
    super(AutoMaisTVSpider, self).__init__(*args, **kwargs)
    self.termo = carro
    self.start_urls = [f"https://www.automaistv.com.br/?s={carro.replace(' ', '+')}"]

  def parse(self, response):
    # Captura os links dos resultados da busca
    links = response.css('h2.gb-headline a::attr(href)').getall()
    
    # Fazer busca por um seletor mais simples
    if not links:
      links = response.css('article h2 a::attr(href)').getall()

    for link in links[:2]:
      yield scrapy.Request(response.urljoin(link), callback=self.extrair_dados)

  def extrair_dados(self, response):
    titulo = response.css('h1::text').get()
    
    # Conteúdo das notícias, sem comentários de users
    paragrafos = response.css('.entry-content p ::text, .entry-content div ::text').getall()
    
    # Pegar informações mais amplas, caso não funcione
    if not paragrafos:
      paragrafos = response.css('article .gb-container p ::text').getall()

    texto_bruto = " ".join([p.strip() for p in paragrafos if p.strip()])
    
    # Removendo espaços e quebras de linha
    texto_limpo = re.sub(r'\s+', ' ', texto_bruto).strip()

    if len(texto_limpo) > 100:
      yield {
        'url': response.url,
        # 'fonte': 'Auto+ TV',
        # 'carro': self.termo,
        'titulo': titulo.strip() if titulo else "Auto+ Notícia",
        'conteudo': texto_limpo
      }