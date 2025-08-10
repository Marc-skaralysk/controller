# Controle de Entrada e Saída de Materiais

Uma aplicação web responsiva para registrar e visualizar movimentações de produtos com etiquetas de código para identificação.

## 🚀 Funcionalidades

- **Formulário de Registro** com campos para usuário, produto, código e tipo de movimentação
- **Tabela de Registros** com visualização organizada e ícones intuitivos
- **Busca em Tempo Real** por nome de usuário, código ou produto
- **Interface Clean e Responsiva** com design moderno
- **Integração com Supabase** para persistência de dados
- **Exportação de Dados** para CSV

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: TailwindCSS
- **Ícones**: Material Design Icons
- **Backend**: Supabase
- **Banco de Dados**: PostgreSQL (via Supabase)

## 📋 Pré-requisitos

1. Conta no [Supabase](https://supabase.com)
2. Navegador web moderno
3. Servidor web local (opcional, para desenvolvimento)

## ⚙️ Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Clique em "New Project"
3. Preencha os dados do projeto:
   - Nome: `controle-materiais`
   - Senha do banco: (escolha uma senha segura)
   - Região: escolha a mais próxima

### 2. Criar Tabela

No painel do Supabase, vá para "Table Editor" e execute o seguinte SQL:

```sql
CREATE TABLE movimentacoes (
    id BIGSERIAL PRIMARY KEY,
    usuario TEXT NOT NULL,
    produto TEXT NOT NULL,
    codigo TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('Entrada', 'Saída', 'Produto Danificado')),
    data_hora TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_movimentacoes_usuario ON movimentacoes(usuario);
CREATE INDEX idx_movimentacoes_codigo ON movimentacoes(codigo);
CREATE INDEX idx_movimentacoes_data_hora ON movimentacoes(data_hora DESC);
```

### 3. Configurar RLS (Row Level Security)

```sql
-- Habilitar RLS
ALTER TABLE movimentacoes ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Permitir leitura pública" ON movimentacoes
    FOR SELECT USING (true);

-- Política para permitir inserção pública
CREATE POLICY "Permitir inserção pública" ON movimentacoes
    FOR INSERT WITH CHECK (true);
```

### 4. Obter Credenciais

1. Vá para "Settings" > "API"
2. Copie:
   - **Project URL**
   - **anon/public key**

### 5. Configurar a Aplicação

Edite o arquivo `app.js` e substitua:

```javascript
const SUPABASE_URL = 'sua-url-do-supabase';
const SUPABASE_ANON_KEY = 'sua-chave-anonima';
```

## 🚀 Como Usar

### 1. Executar a Aplicação

**Opção 1: Servidor Local**
```bash
# Com Python
python -m http.server 8000

# Com Node.js (npx)
npx serve .

# Com PHP
php -S localhost:8000
```

**Opção 2: Abrir Diretamente**
Abra o arquivo `index.html` diretamente no navegador.

### 2. Registrar Movimentação

1. Preencha todos os campos do formulário:
   - **Nome do Usuário**: Pessoa responsável pela movimentação
   - **Nome do Produto**: Descrição do item
   - **Código do Produto**: Identificador único (pode usar o botão de scan)
   - **Tipo de Movimentação**: Entrada, Saída ou Produto Danificado

2. Clique em "Registrar Movimentação"

### 3. Visualizar e Buscar

- Os registros aparecem automaticamente na tabela
- Use o campo de busca para filtrar por usuário, código ou produto
- A busca é em tempo real (enquanto você digita)

### 4. Exportar Dados

Abra o console do navegador (F12) e execute:
```javascript
exportarDados();
```

## 🎨 Características da Interface

- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Paleta Clean**: Tons de branco, cinza e azul
- **Ícones Intuitivos**:
  - 🟢 Seta verde para entrada
  - 🔴 Seta vermelha para saída
  - 🟡 Alerta amarelo para produto danificado
- **Animações Suaves**: Transições e efeitos hover
- **Tipografia Moderna**: Fonte Inter para melhor legibilidade

## 🔧 Funcionalidades Avançadas

### Scanner de Código
O botão de scanner atualmente gera códigos simulados. Para integrar com um scanner real:

1. Instale uma biblioteca de scanner (ex: QuaggaJS)
2. Substitua a função `handleScanCode()` no `app.js`
3. Configure permissões de câmera

### Autenticação
Para adicionar autenticação:

1. Configure Auth no Supabase
2. Adicione login/logout na interface
3. Modifique as políticas RLS para usar `auth.uid()`

## 📱 Modo Offline

A aplicação funciona offline usando dados locais quando o Supabase não está configurado ou disponível.

## 🐛 Solução de Problemas

### Erro de CORS
- Use um servidor web local em vez de abrir o arquivo diretamente
- Configure CORS no Supabase se necessário

### Dados não aparecem
- Verifique se as credenciais do Supabase estão corretas
- Confirme se a tabela foi criada corretamente
- Verifique o console do navegador para erros

### Performance lenta
- Considere implementar paginação para muitos registros
- Otimize consultas no Supabase

## 📄 Licença

Este projeto é de uso livre para fins educacionais e comerciais.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Abra uma issue ou envie um pull request.

---

**Desenvolvido com ❤️ para controle eficiente de materiais**