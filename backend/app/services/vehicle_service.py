import hashlib
from typing import Any, Dict, Optional

from sqlalchemy.orm import Session

from app.models.vehicle_model import Veiculo
from app.services.consensus_service import ConsensusService
from app.services.data_loader_service import DataLoaderService
from app.services.groq_service import GroqService
from app.services.storage_service import StorageService

""


class VehicleService:
    """
    Serviço central de veículos.
    Responsável por orquestrar regras de negócio, chamadas à IA e acesso a dados.
    """

    def __init__(self):
        self.data_loader = DataLoaderService()
        self.groq_service = GroqService()
        self.storage_service = StorageService()

        # Dicionário padrão (Contrato rígido de 15 chaves alinhado com o Frontend)
        self.atributos_esperados = {
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


def gerar_hash_busca(
    marca: str,
    modelo: str,
    versao: str,
    ano: int,
) -> str:
    """
    Gera um hash único para identificar um veículo
    através de marca, modelo, versão e ano.
    """

    chave = (
        f"{marca.strip().lower()}|"
        f"{modelo.strip().lower()}|"
        f"{versao.strip().lower()}|"
        f"{ano}"
    )

    return hashlib.sha256(
        chave.encode("utf-8"),
    ).hexdigest()


def get_veiculo_by_hash(
    db: Session,
    hash_busca: str,
):
    """
    Busca um veículo existente pelo hash.
    """

    return db.query(Veiculo).filter(Veiculo.hash_busca == hash_busca).first()


def create_veiculo(
    db: Session,
    marca: str,
    modelo: str,
    versao: str,
    ano: int,
    fonte: str,
    especificacoes: dict,
):
    """
    Cria um novo veículo no banco de dados.
    """

    hash_busca = gerar_hash_busca(
        marca=marca,
        modelo=modelo,
        versao=versao,
        ano=ano,
    )

    veiculo = Veiculo(
        marca=marca,
        modelo=modelo,
        versao=versao,
        ano=ano,
        fonte=fonte,
        hash_busca=hash_busca,
        especificacoes=especificacoes,
    )

    db.add(veiculo)
    db.commit()
    db.refresh(veiculo)

    return veiculo


def update_veiculo(
    db: Session,
    veiculo: Veiculo,
    especificacoes: dict,
    fonte: str,
):
    """
    Atualiza as especificações e a fonte
    de um veículo existente.
    """

    veiculo.especificacoes = especificacoes
    veiculo.fonte = fonte

    db.commit()
    db.refresh(veiculo)

    return veiculo


# ==========================================
# BLOCO DE VALIDAÇÃO (TESTE LOCAL)
# ==========================================
if __name__ == "__main__":
    import json

    print("--- Testando Orquestração Completa (VehicleService) ---")

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
