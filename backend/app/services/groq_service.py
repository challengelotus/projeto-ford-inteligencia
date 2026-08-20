# app/services/groq_service.py
import httpx
from groq import Groq

# Importa as configurações centralizadas
from app.core.config import settings

# Validação da chave API
if not settings.GROQ_API_KEY:
    raise ValueError(
        "❌ GROQ_API_KEY não configurada no arquivo .env.\n"
        "Crie um arquivo .env na raiz do projeto com: GROQ_API_KEY=sua_chave_aqui",
    )

# Mantém a correção de SSL caso esteja em rede restrita (laboratório)
http_client = httpx.Client(verify=False)

# Cria o cliente Groq com a chave do settings e o cliente HTTP customizado
client = Groq(
    api_key=settings.GROQ_API_KEY,
    http_client=http_client,
)


def gerar_ficha_tecnica(marca, modelo, versao):
    """
    Gera uma ficha técnica completa para um veículo usando a IA Groq.
    Retorna um JSON com as especificações.
    """
    prompt = f"""Você é um especialista em fichas técnicas automotivas.
                Retorne SOMENTE um objeto JSON válido, sem markdown, sem código, sem explicações extras.

                Schema obrigatório (use exatamente essas chaves):
                {{
                "marca": "",
                "modelo": "",
                "versao": "",
                "motor": "",
                "potencia": "",
                "torque": "",
                "cambio": "",
                "tracao": "",
                "comprimento": "",
                "largura": "",
                "altura": "",
                "capacidade_tanque": "",
                "peso": ""
                }}

                Regras:
                - Preencha com dados reais do veículo informado
                - Campos desconhecidos: use exatamente "Não disponível"
                - NÃO adicione campos extras
                - NÃO use markdown, blocos de código ou texto antes/depois do JSON

                Veículo: {marca} {modelo} {versao}
            """

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            model="openai/gpt-oss-20b",
            temperature=0.1,  # Baixa para respostas precisas e estruturadas
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        # Você pode logar o erro com o logger do projeto
        return f"Ocorreu um erro: {e}"


if __name__ == "__main__":
    # Teste rápido
    marca_carro = "Ford"
    modelo_carro = "Mustang"
    versao_carro = "GT Performance"

    print(
        f"Buscando ficha técnica para: {marca_carro} {modelo_carro} {versao_carro}...\n",
    )
    resposta_json = gerar_ficha_tecnica(marca_carro, modelo_carro, versao_carro)
    print("Resposta recebida:")
    print(resposta_json)
