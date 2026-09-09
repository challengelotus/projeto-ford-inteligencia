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
        Constrói o prompt blindado com regras rígidas de formatação,
        focado em dimensões, performance e consumo.
        """
        texto_limitado = texto_cru[:4000]
        exemplo_chaves = ",\n                ".join(
            f'"{k}": "{v}"' for k, v in atributos.items()
        )

        return f"""
            Você é um especialista em fichas técnicas automotivas.
            Retorne SOMENTE um JSON válido, sem markdown, sem explicações, sem texto adicional.

            Formato OBRIGATÓRIO (as chaves devem ser exatamente estas):
            {{
                {exemplo_chaves}
            }}

            Regras rigorosas de preenchimento:
            - Se não encontrar a informação exata no texto, use "não disponível".
            - NUNCA adicione chaves novas ao JSON.
            - 'cambio': Retorne apenas o tipo (ex: "Automático", "Manual", "CVT").
            - 'numero_de_marchas': Retorne apenas o número (ex: "6", "10").
            - 'comprimento', 'largura', 'altura': Prefira milímetros (mm) ou metros (m).
            - 'capacidade_do_tanque': Use litros (L).
            - 'aceleracao_0_100': Use segundos (ex: "5,8 s").
            - 'velocidade_maxima': Use km/h.
            - 'consumo_urbano' e 'consumo_rodoviario': Use km/l.
            - 'torque': Use kgfm ou Nm.
            - 'potencia': Use cv ou hp.

            Veículo alvo da extração: {marca} {modelo} {versao} {ano}

            Texto para análise:
            \"\"\"{texto_limitado}\"\"\"
        """


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    import json

    print("--- Testando GroqService com Contrato de 15 Chaves ---")

    servico = GroqService()

    texto_teste = (
        "A Ford Ranger Raptor 2025 impressiona pelas dimensões: 5360 mm de comprimento, "
        "2028 mm de largura e 1926 mm de altura, pesando 2415 kg. O tanque de combustível comporta 80 litros. "
        "Sob o capô, o motor 3.0 V6 bi-turbo entrega 397 cv e 59,4 kgfm de torque, acoplado a um "
        "câmbio automático de 10 marchas com tração 4x4. Ela atinge 100 km/h em apenas 5,8 segundos, "
        "com velocidade máxima limitada a 180 km/h. O consumo urbano é de 8,3 km/l e o rodoviário chega a 10,2 km/l."
    )

    atributos_front = {
        "motor": "",
        "potencia": "",
        "torque": "",
        "cambio": "",
        "numero_de_marchas": "",
        "tracao": "",
        "comprimento": "",
        "largura": "",
        "altura": "",
        "capacidade_do_tanque": "",
        "peso": "",
        "aceleracao_0_100": "",
        "velocidade_maxima": "",
        "consumo_urbano": "",
        "consumo_rodoviario": "",
    }

    print("Processando extração na API da Groq...")
    try:
        resultado = servico.extrair_especificacao(
            texto_cru=texto_teste,
            atributos=atributos_front,
            marca="Ford",
            modelo="Ranger",
            versao="Raptor",
            ano=2025,
        )
        print("\n✅ Resposta Estruturada (Contrato do Frontend):")
        print(json.dumps(resultado, indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"\n⚠️ Falha no teste: {e}")
