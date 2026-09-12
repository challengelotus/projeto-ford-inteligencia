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
            bypass_cache: true // Força o scraping novo durante os testes
        },
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
        }
    });

    const specs = response.data.especificacoes;

    // De-Para: Traduz o JSON do backend para as labels visuais do React
    const mapaAtributos = {
        'Motor': specs.motor,
        'Potência': specs.potencia,
        'Torque': specs.torque,
        'Câmbio': specs.cambio,
        'Tração': specs.tracao,
        'Comprimento': specs.comprimento,
        'Largura': specs.largura,
        'Altura': specs.altura,
        'Capacidade do Tanque': specs.capacidade_do_tanque,
        'Peso': specs.peso,
        'Número de Marchas': specs.numero_de_marchas,
        'Aceleração 0-100 km/h': specs.aceleracao_0_100,
        'Velocidade Máxima': specs.velocidade_maxima,
        'Consumo Urbano': specs.consumo_urbano,
        'Consumo Rodoviário': specs.consumo_rodoviario,
    };

    const resultado = {};
    for (const attr of atributosSelecionados) {
        let valor = mapaAtributos[attr];

        // Padroniza qualquer variação de indisponibilidade para a string exata que os componentes React esperam
        if (!valor || valor.trim().toLowerCase() === 'não disponível') {
            valor = 'Não disponível';
        }

        resultado[attr] = valor;
    }

    return resultado;
};

export { loginUser, fetchUserProfile, buscarEspecificacoesReais };
