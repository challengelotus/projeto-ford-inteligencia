import json
from pathlib import Path
from datetime import datetime
from typing import Dict

class StorageService:
    def __init__(self, processed_dir: str = "data/processed"):
        base_dir = Path(__file__).resolve().parent.parent
        self.processed_dir = base_dir / processed_dir
        self.processed_dir.mkdir(parents=True, exist_ok=True)

    def salvar_resultado(self, resultado: Dict[str, str], marca: str, modelo: str, versao: str, ano: str = "") -> Path:
        nome_base = f"{marca}_{modelo}_{versao}".replace(" ", "_").lower()
        if ano:
            nome_base += f"_{ano}"
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        nome_arquivo = f"{nome_base}_{timestamp}.json"
        caminho = self.processed_dir / nome_arquivo

        with open(caminho, "w", encoding="utf-8") as f:
            json.dump(resultado, f, indent=2, ensure_ascii=False)

        print(f"Resultado salvo: {caminho}")
        return caminho
        