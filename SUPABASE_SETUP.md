# 🚀 Configuração do Supabase

Este guia irá te ajudar a conectar seu projeto ao Supabase para resolver o problema das imagens que são deletadas a cada commit.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Node.js instalado
- Projeto React funcionando

## 🔧 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha:
   - **Name**: `saloes-rh` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima (ex: South America)
6. Clique em "Create new project"
7. Aguarde alguns minutos para o projeto ser criado

### 2. Configurar Banco de Dados

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `supabase-setup.sql`
4. Cole no editor SQL
5. Clique em "Run" para executar o script
6. Verifique se não há erros na execução

### 3. Obter Credenciais

1. No painel do Supabase, vá para **Settings** > **API**
2. Copie as seguintes informações:
   - **Project URL** (algo como: `https://abc123.supabase.co`)
   - **anon/public key** (chave longa que começa com `eyJ...`)

### 4. Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores placeholder pelas suas credenciais:

```env
REACT_APP_SUPABASE_URL=https://seu-projeto-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Testar a Conexão

1. Reinicie o servidor de desenvolvimento:
```bash
npm start
```

2. Abra o console do navegador (F12)
3. Verifique se não há erros relacionados ao Supabase
4. Teste criando um novo salão
5. Verifique se os dados aparecem no painel do Supabase em **Table Editor**

## 📁 Estrutura das Tabelas

### Tabela `saloes`
- `id` (UUID) - Chave primária
- `nome` (VARCHAR) - Nome do salão
- `endereco` (TEXT) - Endereço completo
- `telefone` (VARCHAR) - Telefone de contato
- `email` (VARCHAR) - Email de contato
- `logo_url` (TEXT) - URL do logo no Supabase Storage
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

### Tabela `clientes`
- `id` (UUID) - Chave primária
- `nome` (VARCHAR) - Nome do cliente
- `email` (VARCHAR) - Email do cliente
- `telefone` (VARCHAR) - Telefone do cliente
- `endereco` (TEXT) - Endereço do cliente
- `salao_id` (UUID) - Referência ao salão
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

## 🖼️ Upload de Logos

O sistema agora suporta upload de logos diretamente para o Supabase Storage:

- **Bucket**: `saloes-logos`
- **Pasta**: `logos/`
- **Formatos suportados**: JPG, PNG, SVG, WebP
- **Tamanho máximo**: Configurável (padrão: 5MB)

### Como usar:
1. No formulário de criação/edição de salão
2. Clique no campo de logo
3. Selecione uma imagem
4. O upload será feito automaticamente
5. A URL será salva no banco de dados

## 🔒 Segurança

### Row Level Security (RLS)
O projeto está configurado com políticas básicas que permitem todas as operações. Para produção, considere implementar políticas mais restritivas.

### Políticas Atuais:
- **Salões**: Permitir todas as operações
- **Clientes**: Permitir todas as operações
- **Storage**: Permitir upload, visualização, atualização e exclusão de logos

## 🚨 Solução de Problemas

### Erro: "Supabase não configurado"
- Verifique se as variáveis no `.env.local` estão corretas
- Certifique-se de que não há espaços extras
- Reinicie o servidor após alterar o `.env.local`

### Erro: "Failed to fetch"
- Verifique sua conexão com a internet
- Confirme se a URL do projeto está correta
- Verifique se o projeto Supabase está ativo

### Erro: "Invalid API key"
- Confirme se você copiou a chave `anon/public` correta
- Verifique se não há caracteres extras na chave

### Logos não aparecem
- Verifique se o bucket `saloes-logos` foi criado
- Confirme se as políticas de storage foram aplicadas
- Teste o upload de uma nova imagem

## 📊 Monitoramento

No painel do Supabase você pode:
- Ver dados em tempo real em **Table Editor**
- Monitorar uploads em **Storage**
- Verificar logs em **Logs**
- Acompanhar uso em **Settings** > **Usage**

## 🎯 Próximos Passos

Após a configuração básica, você pode:
1. Implementar autenticação de usuários
2. Adicionar mais campos às tabelas
3. Criar relatórios e dashboards
4. Implementar backup automático
5. Configurar notificações em tempo real

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs do console do navegador
2. Consulte a [documentação oficial do Supabase](https://supabase.com/docs)
3. Verifique se todas as etapas foram seguidas corretamente

---

✅ **Parabéns!** Seu projeto agora está conectado ao Supabase e as imagens não serão mais perdidas nos commits!