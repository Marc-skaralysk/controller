// Sistema de Controle de Usuários e Mercadorias
class SistemaControle {
    constructor() {
        this.usuarios = [];
        this.mercadorias = [];
        this.historico = [];
        this.usuarioAtual = null;
        this.mercadoriaEditando = null;
        this.grafico = null;
        
        this.inicializar();
    }
    
    inicializar() {
        this.carregarDados();
        this.configurarEventListeners();
        this.renderizarUsuarios();
        this.criarGrafico();
    }
    
    carregarDados() {
        // Carregar dados do localStorage ou usar dados demo
        const usuariosSalvos = localStorage.getItem('usuarios_sistema');
        const mercadoriasSalvas = localStorage.getItem('mercadorias_sistema');
        const historicoSalvo = localStorage.getItem('historico_sistema');
        
        if (usuariosSalvos) {
            this.usuarios = JSON.parse(usuariosSalvos);
        } else if (typeof DEMO_DATA !== 'undefined') {
            this.usuarios = DEMO_DATA.usuarios.map(nome => ({
                id: this.gerarId(),
                nome: nome,
                dataCriacao: new Date().toISOString()
            }));
            this.salvarUsuarios();
        }
        
        if (mercadoriasSalvas) {
            this.mercadorias = JSON.parse(mercadoriasSalvas);
        }
        
        if (historicoSalvo) {
            this.historico = JSON.parse(historicoSalvo);
        }
        
        this.atualizarValorTotal();
    }
    
    salvarUsuarios() {
        localStorage.setItem('usuarios_sistema', JSON.stringify(this.usuarios));
    }
    
    salvarMercadorias() {
        localStorage.setItem('mercadorias_sistema', JSON.stringify(this.mercadorias));
    }
    
    salvarHistorico() {
        localStorage.setItem('historico_sistema', JSON.stringify(this.historico));
    }
    
    gerarId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
    
