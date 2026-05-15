import json
from pathlib import Path
from typing import List, Dict, Optional

class DataLoaderService:
    """
    Carrega artigos a partir da pasta backend/data/raw/
    O caminho é relativo ao local deste arquivo (backend/services/ -> backend/data/raw)
    """

    def __init__(self, raw_data_path: Optional[str] = None):
        if raw_data_path is None:
            base_dir = Path(__file__).resolve().parent.parent
            self.raw_data_path = base_dir / "data" / "raw"
        else:
            self.raw_data_path = Path(raw_data_path)

    def carregar_artigos(self) -> List[Dict[str, str]]:
        artigos = []
        if not self.raw_data_path.exists():
            print(f"Pasta {self.raw_data_path} não encontrada. Nenhum artigo carregado.")
            return artigos

        for arquivo in self.raw_data_path.glob("*.json"):
            fonte = arquivo.stem  # 'results', 'youtube', 'site_oficial'
            with open(arquivo, 'r', encoding='utf-8') as f:
                dados = json.load(f)

            if isinstance(dados, list):
                for item in dados:
                    artigo = self._normalizar_item(item, fonte)
                    if artigo:
                        artigos.append(artigo)
            elif isinstance(dados, dict):
                artigo = self._normalizar_item(dados, fonte)
                if artigo:
                    artigos.append(artigo)
            else:
                print(f"Formato inesperado no arquivo {arquivo.name}: {type(dados)}")
        return artigos

    def _normalizar_item(self, item: Dict, fonte: str) -> Optional[Dict[str, str]]:
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