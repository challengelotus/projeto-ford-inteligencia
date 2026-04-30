# Chamada ao agente de IA (extração JSON)
import json
from typing import List, Dict
from ollama import chat
from ollama import ChatResponse

# Nome do modelo baixado no Ollama
model_name = 'gemma4:e2b'

# Exemplo de chamada ao modelo para extrair a especificação de um veículo
def extrair_especificacao(texto_cru: str, especificacoes: List[str]) -> Dict[str, str]:
    prompt = f"""
        Você é um especialista em fichas técnicas de veículos automotivos.
        Extraia do texto abaixo os seguintes atributos: {', '.join(especificacoes)}.

        Instruções:
        - Retorne APENAS um objeto JSON válido, sem texto adicional, sem explicações, sem formatação markdown.
        - Use exatamente as chaves solicitadas: {', '.join(especificacoes)}.
        - Se um atributo não for encontrado, use o valor "não disponível".
        - Não invente informações. Seja objetivo e preciso.

        Texto: {texto_cru}
    """

    try:
        response: ChatResponse = chat(model=model_name, messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ])
        conteudo = response['message']['content']
        try:
            extracao = json.loads(conteudo)
        except json.JSONDecodeError:
            print(f"Resposta do modelo não é um JSON válido: {conteudo}")
            return {}
        return extracao
    except Exception as e:
        print(f"Erro ao chamar o modelo: {e}")
        return {}


# Exemplo de uso
texto_teste = "O carro tem um motor V6, potência de 300 cavalos, câmbio automático e tração nas quatro rodas."
especificacoes_teste = ['motor', 'potência', 'câmbio', 'tração']
print("Extraindo especificações...")
resultado = extrair_especificacao(texto_teste, especificacoes_teste)
print(json.dumps(resultado, indent=2, ensure_ascii=False))
