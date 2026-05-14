import json
from services.data_loader_service import DataLoaderService
from services.llm_service import LLMService
from services.consensus_service import ConsensusService

if __name__ == "__main__":
    atributos = {
        "marca": "", "modelo": "", "versao": "",
        "motor": "", "potencia": "", "torque": "",
        "cambio": "", "tracao": "",
        "comprimento": "", "largura": "", "altura": "",
        "capacidade_tanque": "", "peso": ""
    }
    marca, modelo, versao = "Ford", "Ranger", "Raptor 2025"

    # 1. Carregar artigos da pasta data/raw
    loader = DataLoaderService()
    artigos = loader.carregar_artigos()
    print(f"Artigos carregados: {len(artigos)}")
    if not artigos:
        print("Nenhum artigo encontrado. Execute o Scrapy para gerar JSONs em data/raw/")
        exit(1)

    # 2. Processar com LLM
    llm = LLMService()
    resultados = llm.processar_artigos(
        artigos, atributos, marca, modelo, versao)

    # 3. Definir pesos por fonte
    pesos = {
        'site_oficial': 2.0,   # Maior confiança
        'results': 1.0,        # Portais automotivos
        'youtube': 0.5,        # Menor confiança
        'desconhecido': 0.5
    }
    final = ConsensusService.combinar_por_votacao(resultados, atributos, pesos)

    print("\n=== Resultado final ===")
    print(json.dumps(final, indent=2, ensure_ascii=False))
