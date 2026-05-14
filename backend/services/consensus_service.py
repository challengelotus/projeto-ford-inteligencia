from typing import List, Dict

class ConsensusService:
    """
    Serviço responsável por combinar múltiplos resultados de extração de IA
    utilizando diferentes estratégias (votação, média ponderada, etc.).
    """

    @staticmethod
    def combinar_por_votacao(resultados: List[Dict[str, str]], atributos: Dict[str, str]) -> Dict[str, str]:
        """
        Combina resultados de múltiplas fontes (artigos, sites, etc.) escolhendo
        o valor mais frequente para cada atributo.

        Args:
            resultados: Lista de dicionários (cada um com os atributos extraídos)
            atributos: Dicionário com as chaves esperadas (valores podem ser vazios)

        Returns:
            Dicionário com o valor mais votado por atributo.
            Se não houver votos, usa "não disponível".
        """
        final = {}
        for attr in atributos.keys():
            votos = {}
            for res in resultados:
                valor = res.get(attr, "não disponível")
                if valor != "não disponível":
                    votos[valor] = votos.get(valor, 0) + 1
            if votos:
                # Valor com maior contagem (em caso de empate, o primeiro encontrado)
                final[attr] = max(votos, key=votos.get)
            else:
                final[attr] = "não disponível"
        return final

    @staticmethod
    def combinar_por_confianca(resultados: List[Dict[str, str]], pesos: List[float], atributos: Dict[str, str]) -> Dict[str, str]:
        """
        (Exemplo) Combina considerando pesos por fonte.
        A ser implementado conforme necessidade.
        """
        raise NotImplementedError("Em desenvolvimento")