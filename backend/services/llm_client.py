import json
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

    def extrair_especificacao(self, texto_cru: str, atributos: Dict[str, str], marca: str, modelo: str, versao: str) -> Dict[str, str]:
        """
        Extrai atributos de um único texto (artigo, site, etc.) utilizando o modelo LLM.
        
        Args:
            texto_cru: Texto bruto da fonte (máximo 4000 caracteres recomendado)
            atributos: Dicionário com as chaves desejadas (ex: {'motor': '', 'potencia': ''})
            marca, modelo, versao: Dados do veículo para auxiliar o prompt
            
        Returns:
            Dicionário com os atributos extraídos (valores ou "não disponível")
        """
        prompt = self._construir_prompt(texto_cru, atributos, marca, modelo, versao)
        
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
                import re
                json_match = re.search(r'\{.*\}', conteudo, re.DOTALL)
                if json_match:
                    resultado = json.loads(json_match.group())
                else:
                    print(f"Erro: resposta não contém JSON válido: {conteudo[:200]}")
                    return {attr: "não disponível" for attr in atributos}
            
            # Garante que todas as chaves solicitadas existem no resultado
            for attr in atributos:
                if attr not in resultado:
                    resultado[attr] = "não disponível"
            return resultado
            
        except Exception as e:
            print(f"Erro ao chamar o modelo: {e}")
            return {attr: "não disponível" for attr in atributos}

    def processar_artigos(self, artigos: List[Dict[str, str]], atributos: Dict[str, str], marca: str, modelo: str, versao: str) -> List[Dict[str, str]]:
        """
        Processa uma lista de artigos (cada um contendo 'titulo', 'conteudo' e opcional 'url').
        Retorna uma lista com os resultados da extração para cada artigo.
        """
        resultados = []
        for idx, artigo in enumerate(artigos):
            titulo = artigo.get('titulo', '')
            conteudo = artigo.get('conteudo', '')
            url = artigo.get('url', f'artigo_{idx+1}')
            
            if not conteudo.strip():
                print(f"Pular artigo {url}: conteúdo vazio")
                continue
                
            texto = f"{titulo}\n{conteudo}"
            print(f"Processando artigo: {url}")
            resultado = self.extrair_especificacao(texto, atributos, marca, modelo, versao)
            resultados.append(resultado)
        return resultados

    def _construir_prompt(self, texto_cru: str, atributos: Dict[str, str], marca: str, modelo: str, versao: str) -> str:
        """
        Constrói o prompt para o modelo com formatação clara e obrigação de JSON.
        """
        # Limita o tamanho do texto para evitar estouro de contexto
        texto_limitado = texto_cru[:4000]
        
        # Gera o exemplo de formato JSON
        exemplo_chaves = ', '.join(f'"{k}": "{v}"' for k, v in atributos.items())
        
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

            Veículo: {marca} {modelo} {versao}

            Texto para extração:
            \"\"\"{texto_limitado}\"\"\"
        """


# ================== EXECUÇÃO DE TESTE ==================
if __name__ == "__main__":
    from consensus_service import ConsensusService  # será criado a seguir
    
    ESPECIFICACOES = {
        "marca": "", "modelo": "", "versao": "",
        "motor": "", "potencia": "", "torque": "",
        "cambio": "", "tracao": "",
        "comprimento": "", "largura": "", "altura": "",
        "capacidade_tanque": "", "peso": ""
    }
    
    artigos_simulados = [
        {
            "url": "https://exemplo.com/artigo1",
            "titulo": "Ford Ranger Raptor 2025: primeiras impressões",
            "conteudo": "A nova Ranger Raptor vem com motor V6 3.0 biturbo de 397 cavalos, câmbio automático de 10 marchas e tração 4x4 com reduzida."
        },
        {
            "url": "https://exemplo.com/artigo2",
            "titulo": "Especificações técnicas da Ranger Raptor",
            "conteudo": "Motor 3.0 V6, potência 397 cv, transmissão automática de 10 velocidades, tração nas quatro rodas."
        },
        {
            "url": "https://exemplo.com/artigo3",
            "titulo": "Review: Ford Ranger Raptor 2025",
            "conteudo": "O motor é um V6 3.0 biturbo com 397 cv de potência. Câmbio automático de 10 marchas. Tração integral."
        }
    ]
    
    print("=== Teste do LLMService ===")
    llm = LLMService()
    extracoes = llm.processar_artigos(artigos_simulados, ESPECIFICACOES, "Ford", "Ranger", "Raptor 2025")
    
    print("\n=== Extrações individuais ===")
    for i, extr in enumerate(extracoes):
        print(f"Artigo {i+1}: {extr}")
    
    print("\n=== Resultado combinado (votação) ===")
    final = ConsensusService.combinar_por_votacao(extracoes, ESPECIFICACOES)
    print(json.dumps(final, indent=2, ensure_ascii=False))