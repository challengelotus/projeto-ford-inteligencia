import json
import re
from typing import List, Dict
from ollama import chat, ChatResponse


class LLMService:
    """
    Serviço para interagir com o modelo LLM local via Ollama.
    Responsável por extrair especificações de veículos a partir de textos brutos.
    """

    def __init__(self, model_name: str = 'gemma4:e2b', temperature: float = 0.1, timeout: int = 30):
        self.model_name = model_name
        self.temperature = temperature
        self.timeout = timeout

    def extrair_especificacao(self, texto_cru: str, atributos: Dict[str, str],
                              marca: str, modelo: str, versao: str) -> Dict[str, str]:
        """
        Extrai atributos de um único texto (artigo, site, etc.) utilizando o modelo LLM.

        Args:
            texto_cru: Texto bruto da fonte (máximo 4000 caracteres recomendado)
            atributos: Dicionário com as chaves desejadas (ex: {'motor': '', 'potencia': ''})
            marca, modelo, versao: Dados do veículo para auxiliar o prompt

        Returns:
            Dicionário com os atributos extraídos (valores ou "não disponível")
        """
        prompt = self._construir_prompt(
            texto_cru, atributos, marca, modelo, versao)

        try:
            response: ChatResponse = chat(
                model=self.model_name,
                messages=[{'role': 'user', 'content': prompt}],
                options={
                    'temperature': self.temperature,
                    'timeout': self.timeout
                }
            )
            conteudo = response['message']['content'].strip()

            # Tenta interpretar a resposta como JSON
            try:
                resultado = json.loads(conteudo)
            except json.JSONDecodeError:
                # Fallback: tenta extrair JSON com regex
                json_match = re.search(r'\{.*\}', conteudo, re.DOTALL)
                if json_match:
                    resultado = json.loads(json_match.group())
                else:
                    print(
                        f"Erro: resposta não contém JSON válido: {conteudo[:200]}")
                    return {attr: "não disponível" for attr in atributos}

            # Garante que todas as chaves solicitadas existem no resultado
            for attr in atributos:
                if attr not in resultado:
                    resultado[attr] = "não disponível"
            return resultado

        except Exception as e:
            print(f"Erro ao chamar o modelo: {e}")
            return {attr: "não disponível" for attr in atributos}

    def processar_artigos(self, artigos: List[Dict[str, str]], atributos: Dict[str, str],
                          marca: str, modelo: str, versao: str) -> List[Dict[str, str]]:
        """
        Processa uma lista de artigos (cada um com 'titulo', 'conteudo', 'fonte', 'url').
        Retorna uma lista de dicionários com os atributos extraídos + a fonte original.
        """
        resultados = []
        for idx, artigo in enumerate(artigos):
            titulo = artigo.get('titulo', '')
            conteudo = artigo.get('conteudo', '')
            fonte = artigo.get('fonte', 'desconhecido')
            url = artigo.get('url', f'artigo_{idx+1}')

            if not conteudo.strip():
                print(f"Pular artigo sem conteúdo: {url}")
                continue

            texto = f"{titulo}\n{conteudo}" if titulo else conteudo
            print(f"Processando: {url} (fonte={fonte})")
            resultado = self.extrair_especificacao(
                texto, atributos, marca, modelo, versao)
            resultado['fonte'] = fonte  # Adiciona a fonte para uso no consenso
            resultados.append(resultado)
        return resultados

    def _construir_prompt(self, texto_cru: str, atributos: Dict[str, str],
                          marca: str, modelo: str, versao: str) -> str:
        """
        Constrói o prompt para o modelo com formatação clara e obrigação de JSON.
        """
        texto_limitado = texto_cru[:4000]  # Evita estouro de contexto
        exemplo_chaves = ', '.join(
            f'"{k}": "{v}"' for k, v in atributos.items())

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
            - NUNCA use markdown.
            - Use APENAS unidades do sistema métrico internacional (kg, metros, cv, Nm ou kgfm).
            - Para torque: prefira Nm (newton-metro) ou kgfm (1 kgfm = 9,80665 Nm).
            - Para peso: use quilogramas (kg). Se o texto informar libras (pounds), converta: 1 lb = 0,4536 kg.
            - Para comprimentos: use metros (m) ou milímetros (mm).
            - Para potência: mantenha cv (cavalos) ou kW (converta se necessário).
            - Nunca retorne unidades como "pound-feet", "pounds", "GVW", "GVWR".
            - Se um valor estiver em unidades estranhas e você não souber converter, escreva "não disponível".

            Veículo: {marca} {modelo} {versao}

            Texto para extração:
            \"\"\"{texto_limitado}\"\"\"
        """


# ================== EXECUÇÃO DE TESTE (opcional) ==================
if __name__ == "__main__":
    # Pequeno teste manual (simula artigos)
    from consensus_service import ConsensusService

    atributos_teste = {
        "motor": "", "potencia": "", "cambio": "", "tracao": ""
    }
    artigos_teste = [
        {
            "titulo": "Ranger Raptor",
            "conteudo": "Motor V6 3.0 biturbo de 397 cv, câmbio automático de 10 marchas, tração 4x4.",
            "fonte": "results",
            "url": "teste1"
        },
        {
            "titulo": "Review",
            "conteudo": "Potência 397 cavalos, motor 3.0 V6, transmissão automática de 10 velocidades.",
            "fonte": "youtube",
            "url": "teste2"
        }
    ]

    llm = LLMService()
    resultados = llm.processar_artigos(
        artigos_teste, atributos_teste, "Ford", "Ranger", "Raptor")
    final = ConsensusService.combinar_por_votacao(resultados, atributos_teste)
    print(json.dumps(final, indent=2, ensure_ascii=False))
