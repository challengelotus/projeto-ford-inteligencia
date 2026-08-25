# app/services/groq_service.py (versão atualizada)
import json
import re
from typing import Dict, List

import httpx
from groq import Groq

from app.core.config import settings

# Validação da chave
if not settings.GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY não configurada no .env")

http_client = httpx.Client(verify=False)
client = Groq(api_key=settings.GROQ_API_KEY, http_client=http_client)


def extrair_especificacoes_do_texto(
    texto_cru: str,
    atributos: Dict[str, str],
    marca: str,
    modelo: str,
    versao: str,
    ano: int,
) -> Dict[str, str]:
    """
    Extrai atributos de um único texto (artigo) usando Groq.
    Retorna dicionário com os atributos preenchidos.
    """
    texto_limitado = texto_cru[:4000]
    exemplo_chaves = ", ".join(f'"{k}": "{v}"' for k, v in atributos.items())

    prompt = f"""
Você é um especialista em fichas técnicas de veículos automotivos.
Retorne SOMENTE um JSON válido, sem markdown, sem explicações, sem texto adicional.

Formato OBRIGATÓRIO (as chaves devem ser exatamente estas):
{{
    {exemplo_chaves}
}}

Regras:
- Preencha com dados reais do veículo extraídos do texto.
- Se um atributo não for encontrado, use "não disponível".
- NUNCA adicione campos extras.
- NUNCA use markdown.
- Use APENAS unidades do sistema métrico internacional (kg, metros, cv, Nm ou kgfm).
- Para torque: prefira Nm ou kgfm (1 kgfm = 9,80665 Nm).
- Para peso: use quilogramas (kg). Se o texto informar libras (pounds), converta: 1 lb = 0,4536 kg.
- Para comprimentos: use metros (m) ou milímetros (mm).
- Para potência: mantenha cv (cavalos) ou kW (converta se necessário).
- Nunca retorne unidades como "pound-feet", "pounds", "GVW", "GVWR".
- Se um valor estiver em unidades estranhas e você não souber converter, escreva "não disponível".

Veículo: {marca} {modelo} {versao} {ano}

Texto para extração:
\"\"\"{texto_limitado}\"\"\"
"""

    try:
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-20b",
            temperature=0.1,
        )
        conteudo = chat_completion.choices[0].message.content.strip()

        # Tenta interpretar a resposta como JSON
        try:
            resultado = json.loads(conteudo)
        except json.JSONDecodeError:
            json_match = re.search(r"\{.*\}", conteudo, re.DOTALL)
            if json_match:
                resultado = json.loads(json_match.group())
            else:
                print(f"Erro: resposta não contém JSON válido: {conteudo[:200]}")
                return {attr: "não disponível" for attr in atributos}

        # Garante que todas as chaves existem
        for attr in atributos:
            if attr not in resultado:
                resultado[attr] = "não disponível"
        return resultado

    except Exception as e:
        print(f"Erro ao chamar o modelo: {e}")
        return {attr: "não disponível" for attr in atributos}


def processar_artigos_para_especificacoes(
    artigos: List[Dict[str, str]],
    atributos: Dict[str, str],
    marca: str,
    modelo: str,
    versao: str,
    ano: int,
) -> List[Dict[str, str]]:
    """
    Processa uma lista de artigos (cada um com 'titulo', 'conteudo', 'url', 'fonte').
    Retorna uma lista de dicionários com os atributos extraídos + a fonte original.
    """
    resultados = []
    for idx, artigo in enumerate(artigos):
        titulo = artigo.get("titulo", "")
        conteudo = artigo.get("conteudo", "")
        fonte = artigo.get("fonte", "desconhecido")
        url = artigo.get("url", f"artigo_{idx + 1}")

        if not conteudo.strip():
            print(f"Pular artigo sem conteúdo: {url}")
            continue

        texto = f"{titulo}\n{conteudo}" if titulo else conteudo
        print(f"Processando: {url} (fonte={fonte})")
        resultado = extrair_especificacoes_do_texto(
            texto,
            atributos,
            marca,
            modelo,
            versao,
            ano,
        )
        resultado["fonte"] = fonte
        resultados.append(resultado)
    return resultados


# Função legada (mantida para compatibilidade)
def gerar_ficha_tecnica(marca, modelo, versao):
    """Versão simplificada (mantida para não quebrar usos antigos)."""
    atributos = {
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
        "peso": "",
    }
    resultado = extrair_especificacoes_do_texto(
        f"{marca} {modelo} {versao}",
        atributos,
        marca,
        modelo,
        versao,
        2025,
    )
    return json.dumps(resultado, ensure_ascii=False)


if __name__ == "__main__":
    # Teste rápido
    atributos_exemplo = {
        "motor": "",
        "potencia": "",
        "torque": "",
        "cambio": "",
        "tracao": "",
        "comprimento": "",
        "largura": "",
        "altura": "",
        "capacidade_tanque": "",
        "peso": "",
    }
    texto_teste = (
        "A Ford Ranger Raptor 2025 tem motor 2.0 biturbo de 250 cv e 38 kgfm de torque."
    )
    resultado = extrair_especificacoes_do_texto(
        texto_teste,
        atributos_exemplo,
        "Ford",
        "Ranger",
        "Raptor",
        2025,
    )
    print(resultado)
