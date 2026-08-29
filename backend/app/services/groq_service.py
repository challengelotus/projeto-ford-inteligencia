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
        texto_limitado = texto_cru[:4000]  # Prevenção contra estouro de contexto
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
            - NUNCA adicione campos extras.
            - NUNCA use markdown ou blocos de código na resposta.
            - Use APENAS unidades do sistema métrico internacional (kg, metros, cv, Nm ou kgfm).
            - Para torque: prefira Nm (newton-metro) ou kgfm (1 kgfm = 9,80665 Nm).
            - Para peso: use quilogramas (kg). Se o texto informar libras (pounds), converta: 1 lb = 0,4536 kg.
            - Para potência: mantenha cv (cavalos) ou kW (converta se necessário).
            - Se um valor estiver em unidades estranhas e você não souber converter, escreva "não disponível".

            Veículo alvo da busca: {marca} {modelo} {versao} {ano}

            Texto para extração:
            \"\"\"{texto_limitado}\"\"\"
        """


# ==========================================
# FUNÇÕES DE COMPATIBILIDADE (MOCKS)
# Mantidas temporariamente para não quebrar a rota
# /veiculos/busca atual antes da orquestração (Etapa 5).
# ==========================================
def extrair_especificacoes_do_texto(texto: str) -> str:
    return "Extraído via Scrapy (Mock Compatibilidade)"


def processar_artigos_para_especificacoes(artigos: list) -> dict:
    return {"especificacoes": "Extraído via Scrapy (Mock Compatibilidade)"}


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    print("--- Testando GroqService (IA) ---")

    # IMPORTANTE: Coloque sua chave real do Groq no ambiente para esse teste funcionar
    # export GROQ_API_KEY="gsk_suachaveaqui"

    servico = GroqService()

    texto_teste = (
        "Por último, a Ford Ranger Raptor tem visual exclusivo. Seu propulsor é 3.0 V6 bi-turbo "
        "de 397 cv e a transmissão é automática de seis marchas. Esta versão ostenta o título de "
        "caminhonete mais rápida do Brasil, por ir de 0 a 100 km/h em 5,8 segundos."
    )

    atributos_esperados = {
        "motor": "",
        "potencia": "",
        "transmissao": "",
        "tracao": "",
    }

    print("Enviando texto de teste para a API da Groq...")
    try:
        resultado = servico.extrair_especificacao(
            texto_cru=texto_teste,
            atributos=atributos_esperados,
            marca="Ford",
            modelo="Ranger",
            versao="Raptor",
            ano=2025,
        )
        print("\n✅ Resposta estruturada retornada pela IA:")
        print(json.dumps(resultado, indent=2, ensure_ascii=False))

    except Exception as e:
        print(
            f"\n⚠️ Falha no teste. Verifique sua conexão e sua GROQ_API_KEY. Detalhe: {e}",
        )
