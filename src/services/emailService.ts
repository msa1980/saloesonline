import emailjs from '@emailjs/browser';

// Configurações do EmailJS
const EMAIL_CONFIG = {
  serviceId: 'service_w5g2jch',
  templateId: 'template_x1gx44o', 
  publicKey: 'w2Io_MJvyX9tKv2PQ',
  privateKey: 'oIzRWOTpNQOQ7flPTN47w', // Private Key para uso no servidor se necessário
};

export interface ClienteData {
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  mensagem?: string;
}

export const enviarCadastroCliente = async (dados: ClienteData): Promise<boolean> => {
  try {
    // Validar dados obrigatórios
    if (!dados.nome || !dados.email || !dados.telefone) {
      throw new Error('Dados obrigatórios não fornecidos (nome, email, telefone)');
    }

    // Validar configuração do EmailJS
    if (!EMAIL_CONFIG.serviceId || !EMAIL_CONFIG.templateId || !EMAIL_CONFIG.publicKey) {
      throw new Error('Configuração do EmailJS incompleta');
    }

    // Inicializar EmailJS com a chave pública
    emailjs.init(EMAIL_CONFIG.publicKey);

    // Preparar os dados para o template
    const templateParams = {
      to_name: 'Administrador',
      from_name: dados.nome,
      from_email: dados.email,
      phone: dados.telefone,
      address: dados.endereco || 'Não informado',
      message: dados.mensagem || 'Nenhuma mensagem adicional',
      reply_to: dados.email,
    };

    console.log('Enviando email com parâmetros:', {
      serviceId: EMAIL_CONFIG.serviceId,
      templateId: EMAIL_CONFIG.templateId,
      templateParams
    });

    // Enviar email
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams
    );

    console.log('Email enviado com sucesso:', response);
    return true;
  } catch (error: any) {
    console.error('Erro detalhado ao enviar email:', {
      message: error.message,
      status: error.status,
      text: error.text,
      error: error
    });
    
    // Verificar tipos específicos de erro
    if (error.status === 400) {
      console.error('Erro 400: Parâmetros inválidos ou template não encontrado');
    } else if (error.status === 401) {
      console.error('Erro 401: Chave pública inválida ou não autorizada');
    } else if (error.status === 404) {
      console.error('Erro 404: Service ID ou Template ID não encontrado');
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      console.error('Erro de conectividade: Verifique sua conexão com a internet');
    }
    
    return false;
  }
};

// Função para validar configuração do EmailJS
export const isEmailConfigured = (): boolean => {
  return (
    EMAIL_CONFIG.serviceId !== '' &&
    EMAIL_CONFIG.templateId !== '' &&
    EMAIL_CONFIG.publicKey !== ''
  );
};

// Instruções para configurar o EmailJS:
/*
1. Acesse https://www.emailjs.com/
2. Crie uma conta gratuita
3. Crie um novo serviço de email (Gmail, Outlook, etc.)
4. Crie um template de email com as seguintes variáveis:
   - {{to_name}} - Nome do destinatário
   - {{from_name}} - Nome do cliente
   - {{from_email}} - Email do cliente
   - {{phone}} - Telefone do cliente
   - {{address}} - Endereço do cliente
   - {{message}} - Mensagem do cliente
   - {{reply_to}} - Email para resposta
5. Copie o Service ID, Template ID e Public Key
6. Substitua as configurações acima pelas suas

Exemplo de template de email:

Assunto: Novo Cadastro de Cliente - Salões Online

Olá {{to_name}},

Você recebeu um novo cadastro de cliente:

Nome: {{from_name}}
Email: {{from_email}}
Telefone: {{phone}}
Endereço: {{address}}

Mensagem:
{{message}}

Atenciosamente,
Sistema Salões Online
*/