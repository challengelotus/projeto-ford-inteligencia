from typing import List, Dict, Optional


class ConsensusService:
    """
    Serviço responsável por combinar múltiplos resultados de extração de IA
    utilizando diferentes estratégias (votação, média ponderada, etc.).
    """

    @staticmethod
    def combinar_por_votacao(resultados: List[Dict[str, str]],
                             atributos: Dict[str, str],
                             pesos_por_fonte: Optional[Dict[str, float]] = None) -> Dict[str, str]:
        """
        Combina resultados de múltiplas fontes (artigos, sites, etc.) escolhendo
        o valor mais frequente para cada atributo, podendo aplicar pesos por fonte.

        Args:
            resultados: Lista de dicionários (cada um com os atributos extraídos + campo 'fonte')
            atributos: Dicionário com as chaves esperadas (valores podem ser vazios)
            pesos_por_fonte: Dicionário com pesos para cada fonte (ex: {'site_oficial': 2.0, 'youtube': 0.5})

        Returns:
            Dicionário com o valor mais votado (ponderado) por atributo.
        """
        if pesos_por_fonte is None:
            pesos_por_fonte = {}

        final = {}
        for attr in atributos.keys():
            peso_por_valor = {}
            for res in resultados:
                fonte = res.get('fonte', 'desconhecido')
                peso = pesos_por_fonte.get(fonte, 1.0)
                valor = res.get(attr, 'não disponível')
                if valor != 'não disponível':
                    peso_por_valor[valor] = peso_por_valor.get(
                        valor, 0.0) + peso
            if peso_por_valor:
                # Escolhe o valor com maior peso acumulado (se empate, o primeiro encontrado)
                melhor_valor = max(peso_por_valor, key=lambda x: peso_por_valor[x])
                final[attr] = melhor_valor
            else:
                final[attr] = 'não disponível'
        return final

    # Exemplo de futura estratégia:
    @staticmethod
    def combinar_por_fonte_prioritaria(resultados: List[Dict[str, str]],
                                       atributos: Dict[str, str],
                                       ordem_prioridade: List[str]) -> Dict[str, str]:
        """
        (Opcional) Escolhe o valor da primeira fonte na lista de prioridade que possui o atributo.
        """
        final = {}
        for attr in atributos.keys():
            valor = "não disponível"
            for fonte_prio in ordem_prioridade:
                for res in resultados:
                    if res.get('fonte') == fonte_prio and res.get(attr, "não disponível") != "não disponível":
                        valor = res[attr]
                        break
                if valor != "não disponível":
                    break
            final[attr] = valor
        return final
