import json
import os
import re
from typing import Dict, List, Optional

# Import da biblioteca oficial do Groq
from groq import Groq

# Tentativa de carregar a chave de API das configurações globais
try:
    from app.core.config import settings

    GROQ_API_KEY = getattr(settings, "GROQ_API_KEY", os.environ.get("GROQ_API_KEY"))
except ImportError:
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY")


class GroqService:
    """
    Serviço para interagir com modelos de linguagem através da API da Groq.
    Responsável por extrair especificações técnicas de textos brutos, garantindo
    o retorno em um formato JSON rigoroso.
    """

    def __init__(
        self,
        model_name: str = "openai/gpt-oss-20b",
        temperature: float = 0.1,
        timeout: float = 30.0,
    ):
        self.model_name = model_name
        self.temperature = temperature
        self.timeout = timeout

        if not GROQ_API_KEY or GROQ_API_KEY == "SUA_CHAVE_AQUI":
            print("⚠️ AVISO: GROQ_API_KEY não configurada. A extração real falhará.")

        self.client = Groq(
            api_key=GROQ_API_KEY,
            timeout=self.timeout,
        )

    def extrair_especificacao(
        self,
        texto_cru: str,
        atributos: Dict[str, str],
        marca: str,
        modelo: str,
        versao: str,
        ano: int,
    ) -> Dict[str, str]:
        """
        Extrai atributos técnicos de um único texto utilizando a IA.
        """
        prompt = self._construir_prompt(
            texto_cru,
            atributos,
            marca,
            modelo,
            versao,
            ano,
        )

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
            )

            conteudo = response.choices[0].message.content.strip()

            # Tenta interpretar a resposta como JSON diretamente
            try:
                resultado = json.loads(conteudo)
            except json.JSONDecodeError:
                # Fallback: Tenta localizar o bloco JSON usando Regex
                json_match = re.search(r"\{.*\}", conteudo, re.DOTALL)
                if json_match:
                    resultado = json.loads(json_match.group())
                else:
                    print(
                        f"❌ Erro: resposta da IA não contém JSON válido: {conteudo[:200]}",
                    )
                    return {attr: "não disponível" for attr in atributos}

            # Validação estrita: garante que todas as chaves solicitadas existam
            for attr in atributos:
                if attr not in resultado:
                    resultado[attr] = "não disponível"

            return resultado

        except Exception as e:
            print(f"❌ Erro ao chamar a API da Groq: {e}")
            return {attr: "não disponível" for attr in atributos}

    def processar_artigos(
        self,
        artigos: List[Dict[str, str]],
        atributos: Dict[str, str],
        marca: str,
        modelo: str,
        versao: str,
        ano: int,
    ) -> List[Dict[str, str]]:
        """
        Processa uma lista de artigos e retorna os atributos extraídos de cada um,
        preservando a fonte original.
        """
        resultados = []
        for idx, artigo in enumerate(artigos):
            titulo = artigo.get("titulo", "")
            conteudo = artigo.get("conteudo", "")
            fonte = artigo.get("fonte", "desconhecido")
            url = artigo.get("url", f"artigo_{idx + 1}")

            if not conteudo.strip():
                print(f"⚠️ Ignorando artigo sem conteúdo: {url}")
                continue

            texto_completo = f"{titulo}\n{conteudo}" if titulo else conteudo
            print(f"🧠 Extraindo dados com IA: {url} (fonte={fonte})")

            resultado = self.extrair_especificacao(
                texto_completo,
                atributos,
                marca,
                modelo,
                versao,
                ano,
            )
            resultado["fonte"] = fonte
            resultados.append(resultado)

        return resultados

    def _construir_prompt(
        self,
        texto_cru: str,
        atributos: Dict[str, str],
        marca: str,
        modelo: str,
        versao: str,
        ano: int,
    ) -> str:
        """
        Constrói o prompt blindado com regras rígidas de formatação e métricas.
        """
        texto_limitado = texto_cru[:4000]
        exemplo_chaves = ", ".join(f'"{k}": "{v}"' for k, v in atributos.items())

        return f"""
            Você é um especialista em fichas técnicas de veículos automotivos.
            Retorne SOMENTE um JSON válido, sem markdown, sem explicações, sem texto adicional.

            Formato OBRIGATÓRIO (as chaves devem ser exatamente estas):
            {{
                {exemplo_chaves}
            }}

            Regras:
            - Preencha com dados reais do veículo extraídos do texto.
            - Se um atributo não for encontrado, use "não disponível".
            - NUNCA adicione campos extras ou use blocos de código markdown.
            - Para 'torque': prefira Nm ou kgfm.
            - Para 'potencia': mantenha cv ou kW.
            - Para 'cambio': descreva se é manual ou automático e o número de marchas.
            - Para 'preco': mantenha a moeda e o formato (ex: R$ 350.000).
            - Se um valor estiver em unidades estrangeiras sem conversão clara, escreva "não disponível".

            Veículo alvo da busca: {marca} {modelo} {versao} {ano}

            Texto para extração:
            \"\"\"{texto_limitado}\"\"\"
        """


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    print("--- Testando GroqService (IA) com Atributos do Front ---")

    servico = GroqService()

    texto_teste = (
        "A Ford Ranger Raptor 2025 chega ao mercado com motor 3.0 V6 bi-turbo "
        "de 397 cv e 59,4 kgfm de torque. A transmissão é automática de 10 marchas com "
        "tração 4x4. Possui suspensão ativa Fox, freios a disco ventilados, rodas de liga leve aro 17 "
        "com pneus todo-terreno e faróis full-LED Matrix. O motorista conta com 7 modos de condução. "
        "Seu preço sugerido é de R$ 469.700."
    )

    atributos_front = {
        "motor": "",
        "potencia": "",
        "torque": "",
        "cambio": "",
        "tracao": "",
        "suspensao": "",
        "freios": "",
        "rodas_pneus": "",
        "farois": "",
        "modos_conducao": "",
        "preco": "",
    }

    print("Enviando texto de teste para a API da Groq...")
    try:
        resultado = servico.extrair_especificacao(
            texto_cru=texto_teste,
            atributos=atributos_front,
            marca="Ford",
            modelo="Ranger",
            versao="Raptor",
            ano=2025,
        )
        print("\n✅ Resposta estruturada retornada pela IA:")
        print(json.dumps(resultado, indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"\n⚠️ Falha no teste. Verifique sua GROQ_API_KEY. Detalhe: {e}")
