# Chamada ao agente de IA (extração JSON)
from ollama import chat
from ollama import ChatResponse

# Nome do modelo baixado no Ollama
model_name = 'gemma4:e2b'

# Exemplo de chamada ao modelo para extrair a especificação de um veículo
def chamada_llm():
    response: ChatResponse = chat(model=model_name, messages=[
        {
            'role': 'user',
            'content': 'Explain in three 10 words, why is the sky blue?',
        },
    ])

    return response['message']['content']


print(chamada_llm())

