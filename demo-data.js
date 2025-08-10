// Dados de demonstração para a aplicação
// Este arquivo contém dados de exemplo para testar a funcionalidade

const DEMO_DATA = {
    usuarios: [
        {
            id: 'user1',
            nome: 'João Silva',
            departamento: 'NIT',
            dataCriacao: '2024-01-15T10:00:00.000Z'
        },
        {
            id: 'user2',
            nome: 'Maria Santos',
            departamento: 'Contábil',
            dataCriacao: '2024-01-16T10:00:00.000Z'
        },
        {
            id: 'user3',
            nome: 'Pedro Costa',
            departamento: 'Comercial',
            dataCriacao: '2024-01-17T10:00:00.000Z'
        },
        {
            id: 'user4',
            nome: 'Ana Oliveira',
            departamento: 'Administrativo',
            dataCriacao: '2024-01-18T10:00:00.000Z'
        },
        {
            id: 'user5',
            nome: 'Carlos Ferreira',
            departamento: 'Fiscal',
            dataCriacao: '2024-01-19T10:00:00.000Z'
        }
    ],
    mercadorias: [
        {
            id: 'merc1',
            usuarioId: 'user1',
            nome: 'Notebook Dell',
            status: 'Em Uso',
            valor: 2500.00,
            observacoes: 'Notebook para desenvolvimento',
            dataCriacao: '2024-01-15T11:00:00.000Z',
            ultimaMovimentacao: '2024-01-15T11:00:00.000Z'
        },
        {
            id: 'merc2',
            usuarioId: 'user1',
            nome: 'Mouse Logitech',
            status: 'Disponível',
            valor: 150.00,
            observacoes: 'Mouse sem fio',
            dataCriacao: '2024-01-15T11:30:00.000Z',
            ultimaMovimentacao: '2024-01-15T11:30:00.000Z'
        },
        {
            id: 'merc3',
            usuarioId: 'user2',
            nome: 'Monitor Samsung 24"',
            status: 'Em Uso',
            valor: 800.00,
            observacoes: 'Monitor Full HD',
            dataCriacao: '2024-01-16T11:00:00.000Z',
            ultimaMovimentacao: '2024-01-16T11:00:00.000Z'
        },
        {
            id: 'merc4',
            usuarioId: 'user3',
            nome: 'Teclado Mecânico',
            status: 'Manutenção',
            valor: 300.00,
            observacoes: 'Algumas teclas com problema',
            dataCriacao: '2024-01-17T11:00:00.000Z',
            ultimaMovimentacao: '2024-01-20T14:00:00.000Z'
        },
        {
            id: 'merc5',
            usuarioId: 'user4',
            nome: 'Impressora HP',
            status: 'Disponível',
            valor: 450.00,
            observacoes: 'Impressora multifuncional',
            dataCriacao: '2024-01-18T11:00:00.000Z',
            ultimaMovimentacao: '2024-01-18T11:00:00.000Z'
        }
    ],
    historico: [
        {
            id: 'hist1',
            usuarioId: 'user1',
            mercadoria: 'Notebook Dell',
            acao: 'Entrada',
            observacoes: 'Recebimento do equipamento',
            dataHora: '2024-01-15T11:00:00.000Z'
        },
        {
            id: 'hist2',
            usuarioId: 'user2',
            mercadoria: 'Monitor Samsung 24"',
            acao: 'Entrada',
            observacoes: 'Novo monitor para estação de trabalho',
            dataHora: '2024-01-16T11:00:00.000Z'
        },
        {
            id: 'hist3',
            usuarioId: 'user3',
            mercadoria: 'Teclado Mecânico',
            acao: 'Status alterado: Em Uso → Manutenção',
            observacoes: 'Teclas apresentando defeito',
            dataHora: '2024-01-20T14:00:00.000Z'
        }
    ]
};

// Função para gerar código aleatório baseado na categoria
function gerarCodigoAleatorio(categoria = 'geral') {
    const prefixos = DEMO_DATA.codigosPorCategoria[categoria] || ['GER-'];
    const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
    const numero = Math.floor(Math.random() * 999) + 1;
    return prefixo + numero.toString().padStart(3, '0');
}

// Função para obter usuário aleatório
function obterUsuarioAleatorio() {
    const usuarios = DEMO_DATA.usuarios;
    return usuarios[Math.floor(Math.random() * usuarios.length)];
}

// Função para obter produto aleatório
function obterProdutoAleatorio() {
    const produtos = DEMO_DATA.produtos;
    return produtos[Math.floor(Math.random() * produtos.length)];
}

// Função para gerar registro aleatório
function gerarRegistroAleatorio() {
    const tipos = ['Entrada', 'Saída', 'Produto Danificado'];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    
    return {
        id: Date.now() + Math.random(),
        usuario: obterUsuarioAleatorio(),
        produto: obterProdutoAleatorio(),
        codigo: gerarCodigoAleatorio(),
        tipo: tipo,
        data_hora: new Date().toISOString()
    };
}

// Função para carregar dados de demonstração
function carregarDadosDemo() {
    if (typeof window !== 'undefined' && window.app) {
        // Limpar dados existentes
        window.app.usuarios = [];
        window.app.mercadorias = [];
        window.app.historico = [];
        
        // Carregar usuários de exemplo
        DEMO_DATA.usuarios.forEach(usuario => {
            window.app.usuarios.push(usuario);
        });
        
        // Carregar mercadorias de exemplo
        DEMO_DATA.mercadorias.forEach(mercadoria => {
            window.app.mercadorias.push(mercadoria);
        });
        
        // Carregar histórico de exemplo
        DEMO_DATA.historico.forEach(historico => {
            window.app.historico.push(historico);
        });
        
        // Salvar dados no localStorage
        window.app.salvarDados();
        
        // Atualizar as visualizações
        window.app.renderizarUsuarios();
        window.app.renderizarMercadorias();
        window.app.renderizarHistorico();
        window.app.atualizarValorTotal();
        window.app.atualizarGrafico();
        
        console.log('Dados de demonstração carregados com sucesso!');
    }
}

// Função para limpar dados de demonstração
function limparDadosDemo() {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('demo_movimentacoes');
        localStorage.removeItem('demo_usuarios');
        localStorage.removeItem('demo_produtos');
        console.log('Dados de demonstração removidos!');
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.DEMO_DATA = DEMO_DATA;
    window.gerarCodigoAleatorio = gerarCodigoAleatorio;
    window.obterUsuarioAleatorio = obterUsuarioAleatorio;
    window.obterProdutoAleatorio = obterProdutoAleatorio;
    window.gerarRegistroAleatorio = gerarRegistroAleatorio;
    window.carregarDadosDemo = carregarDadosDemo;
    window.limparDadosDemo = limparDadosDemo;
}

// Exportar para Node.js se disponível
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEMO_DATA,
        gerarCodigoAleatorio,
        obterUsuarioAleatorio,
        obterProdutoAleatorio,
        gerarRegistroAleatorio,
        carregarDadosDemo,
        limparDadosDemo
    };
}