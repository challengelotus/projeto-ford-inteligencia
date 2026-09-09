# app/services/storage_service.py
import json
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional

try:
    from app.core.config import settings

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
    em arquivos JSON para histórico, auditoria e fallback, filtrando dados inválidos.
    """

    def __init__(self, processed_dir: Optional[Path] = None):
        self.processed_dir = processed_dir or DEFAULT_PROCESSED_DIR
        self.processed_dir.mkdir(parents=True, exist_ok=True)

    def salvar_resultado(
        self,
        resultado: Dict[str, str],
        marca: str,
        modelo: str,
        versao: str,
        ano: int,
        limite_falha_percentual: float = 0.7,
    ) -> Optional[Path]:
        """
        Salva o dicionário de especificações em um arquivo JSON com nome padronizado,
        desde que a extração possua qualidade mínima (evita salvar lixo se a IA falhar).
        """
        if not resultado:
            print("⚠️ [StorageService] Resultado vazio. Ignorando salvamento.")
            return None

        total_campos = len(resultado)
        if total_campos == 0:
            return None

        # Conta quantos campos vieram vazios, indisponíveis ou genéricos de erro
        termos_invalidos = ["não disponível", "nao disponivel", "", "verificar fontes"]
        indisponiveis = sum(
            1 for v in resultado.values() if str(v).strip().lower() in termos_invalidos
        )

        taxa_falha = indisponiveis / total_campos

        # Se a taxa de falha for maior ou igual a 70%, aborta a gravação em disco
        if taxa_falha >= limite_falha_percentual:
            print(
                f"⚠️ [StorageService] Descartando salvamento: {taxa_falha * 100:.1f}% "
                f"dos campos estão indisponíveis para {marca} {modelo} {versao} {ano}.",
            )
            return None

        nome_base = f"{marca}_{modelo}_{versao}_{ano}".replace(" ", "_").lower()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        nome_arquivo = f"{nome_base}_{timestamp}.json"

        caminho = self.processed_dir / nome_arquivo

        with open(caminho, "w", encoding="utf-8") as f:
            json.dump(resultado, f, indent=2, ensure_ascii=False)

        print(f"✅ [StorageService] Backup válido salvo em: {caminho}")
        return caminho


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    print("--- Testando StorageService com Filtro de Qualidade ---")
    servico = StorageService()

    # 1. Teste com dados ruins (mais de 70% indisponíveis)
    resultado_lixo = {
        "motor": "não disponível",
        "potencia": "não disponível",
        "torque": "não disponível",
        "cambio": "não disponível",
        "tracao": "não disponível",
        "suspensao": "não disponível",
        "freios": "não disponível",
        "rodas_pneus": "não disponível",
        "farois": "não disponível",
        "modos_conducao": "não disponível",
        "preco": "R$ 100.000",
    }

    # 2. Teste com dados bons
    resultado_bom = {
        "motor": "3.0 V6 Bi-turbo",
        "potencia": "397 cv",
        "torque": "600 Nm",
        "cambio": "automática de 10 marchas",
        "tracao": "4x4",
        "suspensao": "Fox",
        "freios": "disco ventilado",
        "rodas_pneus": "aro 17",
        "farois": "LED",
        "modos_conducao": "7 modos",
        "preco": "R$ 469.700",
    }

    print("\n[Teste 1] Tentando salvar resultado com alta taxa de falha:")
    caminho_1 = servico.salvar_resultado(resultado_lixo, "Ford", "Teste", "Ruim", 2026)
    assert caminho_1 is None, "Deveria ter bloqueado o salvamento do lixo!"
    print("-> Teste 1 passou com sucesso (bloqueado corretamente).")

    print("\n[Teste 2] Tentando salvar resultado com dados consistentes:")
    caminho_2 = servico.salvar_resultado(
        resultado_bom,
        "Ford",
        "Ranger",
        "Raptor",
        2025,
    )
    assert caminho_2 is not None, "Deveria ter salvo o arquivo com sucesso!"
    print(f"-> Teste 2 passou com sucesso. Arquivo em: {caminho_2}")
