import json
from pathlib import Path
from typing import Dict, List, Optional

# Tenta importar as configurações globais do projeto.
# Se falhar (ex: rodando o arquivo isoladamente), usa um caminho relativo padrão.
try:
    from app.core.config import settings

    DEFAULT_RAW_DIR = Path(settings.DATA_RAW_DIR)
except ImportError:
    # Fallback: backend/app/services -> backend/data/raw
    base_dir = Path(__file__).resolve().parent.parent.parent
    DEFAULT_RAW_DIR = base_dir / "data" / "raw"


class DataLoaderService:
    """
    Serviço responsável por ler os arquivos JSON gerados pelo Scrapy e prepará-los
    para o processamento da Inteligência Artificial.
    """

    def __init__(self, raw_data_path: Optional[Path] = None):
        self.raw_data_path = raw_data_path or DEFAULT_RAW_DIR

    def carregar_artigos(self) -> List[Dict[str, str]]:
        """
        Lê todos os arquivos JSON do diretório raw e retorna uma lista unificada de artigos.
        """
        artigos = []
        if not self.raw_data_path.exists():
            print(f"⚠️ Diretório {self.raw_data_path} não encontrado.")
            return artigos

        for arquivo in self.raw_data_path.glob("*.json"):
            fonte = arquivo.stem  # Nome do arquivo sem extensão servirá como 'fonte'

            try:
                with open(arquivo, "r", encoding="utf-8") as f:
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
            except json.JSONDecodeError:
                print(f"❌ Erro ao decodificar JSON no arquivo: {arquivo.name}")
            except Exception as e:
                print(f"❌ Erro inesperado ao ler {arquivo.name}: {e}")

        return artigos

    def _normalizar_item(self, item: Dict, fonte: str) -> Optional[Dict[str, str]]:
        """Garante que apenas artigos com conteúdo válido sejam processados."""
        titulo = item.get("titulo", "").strip()
        conteudo = item.get("conteudo", "").strip()
        url = item.get("url", "").strip()

        if not conteudo:
            return None

        return {
            "titulo": titulo,
            "conteudo": conteudo,
            "url": url,
            "fonte": fonte,
        }


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    print("--- Testando DataLoaderService ---")
    servico = DataLoaderService()
    print(f"Buscando dados em: {servico.raw_data_path}")

    artigos_carregados = servico.carregar_artigos()

    if artigos_carregados:
        print(f"✅ Sucesso! {len(artigos_carregados)} artigos carregados.")
        print("Prévia do primeiro artigo:")
        print(f" - Fonte: {artigos_carregados[0]['fonte']}")
        print(f" - Título: {artigos_carregados[0]['titulo']}")
        print(
            f" - Tamanho do conteúdo: {len(artigos_carregados[0]['conteudo'])} caracteres",
        )
    else:
        print(
            "⚠️ Nenhum artigo encontrado. Verifique se os arquivos JSON estão na pasta correta.",
        )
