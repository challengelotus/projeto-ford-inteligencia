from typing import Any, Dict, Optional

from app.services.consensus_service import ConsensusService

# Importamos os nossos serviços já validados
from app.services.data_loader_service import DataLoaderService
from app.services.groq_service import GroqService
from app.services.storage_service import StorageService


class VehicleService:
    """
    Serviço central de veículos.
    Responsável por orquestrar regras de negócio, chamadas à IA e acesso a dados.
    """

    def __init__(self):
        self.data_loader = DataLoaderService()
        self.groq_service = GroqService()
        self.storage_service = StorageService()

        # O dicionário padrão de tudo que queremos que a IA extraia
        self.atributos_esperados = {
            "motor": "",
            "potencia": "",
            "torque": "",
            "transmissao": "",
            "tracao": "",
            "peso": "",
            "comprimento": "",
            "capacidade_carga": "",
        }

    def processar_veiculo_com_ia(
        self,
        marca: str,
        modelo: str,
        versao: str,
        ano: int,
    ) -> Dict[str, str]:
        """
        Orquestra o pipeline completo:
        Lê arquivos -> Extrai via Groq -> Aplica Consenso -> Salva Backup.
        """
        print(
            f"\n🚀 Iniciando orquestração da IA para: {marca} {modelo} {versao} {ano}",
        )

        # 1. Carrega os artigos brutos deixados pelo Scrapy
        artigos = self.data_loader.carregar_artigos()
        if not artigos:
            print(
                "⚠️ Nenhum artigo encontrado no diretório raw. Retornando 'não disponível'.",
            )
            return {attr: "não disponível" for attr in self.atributos_esperados}

        print(f"📚 {len(artigos)} artigos carregados. Enviando para a Groq...")

        # 2. Processa cada artigo individualmente usando a IA
        resultados_ia = self.groq_service.processar_artigos(
            artigos=artigos,
            atributos=self.atributos_esperados,
            marca=marca,
            modelo=modelo,
            versao=versao,
            ano=ano,
        )

        # 3. Aplica a votação ponderada para resolver conflitos entre as fontes
        print("⚖️ Aplicando consenso por votação ponderada...")
        resultado_final = ConsensusService.combinar_por_votacao(
            resultados=resultados_ia,
            atributos=self.atributos_esperados,
        )

        # 4. Salva um backup do JSON consolidado para auditoria/histórico
        caminho_backup = self.storage_service.salvar_resultado(
            resultado=resultado_final,
            marca=marca,
            modelo=modelo,
            versao=versao,
            ano=ano,
        )
        print(f"💾 Backup da ficha técnica salvo em: {caminho_backup}")

        return resultado_final

    # ---------------------------------------------------------
    # MÉTODOS EXISTENTES (Mantidos para não quebrar a branch)
    # (Se você já tiver métodos aqui como buscar_veiculo ou criar_veiculo,
    # mantenha-os inalterados. Eles serão atualizados apenas na Etapa 5).
    # ---------------------------------------------------------


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    import json

    print("--- Testando Orquestração Completa (VehicleService) ---")
    # Lembrete: a GROQ_API_KEY precisa estar no ambiente

    servico = VehicleService()

    try:
        # Simulando o processamento do veículo obrigatório da prova de conceito
        ficha_tecnica = servico.processar_veiculo_com_ia(
            marca="Ford",
            modelo="Ranger",
            versao="Raptor",
            ano=2025,
        )

        print("\n✅ Ficha Técnica Consolidada (Resultado Final):")
        print(json.dumps(ficha_tecnica, indent=2, ensure_ascii=False))
        print("\nPipeline testado com sucesso! Tudo se comunicando perfeitamente.")

    except Exception as e:
        print(f"\n❌ Erro durante a orquestração: {e}")
