# Chamada ao agente de IA (extração JSON)
from ollama import chat
from ollama import ChatResponse

# Nome do modelo baixado no Ollama
model_name = 'gemma4:e2b'

# Faz a chamada ao modelo com uma pergunta simples
response: ChatResponse = chat(model=model_name, messages=[
    {
        'role': 'user',
        'content': 'Explain in three 10 words, why is the sky blue?',
    },
])

# Exibe a resposta de duas formas diferentes
print(response['message']['content'])
print(response.message.content)