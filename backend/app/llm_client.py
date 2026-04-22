# Chamada ao agente de IA (extração JSON)
from ollama import chat
from ollama import ChatResponse

# Nome do modelo baixado no Ollama
model_name = 'gemma4:e2b'

# Exemplo de chamada ao modelo para extrair a especificação de um veículo
def chamada_llm():
    prompt = "Explique em 20 palavras, por que o céu é azul?"

    try:
        response: ChatResponse = chat(model=model_name, messages=[
            {
                'role': 'user',
                'content': prompt,
            },
        ])
    except Exception as e:
        print(f"Erro ao chamar o modelo: {e}")
        return None

    return response['message']['content']


print(chamada_llm())