    configurarEventListeners() {
        // Botão novo usuário
        const novoUsuarioBtn = document.getElementById('novoUsuarioBtn');
        if (novoUsuarioBtn) {
            novoUsuarioBtn.addEventListener('click', () => this.abrirModalNovoUsuario());
        }
        
        // Modal novo usuário
        const fecharModalUsuarioBtn = document.getElementById('fecharModalUsuarioBtn');
        const cancelarUsuarioBtn = document.getElementById('cancelarUsuarioBtn');
        const salvarUsuarioBtn = document.getElementById('salvarUsuarioBtn');
        
        if (fecharModalUsuarioBtn) {
            fecharModalUsuarioBtn.addEventListener('click', () => this.fecharModalNovoUsuario());
        }
        if (cancelarUsuarioBtn) {
            cancelarUsuarioBtn.addEventListener('click', () => this.fecharModalNovoUsuario());
        }
        if (salvarUsuarioBtn) {
            salvarUsuarioBtn.addEventListener('click', (e) => this.salvarUsuario(e));
        }
        
        // Modal mercadorias
        const fecharModalMercadoriasBtn = document.getElementById('fecharModalMercadoriasBtn');
        const novaMercadoriaBtn = document.getElementById('novaMercadoriaBtn');
        const exportarMercadoriasBtn = document.getElementById('exportarMercadoriasBtn');
        
        if (fecharModalMercadoriasBtn) {
            fecharModalMercadoriasBtn.addEventListener('click', () => this.fecharModalMercadorias());
        }
        if (novaMercadoriaBtn) {
            novaMercadoriaBtn.addEventListener('click', () => this.abrirModalNovaMercadoria());
        }
        if (exportarMercadoriasBtn) {
            exportarMercadoriasBtn.addEventListener('click', () => this.exportarMercadorias());
        }
        
        // Modal editar mercadoria
        const fecharModalEditarBtn = document.getElementById('fecharModalEditarBtn');
        const cancelarMercadoriaBtn = document.getElementById('cancelarMercadoriaBtn');
        const salvarMercadoriaBtn = document.getElementById('salvarMercadoriaBtn');
        
        if (fecharModalEditarBtn) {
            fecharModalEditarBtn.addEventListener('click', () => this.fecharModalEditarMercadoria());
        }
        if (cancelarMercadoriaBtn) {
            cancelarMercadoriaBtn.addEventListener('click', () => this.fecharModalEditarMercadoria());
        }
        if (salvarMercadoriaBtn) {
            salvarMercadoriaBtn.addEventListener('click', (e) => this.salvarMercadoria(e));
        }
        
        // Busca
        const campoBusca = document.getElementById('campoBusca');
        if (campoBusca) {
            campoBusca.addEventListener('input', (e) => this.filtrarUsuarios(e.target.value));
        }
        
        // Fechar modais com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharTodosModais();
            }
        });
        
        // Fechar modais clicando fora
        const modais = ['modalNovoUsuario', 'modalMercadorias', 'modalEditarMercadoria'];
        modais.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.fecharModal(modalId);
                    }
                });
            }
        });
    }
    
    renderizarUsuarios(filtro = '') {
        const tabela = document.getElementById('tabelaUsuarios');
        const contador = document.getElementById('contadorUsuarios');
        const contadorMercadorias = document.getElementById('contadorMercadorias');
        
        if (!tabela || !contador) return;
        
        let usuariosFiltrados = this.usuarios;
        if (filtro) {
            usuariosFiltrados = this.usuarios.filter(usuario => 
                usuario.nome.toLowerCase().includes(filtro.toLowerCase())
            );
        }
        
        contador.textContent = usuariosFiltrados.length;
        
        // Atualizar contador de mercadorias
        if (contadorMercadorias) {
            contadorMercadorias.textContent = this.mercadorias.length;
        }
        
        this.atualizarValorTotal();
        
        if (usuariosFiltrados.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                        <div class="flex flex-col items-center">
                            <span class="material-icons text-4xl mb-2 text-gray-300">person_off</span>
                            <p>Nenhum usuário encontrado</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tabela.innerHTML = usuariosFiltrados.map(usuario => {
            const mercadoriasUsuario = this.mercadorias.filter(m => m.usuarioId === usuario.id);
            const mercadoriasAtivas = mercadoriasUsuario.filter(m => m.status !== 'Danificado').length;
            const mercadoriasDanificadas = mercadoriasUsuario.filter(m => m.status === 'Danificado').length;
            const historicoUsuario = this.historico.filter(h => h.usuarioId === usuario.id);
            const ultimaAtividade = historicoUsuario.length > 0 
                ? new Date(Math.max(...historicoUsuario.map(h => new Date(h.dataHora)))).toLocaleDateString('pt-BR')
                : 'Nunca';
            
            const iconeAtencao = mercadoriasDanificadas > 0 ? '⚠️ ' : '';
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3">
                        <button class="text-blue-600 hover:text-blue-800 font-medium" 
                                onclick="sistema.abrirModalMercadorias('${usuario.id}')">
                            ${iconeAtencao}${usuario.nome}
                        </button>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">${usuario.departamento || 'Não informado'}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${mercadoriasAtivas}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${historicoUsuario.length}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${ultimaAtividade}</td>
                    <td class="px-4 py-3">
                        <button class="text-green-600 hover:text-green-800 mr-2" 
                                onclick="sistema.abrirModalMercadorias('${usuario.id}')" 
                                title="Gerenciar Mercadorias">
                            <span class="material-icons text-sm">inventory</span>
                        </button>
                        <button class="text-red-600 hover:text-red-800" 
                                onclick="sistema.excluirUsuario('${usuario.id}')" 
                                title="Excluir Usuário">
                            <span class="material-icons text-sm">delete</span>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    abrirModalNovoUsuario() {
        const modal = document.getElementById('modalNovoUsuario');
        const form = document.getElementById('usuarioForm');
        
        if (modal && form) {
            form.reset();
            modal.classList.remove('hidden');
            document.getElementById('nomeUsuario')?.focus();
        }
    }
    
    fecharModalNovoUsuario() {
        const modal = document.getElementById('modalNovoUsuario');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    salvarUsuario(e) {
        e.preventDefault();
        
        const nome = document.getElementById('nomeUsuario')?.value.trim();
        const departamento = document.getElementById('departamentoUsuario')?.value;
        
        if (!nome || !departamento) {
            this.mostrarToast('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        // Verificar se já existe
        if (this.usuarios.some(u => u.nome.toLowerCase() === nome.toLowerCase())) {
            this.mostrarToast('Já existe um usuário com este nome', 'error');
            return;
        }
        
        const novoUsuario = {
            id: this.gerarId(),
            nome: nome,
            departamento: departamento,
            dataCriacao: new Date().toISOString()
        };
        
        this.usuarios.push(novoUsuario);
        this.salvarUsuarios();
        this.renderizarUsuarios();
        this.fecharModalNovoUsuario();
        this.mostrarToast('Usuário criado com sucesso!', 'success');
        this.atualizarGrafico();
    }
    
    excluirUsuario(usuarioId) {
        const senha = prompt('Digite a senha para excluir este usuário:');
        if (senha !== 'aut1515') {
            this.mostrarToast('Senha incorreta!', 'error');
            return;
        }
        
        if (!confirm('Tem certeza que deseja excluir este usuário? Todas as mercadorias e histórico serão perdidos.')) {
            return;
        }
        
        this.usuarios = this.usuarios.filter(u => u.id !== usuarioId);
        this.mercadorias = this.mercadorias.filter(m => m.usuarioId !== usuarioId);
        this.historico = this.historico.filter(h => h.usuarioId !== usuarioId);
        
        this.salvarUsuarios();
        this.salvarMercadorias();
        this.salvarHistorico();
        this.renderizarUsuarios();
        this.mostrarToast('Usuário excluído com sucesso!', 'success');
        this.atualizarGrafico();
    }
    
    abrirModalMercadorias(usuarioId) {
        const usuario = this.usuarios.find(u => u.id === usuarioId);
        if (!usuario) return;
        
        this.usuarioAtual = usuario;
        
        const modal = document.getElementById('modalMercadorias');
        const titulo = document.getElementById('tituloModalMercadorias');
        
        if (modal && titulo) {
            titulo.textContent = `Mercadorias - ${usuario.nome}`;
            modal.classList.remove('hidden');
            this.renderizarMercadorias();
            this.renderizarHistorico();
        }
    }
    
    fecharModalMercadorias() {
        const modal = document.getElementById('modalMercadorias');
        if (modal) {
            modal.classList.add('hidden');
            this.usuarioAtual = null;
        }
    }
    
    renderizarMercadorias() {
        if (!this.usuarioAtual) return;
        
        const tabela = document.getElementById('tabelaMercadorias');
        if (!tabela) return;
        
        const mercadoriasUsuario = this.mercadorias.filter(m => m.usuarioId === this.usuarioAtual.id);
        
        if (mercadoriasUsuario.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="7" class="px-4 py-8 text-center text-gray-500">
                        <div class="flex flex-col items-center">
                            <span class="material-icons text-4xl mb-2 text-gray-300">inventory_2</span>
                            <p>Nenhuma mercadoria cadastrada</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tabela.innerHTML = mercadoriasUsuario.map(mercadoria => {
            const corStatus = this.getCorStatus(mercadoria.status);
            const ultimaMovimentacao = mercadoria.ultimaMovimentacao 
                ? new Date(mercadoria.ultimaMovimentacao).toLocaleDateString('pt-BR')
                : 'Nunca';
            const valorFormatado = mercadoria.valor ? `R$ ${mercadoria.valor.toFixed(2).replace('.', ',')}` : 'R$ 0,00';
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 font-medium text-gray-900">${mercadoria.nome}</td>
                    <td class="px-4 py-3">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${corStatus}">
                            ${mercadoria.status}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900 font-medium">${valorFormatado}</td>
                    <td class="px-4 py-3">
                        ${mercadoria.etiqueta ? this.getCorEtiqueta(mercadoria.etiqueta) : '<span class="text-gray-400">-</span>'}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">${ultimaMovimentacao}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${mercadoria.observacoes || '-'}</td>
                    <td class="px-4 py-3">
                        <button class="text-blue-600 hover:text-blue-800 mr-2" 
                                onclick="sistema.editarMercadoria('${mercadoria.id}')" 
                                title="Editar">
                            <span class="material-icons text-sm">edit</span>
                        </button>
                        <button class="text-red-600 hover:text-red-800" 
                                onclick="sistema.excluirMercadoria('${mercadoria.id}')" 
                                title="Excluir">
                            <span class="material-icons text-sm">delete</span>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    renderizarHistorico() {
        if (!this.usuarioAtual) return;
        
        const tabela = document.getElementById('tabelaHistorico');
        if (!tabela) return;
        
        const historicoUsuario = this.historico
            .filter(h => h.usuarioId === this.usuarioAtual.id)
            .sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
        
        if (historicoUsuario.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                        <div class="flex flex-col items-center">
                            <span class="material-icons text-4xl mb-2 text-gray-300">history</span>
                            <p>Nenhuma movimentação registrada</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tabela.innerHTML = historicoUsuario.map(item => {
            const data = new Date(item.dataHora);
            const dataFormatada = data.toLocaleDateString('pt-BR');
            const horaFormatada = data.toLocaleTimeString('pt-BR');
            
            // Usar valores históricos salvos ou buscar valores atuais como fallback
            let statusEtiqueta = '-';
            
            if (item.statusHistorico) {
                const status = item.statusHistorico;
                const etiqueta = item.etiquetaHistorico;
                const corStatus = this.getCorStatus(status);
                
                if (etiqueta) {
                    const corEtiqueta = this.getCorEtiqueta(etiqueta);
                    statusEtiqueta = `
                        <div class="flex flex-col gap-1">
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${corStatus}">${status}</span>
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style="${corEtiqueta}">${etiqueta}</span>
                        </div>
                    `;
                } else {
                    statusEtiqueta = `<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${corStatus}">${status}</span>`;
                }
            } else {
                // Fallback para registros antigos - buscar mercadoria atual
                const mercadoria = this.mercadorias.find(m => m.nome === item.mercadoria && m.usuarioId === item.usuarioId);
                if (mercadoria) {
                    const status = mercadoria.status;
                    const etiqueta = mercadoria.etiqueta;
                    const corStatus = this.getCorStatus(status);
                    
                    if (etiqueta) {
                        const corEtiqueta = this.getCorEtiqueta(etiqueta);
                        statusEtiqueta = `
                            <div class="flex flex-col gap-1">
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${corStatus}">${status}</span>
                                <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" style="${corEtiqueta}">${etiqueta}</span>
                            </div>
                        `;
                    } else {
                        statusEtiqueta = `<span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full ${corStatus}">${status}</span>`;
                    }
                }
            }
            
            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">
                        <div>${dataFormatada}</div>
                        <div class="text-xs text-gray-500">${horaFormatada}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">${item.mercadoria}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${statusEtiqueta}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${item.acao}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">${item.observacoes || '-'}</td>
                </tr>
            `;
        }).join('');
    }
    
    abrirModalNovaMercadoria() {
        this.mercadoriaEditando = null;
        const modal = document.getElementById('modalEditarMercadoria');
        const titulo = document.getElementById('tituloModalEditar');
        const form = document.getElementById('mercadoriaForm');
        
        if (modal && titulo && form) {
            titulo.textContent = 'Nova Mercadoria';
            form.reset();
            modal.classList.remove('hidden');
            document.getElementById('nomeMercadoria')?.focus();
        }
    }
    
    editarMercadoria(mercadoriaId) {
        const mercadoria = this.mercadorias.find(m => m.id === mercadoriaId);
        if (!mercadoria) return;
        
        this.mercadoriaEditando = mercadoria;
        
        const modal = document.getElementById('modalEditarMercadoria');
        const titulo = document.getElementById('tituloModalEditar');
        
        if (modal && titulo) {
            titulo.textContent = 'Editar Mercadoria';
            
            // Preencher formulário
            document.getElementById('nomeMercadoria').value = mercadoria.nome;
            document.getElementById('statusMercadoria').value = mercadoria.status;
            document.getElementById('valorMercadoria').value = mercadoria.valor || 0;
            document.getElementById('observacoesMercadoria').value = mercadoria.observacoes || '';
            document.getElementById('etiquetaMercadoria').value = mercadoria.etiqueta || '';
            document.getElementById('codigoEtiqueta').value = mercadoria.codigoEtiqueta || '';
            
            modal.classList.remove('hidden');
        }
    }
    
    fecharModalEditarMercadoria() {
        const modal = document.getElementById('modalEditarMercadoria');
        if (modal) {
            modal.classList.add('hidden');
            this.mercadoriaEditando = null;
        }
    }
    
    salvarMercadoria(e) {
        e.preventDefault();
        
        if (!this.usuarioAtual) return;
        
        const nome = document.getElementById('nomeMercadoria')?.value.trim();
        const status = document.getElementById('statusMercadoria')?.value;
        const valor = parseFloat(document.getElementById('valorMercadoria')?.value) || 0;
        const observacoes = document.getElementById('observacoesMercadoria')?.value.trim();
        const etiqueta = document.getElementById('etiquetaMercadoria')?.value;
        const codigoEtiqueta = document.getElementById('codigoEtiqueta')?.value.trim();
        
        if (!nome || !status) {
            this.mostrarToast('Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        const agora = new Date().toISOString();
        
        if (this.mercadoriaEditando) {
            // Editar mercadoria existente
            const statusAnterior = this.mercadoriaEditando.status;
            const etiquetaAnterior = this.mercadoriaEditando.etiqueta;
            
            this.mercadoriaEditando.nome = nome;
            this.mercadoriaEditando.status = status;
            this.mercadoriaEditando.valor = valor;
            this.mercadoriaEditando.observacoes = observacoes;
            this.mercadoriaEditando.etiqueta = etiqueta;
            this.mercadoriaEditando.codigoEtiqueta = codigoEtiqueta;
            this.mercadoriaEditando.ultimaMovimentacao = agora;
            
            // Registrar no histórico se o status mudou
            if (statusAnterior !== status) {
                this.adicionarHistorico({
                    usuarioId: this.usuarioAtual.id,
                    mercadoria: nome,
                    acao: `Status alterado: ${statusAnterior} → ${status}`,
                    observacoes: observacoes,
                    dataHora: agora,
                    statusHistorico: status,
                    etiquetaHistorico: etiqueta
                });
            }
            
            // Registrar no histórico se a etiqueta mudou
            if (etiquetaAnterior !== etiqueta) {
                if (etiqueta && !etiquetaAnterior) {
                    // Etiqueta adicionada
                    this.adicionarHistorico({
                        usuarioId: this.usuarioAtual.id,
                        mercadoria: nome,
                        acao: `Etiqueta adicionada: ${etiqueta}`,
                        observacoes: observacoes,
                        dataHora: agora,
                        statusHistorico: status,
                        etiquetaHistorico: etiqueta
                    });
                } else if (!etiqueta && etiquetaAnterior) {
                    // Etiqueta removida
                    this.adicionarHistorico({
                        usuarioId: this.usuarioAtual.id,
                        mercadoria: nome,
                        acao: `Etiqueta removida: ${etiquetaAnterior}`,
                        observacoes: observacoes,
                        dataHora: agora,
                        statusHistorico: status,
                        etiquetaHistorico: etiqueta
                    });
                } else if (etiqueta && etiquetaAnterior && etiqueta !== etiquetaAnterior) {
                    // Etiqueta alterada
                    this.adicionarHistorico({
                        usuarioId: this.usuarioAtual.id,
                        mercadoria: nome,
                        acao: `Etiqueta alterada: ${etiquetaAnterior} → ${etiqueta}`,
                        observacoes: observacoes,
                        dataHora: agora,
                        statusHistorico: status,
                        etiquetaHistorico: etiqueta
                    });
                }
            }
            
            this.mostrarToast('Mercadoria atualizada com sucesso!', 'success');
        } else {
            // Nova mercadoria
            const novaMercadoria = {
                id: this.gerarId(),
                usuarioId: this.usuarioAtual.id,
                nome: nome,
                status: status,
                valor: valor,
                observacoes: observacoes,
                etiqueta: etiqueta,
                codigoEtiqueta: codigoEtiqueta,
                dataCriacao: agora,
                ultimaMovimentacao: agora
            };
            
            this.mercadorias.push(novaMercadoria);
            
            // Registrar no histórico
            let acaoCompleta = `Mercadoria criada com status: ${status}`;
            if (etiqueta) {
                acaoCompleta += ` e etiqueta: ${etiqueta}`;
            }
            
            this.adicionarHistorico({
                usuarioId: this.usuarioAtual.id,
                mercadoria: nome,
                acao: acaoCompleta,
                observacoes: observacoes,
                dataHora: agora,
                statusHistorico: status,
                etiquetaHistorico: etiqueta
            });
            
            this.mostrarToast('Mercadoria criada com sucesso!', 'success');
        }
        
        this.salvarMercadorias();
        this.renderizarMercadorias();
        this.renderizarHistorico();
        this.renderizarUsuarios();
        this.atualizarValorTotal();
        this.fecharModalEditarMercadoria();
        this.atualizarGrafico();
    }
    
    excluirMercadoria(mercadoriaId) {
        const senha = prompt('Digite a senha para excluir esta mercadoria:');
        if (senha !== 'aut1515') {
            this.mostrarToast('Senha incorreta!', 'error');
            return;
        }
        
        if (!confirm('Tem certeza que deseja excluir esta mercadoria?')) {
            return;
        }
        
        const mercadoria = this.mercadorias.find(m => m.id === mercadoriaId);
        if (mercadoria) {
            this.mercadorias = this.mercadorias.filter(m => m.id !== mercadoriaId);
            
            // Registrar no histórico
            this.adicionarHistorico({
                usuarioId: mercadoria.usuarioId,
                mercadoria: mercadoria.nome,
                acao: 'Mercadoria excluída',
                observacoes: 'Mercadoria removida do sistema',
                dataHora: new Date().toISOString(),
                statusHistorico: mercadoria.status,
                etiquetaHistorico: mercadoria.etiqueta
            });
            
            this.salvarMercadorias();
            this.renderizarMercadorias();
            this.renderizarHistorico();
            this.renderizarUsuarios();
            this.atualizarValorTotal();
            this.mostrarToast('Mercadoria excluída com sucesso!', 'success');
            this.atualizarGrafico();
        }
    }
    
    adicionarHistorico(item) {
        this.historico.push({
            id: this.gerarId(),
            ...item
        });
        this.salvarHistorico();
    }
    
    exportarMercadorias() {
        if (!this.usuarioAtual) return;
        
        const mercadoriasUsuario = this.mercadorias.filter(m => m.usuarioId === this.usuarioAtual.id);
        
        if (mercadoriasUsuario.length === 0) {
            this.mostrarToast('Nenhuma mercadoria para exportar', 'warning');
            return;
        }
        
        const csv = this.gerarCSV(mercadoriasUsuario.map(m => ({
            'Mercadoria': m.nome,
            'Status': m.status,
            'Observações': m.observacoes || '',
            'Data Criação': new Date(m.dataCriacao).toLocaleDateString('pt-BR'),
            'Última Movimentação': m.ultimaMovimentacao ? new Date(m.ultimaMovimentacao).toLocaleDateString('pt-BR') : 'Nunca'
        })));
        
        this.downloadCSV(csv, `mercadorias_${this.usuarioAtual.nome.replace(/\s+/g, '_')}.csv`);
    }
    
    filtrarUsuarios(termo) {
        this.renderizarUsuarios(termo);
    }
    
    getCorStatus(status) {
        const cores = {
            'Disponível': 'bg-green-100 text-green-800',
            'Em Uso': 'bg-blue-100 text-blue-800',
            'Manutenção': 'bg-yellow-100 text-yellow-800',
            'Danificado': 'bg-red-100 text-red-800',
            'Saída': 'bg-orange-100 text-orange-800',
            'Entrada': 'bg-purple-100 text-purple-800',
            'Volta Manutenção': 'bg-indigo-100 text-indigo-800'
        };
        return cores[status] || 'bg-gray-100 text-gray-800';
    }
    
    getCorEtiqueta(etiqueta) {
        const cores = {
            'Saiu-OK': 'bg-green-100 text-green-800',
            'Retornou-OK': 'bg-blue-100 text-blue-800',
            'Retornou-Danificado': 'bg-red-100 text-red-800'
        };
        
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cores[etiqueta] || 'bg-gray-100 text-gray-800'}">${etiqueta}</span>`;
    }
    
    criarGrafico() {
        const canvas = document.getElementById('graficoMovimentacoes');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Dados dos últimos 30 dias
        const hoje = new Date();
        const dados = [];
        const labels = [];
        
        for (let i = 29; i >= 0; i--) {
            const data = new Date(hoje);
            data.setDate(data.getDate() - i);
            
            const dataStr = data.toISOString().split('T')[0];
            const movimentacoesDia = this.historico.filter(h => 
                h.dataHora.split('T')[0] === dataStr
            ).length;
            
            labels.push(data.getDate().toString());
            dados.push(movimentacoesDia);
        }
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configurações do gráfico
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        const maxValue = Math.max(...dados, 1);
        
        // Desenhar eixos
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Eixo Y
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();
        
        // Eixo X
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Desenhar barras
        const barWidth = chartWidth / dados.length;
        ctx.fillStyle = '#3b82f6';
        
        dados.forEach((valor, index) => {
            const barHeight = (valor / maxValue) * chartHeight;
            const x = padding + (index * barWidth) + (barWidth * 0.1);
            const y = canvas.height - padding - barHeight;
            const width = barWidth * 0.8;
            
            ctx.fillRect(x, y, width, barHeight);
            
            // Labels do eixo X
            if (index % 5 === 0) {
                ctx.fillStyle = '#6b7280';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(labels[index], x + width/2, canvas.height - padding + 15);
                ctx.fillStyle = '#3b82f6';
            }
        });
        
        // Labels do eixo Y
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * i);
            const y = canvas.height - padding - (chartHeight / 5) * i;
            ctx.fillText(value.toString(), padding - 10, y + 4);
        }
    }
    
    atualizarGrafico() {
        this.criarGrafico();
        this.criarGraficoDanificados();
    }
    
    criarGraficoDanificados() {
        const canvas = document.getElementById('graficoDanificados');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Calcular valores totais
        const valorTotal = this.mercadorias.reduce((total, m) => total + (m.valor || 0), 0);
        const valorDanificados = this.mercadorias
            .filter(m => m.status === 'Danificado')
            .reduce((total, m) => total + (m.valor || 0), 0);
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Configurações do gráfico
        const padding = 60;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        const maxValor = Math.max(valorTotal, 1);
        
        // Desenhar eixos
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Eixo Y
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, canvas.height - padding);
        ctx.stroke();
        
        // Eixo X
        ctx.beginPath();
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.stroke();
        
        // Configurações das barras
        const barWidth = chartWidth * 0.3;
        const barSpacing = chartWidth * 0.1;
        
        // Barra do valor total (verde)
        const barHeightTotal = (valorTotal / maxValor) * chartHeight;
        const xTotal = padding + barSpacing;
        const yTotal = canvas.height - padding - barHeightTotal;
        
        ctx.fillStyle = '#10b981';
        ctx.fillRect(xTotal, yTotal, barWidth, barHeightTotal);
        
        // Barra do valor danificado (vermelho)
        const barHeightDanificado = (valorDanificados / maxValor) * chartHeight;
        const xDanificado = xTotal + barWidth + barSpacing;
        const yDanificado = canvas.height - padding - barHeightDanificado;
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(xDanificado, yDanificado, barWidth, barHeightDanificado);
        
        // Labels das barras
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        // Label valor total
        ctx.fillText('Valor Total', xTotal + barWidth/2, canvas.height - padding + 20);
        ctx.fillText(`R$ ${valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, xTotal + barWidth/2, yTotal - 10);
        
        // Label valor danificado
        ctx.fillText('Danificados', xDanificado + barWidth/2, canvas.height - padding + 20);
        ctx.fillText(`R$ ${valorDanificados.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`, xDanificado + barWidth/2, yDanificado - 10);
        
        // Percentual de produtos danificados
        const percentualDanificados = valorTotal > 0 ? (valorDanificados / valorTotal * 100) : 0;
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${percentualDanificados.toFixed(1)}% do valor total`, canvas.width / 2, padding - 20);
        
        // Legenda
        ctx.fillStyle = '#10b981';
        ctx.fillRect(padding, 15, 15, 10);
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('Valor Total', padding + 20, 24);
        
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(padding + 120, 15, 15, 10);
        ctx.fillStyle = '#6b7280';
        ctx.fillText('Danificados', padding + 140, 24);
        
        // Labels do eixo Y (valores)
        ctx.fillStyle = '#6b7280';
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 4; i++) {
            const value = (maxValor / 4) * i;
            const y = canvas.height - padding - (chartHeight / 4) * i;
            ctx.fillText(`R$ ${value.toLocaleString('pt-BR', {maximumFractionDigits: 0})}`, padding - 10, y + 3);
        }
    }
    
    fecharTodosModais() {
        const modais = ['modalNovoUsuario', 'modalMercadorias', 'modalEditarMercadoria'];
        modais.forEach(modalId => this.fecharModal(modalId));
    }
    
    fecharModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
        
        if (modalId === 'modalMercadorias') {
            this.usuarioAtual = null;
        } else if (modalId === 'modalEditarMercadoria') {
            this.mercadoriaEditando = null;
        }
    }
    
    atualizarValorTotal() {
        const valorTotalElement = document.getElementById('valorTotalMercadorias');
        const valorDanificadosElement = document.getElementById('valorDanificados');
        if (!valorTotalElement) return;
        
        const valorTotal = this.mercadorias.reduce((total, mercadoria) => {
            return total + (mercadoria.valor || 0);
        }, 0);
        
        const valorDanificados = this.mercadorias
            .filter(mercadoria => mercadoria.status === 'Danificado')
            .reduce((total, mercadoria) => {
                return total + (mercadoria.valor || 0);
            }, 0);
        
        valorTotalElement.textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
        
        if (valorDanificadosElement) {
            valorDanificadosElement.textContent = `R$ ${valorDanificados.toFixed(2).replace('.', ',')}`;
        }
    }
    
    gerarCSV(dados) {
        if (dados.length === 0) return '';
        
        const headers = Object.keys(dados[0]);
        const csvContent = [
            headers.join(','),
            ...dados.map(row => 
                headers.map(header => 
                    `"${(row[header] || '').toString().replace(/"/g, '""')}"`
                ).join(',')
            )
        ].join('\n');
        
        return csvContent;
    }
    
    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    mostrarToast(mensagem, tipo = 'info') {
        // Remover toast existente
        const toastExistente = document.querySelector('.toast');
        if (toastExistente) {
            toastExistente.remove();
        }
        
        const cores = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast fixed top-4 right-4 ${cores[tipo]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-transform duration-300 translate-x-full`;
        toast.textContent = mensagem;
        
        document.body.appendChild(toast);
        
        // Animar entrada
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Inicializar sistema quando DOM estiver carregado
let sistema;
document.addEventListener('DOMContentLoaded', function() {
    sistema = new SistemaControle();
});