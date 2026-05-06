import json
from typing import List, Dict
from ollama import chat, ChatResponse

# Configurações globais
MODEL_NAME = 'gemma4:e2b'
ESPECIFICACOES = ['motor', 'potência', 'câmbio', 'tração']


def extrair_especificacao(texto_cru: str, atributos: List[str]) -> Dict[str, str]:
    """
    Chama o modelo de IA para extrair dados técnicos em formato JSON.
    """
    prompt = f"""
        Você é um especialista em fichas técnicas de veículos automotivos.
        Extraia do texto abaixo os seguintes atributos: {', '.join(atributos)}.

        Instruções:
        - Retorne APENAS um objeto JSON válido, sem texto adicional ou explicações.
        - Use exatamente as chaves solicitadas: {', '.join(atributos)}.
        - Se um atributo não for encontrado, use o valor "não disponível".
        - Não invente informações. Seja objetivo e preciso.

        Texto: {texto_cru}
    """

    try:
        response: ChatResponse = chat(
            model=MODEL_NAME,
            messages=[{'role': 'user', 'content': prompt}]
        )
        
        conteudo = response['message']['content']
        
        try:
            return json.loads(conteudo)
        except json.JSONDecodeError:
            print(f"Erro: Resposta não é um JSON válido: {conteudo}")
            return {}

    except Exception as e:
        print(f"Erro ao chamar o modelo: {e}")
        return {}


def processar_artigos(artigos: List[Dict[str, str]], atributos: List[str]) -> List[Dict[str, str]]:
    """
    Itera sobre uma lista de artigos e extrai as especificações de cada um.
    """
    resultados = []
    for artigo in artigos:
        print(f"Processando artigo: {artigo['titulo']}")
        resultado = extrair_especificacao(artigo['conteudo'], atributos)
        resultados.append(resultado)
    return resultados


def combinar_por_votacao(resultados: List[Dict[str, str]], atributos: List[str]) -> Dict[str, str]:
    """
    Consolida múltiplos resultados escolhendo o valor mais frequente para cada campo.
    """
    resultado_final = {}
    
    for atributo in atributos:
        votos = {}
        for res in resultados:
            valor = res.get(atributo, "não disponível")
            if valor != "não disponível":
                votos[valor] = votos.get(valor, 0) + 1
        
        if votos:
            # Seleciona o valor com maior contagem
            valor_mais_votado = max(votos, key=votos.get)
            resultado_final[atributo] = valor_mais_votado
        else:
            resultado_final[atributo] = "não disponível"
            
    return resultado_final


# --- Execução do Script ---

if __name__ == "__main__":
    artigos_simulados = [
        {
            "url": "https://exemplo.com/artigo1",
            "titulo": "Ford Ranger Raptor 2025: primeiras impressões",
            "conteudo": "A nova Ranger Raptor vem com motor V6 3.0 biturbo de 397 cavalos, câmbio automático de 10 marchas e tração 4x4 com reduzida."
        },
        {
            "url": "https://exemplo.com/artigo2",
            "titulo": "Especificações técnicas da Ranger Raptor",
            "conteudo": "Motor 3.0 V6, potência 397 cv, transmissão automática de 10 velocidades, tração nas quatro rodas."
        },
        {
            "url": "https://exemplo.com/artigo3",
            "titulo": "Review: Ford Ranger Raptor 2025",
            "conteudo": "O motor é um V6 3.0 biturbo com 397 cv de potência. Câmbio automático de 10 marchas. Tração integral."
        }
    ]

    print("\n=== Processando artigos um por um ===")
    extracoes = processar_artigos(artigos_simulados, ESPECIFICACOES)

    print("\n=== Extrações individuais ===")
    for i, extr in enumerate(extracoes):
        print(f"Artigo {i+1}: {extr}")

    print("\n=== Resultado combinado (votação) ===")
    final = combinar_por_votacao(extracoes, ESPECIFICACOES)
    print(json.dumps(final, indent=2, ensure_ascii=False))