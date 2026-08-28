from typing import Dict, List, Optional


class ConsensusService:
    """
    Serviço responsável por combinar múltiplos resultados de extração de IA
    utilizando diferentes estratégias (votação ponderada, prioridade de fontes, etc.).
    """

    @staticmethod
    def combinar_por_votacao(
        resultados: List[Dict[str, str]],
        atributos: Dict[str, str],
        pesos_por_fonte: Optional[Dict[str, float]] = None,
    ) -> Dict[str, str]:
        """
        Combina resultados de múltiplas fontes escolhendo o valor mais frequente
        para cada atributo. Aplica pesos maiores para fontes mais confiáveis.

        Args:
            resultados: Lista de dicionários (cada um com os atributos extraídos + campo 'fonte')
            atributos: Dicionário com as chaves esperadas.
            pesos_por_fonte: Dicionário com pesos para cada fonte (ex: {'site_oficial': 2.0, 'youtube': 0.5})

        Returns:
            Dicionário com o valor vencedor por atributo.
        """
        if pesos_por_fonte is None:
            # Peso padrão caso não seja fornecido
            pesos_por_fonte = {
                "site_oficial": 2.0,
                "caranddriver": 1.5,
                "motor1": 1.2,
                "automaistv": 1.0,
                "youtube": 0.8,
            }

        final = {}
        for attr in atributos.keys():
            peso_por_valor = {}
            for res in resultados:
                fonte = res.get("fonte", "desconhecido")
                peso = pesos_por_fonte.get(fonte, 1.0)

                # Ignora atributos não encontrados pela IA
                valor = res.get(attr, "não disponível")
                if valor != "não disponível":
                    peso_por_valor[valor] = peso_por_valor.get(valor, 0.0) + peso

            if peso_por_valor:
                # Escolhe o valor com maior peso acumulado (desempate: primeiro encontrado)
                melhor_valor = max(peso_por_valor, key=lambda x: peso_por_valor[x])
                final[attr] = melhor_valor
            else:
                final[attr] = "não disponível"

        return final


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    print("--- Testando ConsensusService ---")

    # 1. Definimos os atributos que esperamos que a IA tenha extraído
    atributos_esperados = {"motor": "", "potencia": "", "transmissao": ""}

    # 2. Simulamos as respostas que a IA nos daria após ler três artigos diferentes
    resultados_simulados = [
        {
            "fonte": "automaistv",
            "motor": "3.0 V6 Bi-turbo",
            "potencia": "397 cv",  # Valor correto
            "transmissao": "Automática de 6 marchas",  # Incorreto no artigo original
        },
        {
            "fonte": "caranddriver",
            "motor": "3.0 V6",
            "potencia": "400 cv",  # Arredondaram aqui
            "transmissao": "Automática de 10 marchas",
        },
        {
            "fonte": "motor1",
            "motor": "3.0 V6 Bi-turbo",
            "potencia": "397 cv",
            "transmissao": "Automática de 10 marchas",
        },
    ]

    # 3. Rodamos o consenso
    resultado_final = ConsensusService.combinar_por_votacao(
        resultados=resultados_simulados,
        atributos=atributos_esperados,
    )

    print("\nResultados recebidos:")
    for res in resultados_simulados:
        print(
            f" - [{res['fonte']}]: {res['potencia']} | {res['transmissao']} | {res['motor']}",
        )

    print("\n✅ Veredito Final (Consenso):")
    for chave, valor in resultado_final.items():
        print(f" - {chave.capitalize()}: {valor}")

    print("\nValidação:")
    assert resultado_final["potencia"] == "397 cv", "A potência deveria ser 397 cv"
    assert resultado_final["transmissao"] == "Automática de 10 marchas", (
        "A transmissão deveria ser 10 marchas"
    )
    print("Todos os testes locais passaram com sucesso!")
