import unicodedata
import requests

class FipeService:
    BASE_URL = "https://brasilapi.com.br/api/fipe"

    @staticmethod
    def _normalizar(texto: str) -> str:
        """Remove acentos e deixa em minúsculas para facilitar a busca aproximada."""
        if not texto:
            return ""
        texto = unicodedata.normalize('NFKD', texto).encode('ASCII', 'ignore').decode('utf-8')
        return texto.lower().strip()

    @classmethod
    def buscar_preco_fipe(cls, marca: str, modelo: str, versao: str, ano: int) -> str | None: # 🔥 Adicionado 'versao'
        """
        Navega na BrasilAPI (Marcas -> Modelos -> Anos -> Preço).
        """
        try:
            # 1. Buscar ID da Marca (mantém igual)
            resp_marcas = requests.get(f"{cls.BASE_URL}/marcas/v1/carros", timeout=5)
            if resp_marcas.status_code != 200:
                return None

            marca_normalizada = cls._normalizar(marca)
            marca_id = next((m['valor'] for m in resp_marcas.json() if cls._normalizar(m['nome']) == marca_normalizada), None)

            if not marca_id:
                return None

            # 2. Buscar ID do Modelo (🔥 Busca blindada combinando modelo + versao)
            resp_modelos = requests.get(f"{cls.BASE_URL}/modelos/v1/{marca_id}", timeout=5)
            if resp_modelos.status_code != 200:
                return None

            termo_busca = cls._normalizar(f"{modelo} {versao}") # Ex: "corolla gli"
            modelo_id = None

            for m in resp_modelos.json().get('modelos', []):
                # Procura a versão específica dentro do nome da FIPE (ex: "Corolla GLi 1.8 Flex 16V Aut.")
                if termo_busca in cls._normalizar(m['nome']):
                    modelo_id = m['codigo']
                    break

            if not modelo_id:
                return None

            # 3. Buscar Preço pelo Ano do Modelo
            resp_preco = requests.get(f"{cls.BASE_URL}/preco/v1/{modelo_id}", timeout=5)
            if resp_preco.status_code != 200:
                return None

            for cotacao in resp_preco.json():
                if str(ano) in str(cotacao.get('anoModelo', '')):
                    return cotacao.get('valor')

            return None

        except Exception as e:
            print(f"⚠️ Erro ao consultar FIPE na BrasilAPI: {e}")
            return None
