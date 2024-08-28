import fetch from 'node-fetch';

export class PublicCNPJWS {
    static async search(cnpj) {
        console.log(cnpj)
        try {
            const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj.replace(/\D/g, '')}`);
            const data = response.json();
            console.log('Dados da empresa:', data['razao_social']);
            return data
        } catch (error) {
            console.error('Erro ao buscar dados do CNPJ:', error.message);
        }
    }
}

