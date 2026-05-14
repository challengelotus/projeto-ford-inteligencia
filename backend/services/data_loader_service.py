import json
from pathlib import Path
from typing import List, Dict, Optional


class DataLoaderService:
    """
    Carrega artigos a partir de arquivos JSON gerados pelo Scrapy na pasta data/raw.
    Normaliza os dados para um formato comum (titulo, conteudo, url, fonte).
    """

    def __init__(self, raw_data_path: str = "data/raw"):
        self.raw_data_path = Path(raw_data_path)

    def carregar_artigos(self) -> List[Dict[str, str]]:
        """
        Retorna lista de dicionários com as chaves: 'titulo', 'conteudo', 'url', 'fonte'.
        A 'fonte' é derivada do nome do arquivo (ex: 'results', 'youtube', 'site_oficial').
        """
        artigos = []
        if not self.raw_data_path.exists():
            print(
                f"Pasta {self.raw_data_path} não encontrada. Nenhum artigo carregado.")
            return artigos

        for arquivo in self.raw_data_path.glob("*.json"):
            fonte = arquivo.stem  # 'results', 'youtube', 'site_oficial'
            with open(arquivo, 'r', encoding='utf-8') as f:
                dados = json.load(f)

            # Se for lista, cada item é um artigo
            if isinstance(dados, list):
                for item in dados:
                    artigo = self._normalizar_item(item, fonte)
                    if artigo:
                        artigos.append(artigo)
            # Se for dicionário único (ex: site oficial)
            elif isinstance(dados, dict):
                artigo = self._normalizar_item(dados, fonte)
                if artigo:
                    artigos.append(artigo)
            else:
                print(
                    f"Formato inesperado no arquivo {arquivo.name}: {type(dados)}")
        return artigos

    def _normalizar_item(self, item: Dict, fonte: str) -> Optional[Dict[str, str]]:
        """
        Extrai título, conteúdo e url de um item. Ignora itens sem conteúdo.
        """
        titulo = item.get('titulo', '')
        conteudo = item.get('conteudo', '')
        url = item.get('url', '')
        if not conteudo:
            return None
        return {
            'titulo': titulo,
            'conteudo': conteudo,
            'url': url,
            'fonte': fonte
        }
