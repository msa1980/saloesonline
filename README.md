# 🎨 Franquia de Salões - Aplicação Web

Uma aplicação web profissional e elegante para gerenciar uma franquia de salões de beleza, com página pública e painel administrativo completo.

## ✨ Características

### 🏠 Página Pública
- **Header elegante** com logo e informações de contato
- **Seção hero** com gradiente e animações
- **Grid responsivo** de salões (6x6)
- **Cards de salão** com:
  - Logo do salão
  - Nome e avaliação
  - Endereço clicável que abre Google Maps
  - Telefone e horário
  - Lista de serviços
  - Botão para visitar o site
- **Botão de busca** para encontrar salões por endereço
- **Botão flutuante** de acesso administrativo

### 🔐 Painel Administrativo
- **Sistema de login** seguro
- **Dashboard completo** com:
  - Lista de todos os salões
  - Busca e filtros
  - Adicionar novos salões
  - Editar salões existentes
  - Ativar/desativar salões
  - Excluir salões
- **Interface responsiva** e intuitiva

## 🚀 Tecnologias Utilizadas

- **React 18** com TypeScript
- **Styled Components** para estilização
- **Framer Motion** para animações
- **React Router** para navegação
- **Lucide React** para ícones
- **Context API** para gerenciamento de estado
- **Google Maps API** para localização

## 📦 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/msa1980/saloesonline.git
cd saloesonline
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**
```bash
npm start
```

4. **Abra no navegador:**
```
http://localhost:3000
```

## 🔑 Acesso Administrativo

Para acessar o painel administrativo:

1. Clique no botão flutuante "Admin" no canto inferior direito
2. Use as credenciais de demonstração:
   - **Usuário:** `admin`
   - **Senha:** `admin123`

## 🎯 Funcionalidades Principais

### Página Pública
- ✅ Exibição de salões em grid responsivo
- ✅ Cards com informações completas de cada salão
- ✅ Endereços clicáveis que abrem Google Maps
- ✅ Busca por endereço com popup interativo
- ✅ Botões para visitar sites dos salões
- ✅ Design moderno e profissional
- ✅ Animações suaves e elegantes

### Painel Administrativo
- ✅ Autenticação segura
- ✅ CRUD completo de salões
- ✅ Busca e filtros em tempo real
- ✅ Ativação/desativação de salões
- ✅ Interface intuitiva e responsiva
- ✅ Validação de formulários
- ✅ Suporte a múltiplos serviços por salão

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- 📱 Dispositivos móveis
- 💻 Tablets
- 🖥️ Desktops

## 🎨 Design System

### Cores
- **Primária:** Rosa (#FF6B9D)
- **Secundária:** Roxo (#8B5CF6)
- **Acento:** Amarelo (#F59E0B)
- **Sucesso:** Verde (#10B981)
- **Erro:** Vermelho (#EF4444)

### Tipografia
- **Títulos:** Playfair Display (elegante)
- **Corpo:** Inter (moderna e legível)

### Animações
- Transições suaves (0.3s)
- Hover effects
- Animações de entrada com Framer Motion
- Micro-interações

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm build` - Cria a versão de produção
- `npm test` - Executa os testes
- `npm eject` - Ejetar configurações (irreversível)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx     # Cabeçalho da aplicação
│   ├── SalaoCard.tsx  # Card de cada salão
│   └── AdminButton.tsx # Botão de acesso admin
├── contexts/           # Contextos React
│   └── SaloesContext.tsx # Gerenciamento de estado
├── pages/              # Páginas da aplicação
│   ├── HomePage.tsx    # Página principal
│   ├── AdminLogin.tsx  # Login administrativo
│   └── AdminDashboard.tsx # Painel admin
├── styles/             # Estilos globais
│   ├── GlobalStyle.ts  # Estilos CSS globais
│   └── theme.ts        # Tema e variáveis
├── App.tsx             # Componente principal
└── index.tsx           # Ponto de entrada
```

## 🌟 Recursos Avançados

- **Gradientes modernos** para elementos visuais
- **Sombras e elevações** para profundidade
- **Animações de entrada** para cada salão
- **Hover effects** interativos
- **Backdrop filters** para transparências
- **Grid responsivo** que se adapta a qualquer tela
- **Integração com Google Maps** para localização
- **Busca inteligente** por nome e endereço

## 🚀 Deploy

Para fazer o deploy em produção:

1. **Build da aplicação:**
```bash
npm run build
```

2. **Os arquivos estarão na pasta `build/`**
3. **Faça upload para seu servidor web**

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se você tiver alguma dúvida ou problema, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para criar uma experiência incrível para franquias de salões!**
