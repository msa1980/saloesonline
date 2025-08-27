import emailjs from '@emailjs/browser';

// Configurações do EmailJS
// IMPORTANTE: Substitua essas configurações pelas suas próprias do EmailJS
const EMAIL_CONFIG = {
  serviceId: 'service_xxxxxxx', // Substitua pelo seu Service ID
  templateId: 'template_xxxxxxx', // Substitua pelo seu Template ID
  publicKey: 'xxxxxxxxxxxxxxx', // Substitua pela sua Public Key
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
    // Inicializar EmailJS com a chave pública
    emailjs.init(EMAIL_CONFIG.publicKey);

    // Preparar os dados para o template
    const templateParams = {
      to_name: 'Administrador', // Nome do destinatário
      from_name: dados.nome,
      from_email: dados.email,
      phone: dados.telefone,
      address: dados.endereco || 'Não informado',
      message: dados.mensagem || 'Nenhuma mensagem adicional',
      reply_to: dados.email,
    };

    // Enviar email
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams
    );

    console.log('Email enviado com sucesso:', response);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};

// Função para validar configuração do EmailJS
export const isEmailConfigured = (): boolean => {
  return (
    EMAIL_CONFIG.serviceId !== 'service_xxxxxxx' &&
    EMAIL_CONFIG.templateId !== 'template_xxxxxxx' &&
    EMAIL_CONFIG.publicKey !== 'xxxxxxxxxxxxxxx'
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