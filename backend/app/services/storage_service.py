import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

try:
    # Tenta usar o diretório base das configurações, se existir
    from app.core.config import settings

    # Presumindo que settings tenha um DATA_PROCESSED_DIR, senão fazemos fallback
    DEFAULT_PROCESSED_DIR = Path(
        getattr(
            settings,
            "DATA_PROCESSED_DIR",
            Path(__file__).resolve().parent.parent.parent / "data" / "processed",
        ),
    )
except ImportError:
    base_dir = Path(__file__).resolve().parent.parent.parent
    DEFAULT_PROCESSED_DIR = base_dir / "data" / "processed"


class StorageService:
    """
    Serviço responsável por salvar o resultado final processado pela IA
    em arquivos JSON para histórico, auditoria e fallback.
    """

    def __init__(self, processed_dir: Optional[Path] = None):
        self.processed_dir = processed_dir or DEFAULT_PROCESSED_DIR
        # Garante que a pasta exista antes de tentar salvar
        self.processed_dir.mkdir(parents=True, exist_ok=True)

    def salvar_resultado(
        self,
        resultado: Dict[str, str],
        marca: str,
        modelo: str,
        versao: str,
        ano: int,
    ) -> Path:
        """
        Salva o dicionário de especificações em um arquivo JSON com nome padronizado.
        """
        nome_base = f"{marca}_{modelo}_{versao}_{ano}".replace(" ", "_").lower()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        nome_arquivo = f"{nome_base}_{timestamp}.json"

        caminho = self.processed_dir / nome_arquivo

        with open(caminho, "w", encoding="utf-8") as f:
            json.dump(resultado, f, indent=2, ensure_ascii=False)

        return caminho


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    print("--- Testando StorageService ---")
    servico = StorageService()

    resultado_mock = {
        "motor": "3.0 V6 Bi-turbo",
        "potencia": "397 cv",
        "transmissao": "Automática de 10 marchas",
    }

    try:
        caminho_salvo = servico.salvar_resultado(
            resultado=resultado_mock,
            marca="Ford",
            modelo="Ranger",
            versao="Raptor",
            ano=2025,
        )
        print(f"✅ Sucesso! Arquivo salvo em: {caminho_salvo}")

        # Lê o arquivo para confirmar se foi salvo corretamente
        with open(caminho_salvo, "r", encoding="utf-8") as f:
            dados_salvos = json.load(f)
            print("Conteúdo salvo:")
            print(json.dumps(dados_salvos, indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"❌ Erro ao salvar o arquivo: {e}")
