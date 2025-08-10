// Arquivo de configuração da aplicação
// Copie este arquivo e renomeie para config.local.js para suas configurações locais

const CONFIG = {
    // Configurações do Supabase
    supabase: {
        url: 'YOUR_SUPABASE_URL', // Substitua pela sua URL do Supabase
        anonKey: 'YOUR_SUPABASE_ANON_KEY', // Substitua pela sua chave anônima
        tableName: 'movimentacoes' // Nome da tabela no banco
    },
    
    // Configurações da aplicação
    app: {
        title: 'Controle de Entrada e Saída de Materiais',
        maxRegistrosPorPagina: 50,
        autoRefreshInterval: 30000, // 30 segundos
        enableAutoRefresh: false
    },
    
    // Configurações de UI
    ui: {
        theme: 'light', // light ou dark
        showTimestamps: true,
        dateFormat: 'pt-BR',
        enableAnimations: true
    },
    
    // Tipos de movimentação disponíveis
    tiposMovimentacao: [
        { value: 'Entrada', label: 'Entrada', icon: 'arrow_downward', color: 'green' },
        { value: 'Saída', label: 'Saída', icon: 'arrow_upward', color: 'red' },
        { value: 'Produto Danificado', label: 'Produto Danificado', icon: 'warning', color: 'yellow' }
    ],
    
    // Configurações de validação
    validation: {
        minCodigoLength: 3,
        maxCodigoLength: 20,
        minNomeLength: 2,
        maxNomeLength: 100,
        requiredFields: ['usuario', 'produto', 'codigo', 'tipo']
    },
    
    // Configurações de exportação
    export: {
        filename: 'movimentacoes',
        dateInFilename: true,
        formats: ['csv', 'json']
    },
    
    // Configurações do scanner
    scanner: {
        enabled: true,
        simulateMode: true, // true para modo simulação, false para scanner real
        codePrefix: 'SCAN',
        codeLength: 6
    },
    
    // Mensagens personalizáveis
    messages: {
        success: {
            save: 'Registro salvo com sucesso!',
            export: 'Dados exportados com sucesso!',
            scan: 'Código escaneado com sucesso!'
        },
        error: {
            save: 'Erro ao salvar registro',
            load: 'Erro ao carregar registros',
            validation: 'Por favor, preencha todos os campos obrigatórios',
            supabase: 'Erro de conexão com o banco de dados'
        },
        info: {
            noRecords: 'Nenhum registro encontrado',
            loading: 'Carregando...',
            searching: 'Buscando...'
        }
    }
};

// Função para mesclar configurações personalizadas
function mergeConfig(customConfig) {
    return {
        ...CONFIG,
        ...customConfig,
        supabase: { ...CONFIG.supabase, ...customConfig.supabase },
        app: { ...CONFIG.app, ...customConfig.app },
        ui: { ...CONFIG.ui, ...customConfig.ui },
        validation: { ...CONFIG.validation, ...customConfig.validation },
        export: { ...CONFIG.export, ...customConfig.export },
        scanner: { ...CONFIG.scanner, ...customConfig.scanner },
        messages: {
            success: { ...CONFIG.messages.success, ...customConfig.messages?.success },
            error: { ...CONFIG.messages.error, ...customConfig.messages?.error },
            info: { ...CONFIG.messages.info, ...customConfig.messages?.info }
        }
    };
}

// Exportar configuração
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, mergeConfig };
} else {
    window.CONFIG = CONFIG;
    window.mergeConfig = mergeConfig;
}
