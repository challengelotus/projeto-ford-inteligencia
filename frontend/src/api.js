import axios from 'axios';

const API_URL = 'http://localhost:8000';

const loginUser = async (credentials) => {
    try {
        const params = new URLSearchParams();
        params.append("username", credentials.email);
        params.append("password", credentials.password);

        const response = await axios.post(
            `${API_URL}/auth/token`,
            params,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        console.log(error.response.data);
        throw error;
    }
};

const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/users/me/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Fetch user profile error:", error);
        throw error;
    }
};

const buscarEspecificacoesReais = async (marca, modelo, versao, ano, token, atributosSelecionados) => {
    const response = await axios.get(`${API_URL}/veiculos/busca`, {
        params: {
            marca,
            modelo,
            versao,
            ano,
            fonte: 'scrapy_ia_consenso',
            bypass_cache: true
        },
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        }
    });

    const specs = response.data.especificacoes;

    // 🔥 MAPEAMENTO ATUALIZADO: 21 Atributos
    const mapaAtributos = {
        'Motor': specs.motor,
        'Potência': specs.potencia,
        'Torque': specs.torque,
        'Câmbio': specs.cambio,
        'Número de Marchas': specs.numero_de_marchas,
        'Tração': specs.tracao,
        'Propulsão': specs.propulsao,
        'Suspensão': specs.suspensao,
        'Freios': specs.freios,
        'Rodas e Pneus': specs.rodas_e_pneus,
        'Faróis': specs.farois,
        'Modos de Condução': specs.modos_de_conducao,
        'Comprimento': specs.comprimento,
        'Largura': specs.largura,
        'Altura': specs.altura,
        'Capacidade do Tanque': specs.capacidade_do_tanque,
        'Peso': specs.peso,
        'Aceleração 0-100 km/h': specs.aceleracao_0_100,
        'Velocidade Máxima': specs.velocidade_maxima,
        'Consumo Urbano': specs.consumo_urbano,
        'Consumo Rodoviário': specs.consumo_rodoviario,
        'Preço': specs.preco,
        'Tipo de Combustível': specs.tipo_combustivel,
    };

    const resultado = {};
    for (const attr of atributosSelecionados) {
        let valor = mapaAtributos[attr];

        if (!valor || valor.trim().toLowerCase() === 'não disponível') {
            valor = 'Não disponível';
        }

        resultado[attr] = valor;
    }

    return resultado;
};

export { buscarEspecificacoesReais, fetchUserProfile, loginUser };

