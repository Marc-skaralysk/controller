# Como Executar a Aplicação

## 🚀 Opções para Executar

Como não há servidores web instalados no sistema, você tem algumas opções:

### Opção 1: Abrir Diretamente no Navegador (Mais Simples)

1. **Navegue até a pasta do projeto:**
   ```
   c:\Users\Attiva\Documents\Controller
   ```

2. **Clique duas vezes no arquivo `index.html`**
   - A aplicação abrirá diretamente no seu navegador padrão
   - Todas as funcionalidades funcionarão normalmente
   - Os dados de demonstração serão carregados automaticamente

### Opção 2: Instalar um Servidor Web

#### Python (Recomendado)
1. **Instalar Python:**
   - Baixe em: https://python.org/downloads/
   - Durante a instalação, marque "Add Python to PATH"

2. **Executar servidor:**
   ```bash
   cd c:\Users\Attiva\Documents\Controller
   python -m http.server 8000
   ```

3. **Acessar:** http://localhost:8000

#### Node.js
1. **Instalar Node.js:**
   - Baixe em: https://nodejs.org/

2. **Executar servidor:**
   ```bash
   cd c:\Users\Attiva\Documents\Controller
   npx serve . -p 8000
   ```

3. **Acessar:** http://localhost:8000

#### Live Server (VS Code)
1. **Instalar extensão Live Server no VS Code**
2. **Abrir a pasta do projeto no VS Code**
3. **Clicar com botão direito em `index.html`**
4. **Selecionar "Open with Live Server"**

## 🎯 Testando a Aplicação

### Dados de Demonstração
A aplicação já vem com dados de exemplo carregados automaticamente:
- 15 registros de movimentação
- Lista de usuários para autocompletar
- Lista de produtos para autocompletar

### Funcionalidades para Testar

1. **Registrar Nova Movimentação:**
   - Preencha todos os campos do formulário
   - Use o botão de scanner para gerar códigos automáticos
   - Teste o autocompletar nos campos de usuário e produto

2. **Buscar Registros:**
   - Use o campo de busca no canto superior direito
   - Teste buscar por nome de usuário, código ou produto
   - A busca é em tempo real

3. **Visualizar Registros:**
   - Veja os ícones coloridos para cada tipo de movimentação
   - Observe as datas e horários formatados
   - Teste o scroll suave na tabela

4. **Exportar Dados:**
   - Abra o console do navegador (F12)
   - Digite: `exportarDados()`
   - Um arquivo CSV será baixado

## ⚙️ Configuração do Supabase (Opcional)

Para usar banco de dados real:

1. **Criar conta no Supabase:** https://supabase.com
2. **Criar novo projeto**
3. **Executar SQL para criar tabela:** (veja README.md)
4. **Editar `app.js`:**
   ```javascript
   const SUPABASE_URL = 'sua-url-aqui';
   const SUPABASE_ANON_KEY = 'sua-chave-aqui';
   ```

## 🔧 Solução de Problemas

### Aplicação não carrega
- Verifique se todos os arquivos estão na mesma pasta
- Tente usar um navegador diferente
- Verifique o console do navegador (F12) para erros

### Autocompletar não funciona
- Verifique se o arquivo `demo-data.js` está carregando
- Digite pelo menos 2 caracteres para ativar

### Dados não aparecem
- A aplicação funciona offline com dados locais
- Se configurou Supabase, verifique as credenciais

## 📱 Compatibilidade

- ✅ Chrome, Firefox, Safari, Edge (versões recentes)
- ✅ Dispositivos móveis (design responsivo)
- ✅ Funciona offline
- ✅ Não requer instalação

## 🎨 Personalização

Para personalizar a aplicação:

1. **Cores e estilos:** Edite `styles.css`
2. **Configurações:** Edite `config.js`
3. **Dados de exemplo:** Edite `demo-data.js`
4. **Funcionalidades:** Edite `app.js`

---

**✨ A aplicação está pronta para uso! Comece abrindo o arquivo `index.html` no seu navegador.**