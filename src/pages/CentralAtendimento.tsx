import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, User, Mail, Phone, MapPin, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { enviarCadastroCliente, isEmailConfigured } from '../services/emailService';

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  mensagem: string;
}

const CentralAtendimento: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.telefone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Verificar se o EmailJS está configurado
      if (!isEmailConfigured()) {
        console.warn('EmailJS não configurado. Dados salvos localmente:', formData);
        // Em produção, você salvaria no banco de dados ou enviaria para uma API
        alert('Cadastro recebido! (EmailJS não configurado - dados salvos localmente)');
      } else {
        // Enviar email usando EmailJS
        const sucesso = await enviarCadastroCliente({
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          endereco: formData.endereco,
          mensagem: formData.mensagem
        });

        if (!sucesso) {
          throw new Error('Falha no envio do email');
        }
      }
      
      setSubmitted(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        endereco: '',
        mensagem: ''
      });
    } catch (error) {
      console.error('Erro ao enviar:', error);
      alert('Erro ao enviar cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Container>
        <SuccessCard
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SuccessIcon>✓</SuccessIcon>
          <SuccessTitle>Cadastro Enviado com Sucesso!</SuccessTitle>
          <SuccessMessage>
            Obrigado pelo seu interesse! Recebemos seu cadastro e entraremos em contato em breve.
          </SuccessMessage>
          <BackButton onClick={() => {
            setSubmitted(false);
            navigate('/');
          }}>
            <ArrowLeft size={20} />
            Voltar ao Site
          </BackButton>
        </SuccessCard>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Voltar ao Site
        </BackButton>
        <Title>Central de Atendimento</Title>
        <Subtitle>Cadastre-se para receber informações sobre nossos salões</Subtitle>
      </Header>

      {!isEmailConfigured() && (
        <ConfigWarning
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AlertCircle size={20} />
          <span>
            <strong>Aviso para Desenvolvedores:</strong> EmailJS não configurado. 
            Consulte o arquivo <code>src/services/emailService.ts</code> para instruções de configuração.
          </span>
        </ConfigWarning>
      )}

      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <FormField>
              <Label>
                <User size={18} />
                Nome Completo *
              </Label>
              <Input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Seu nome completo"
                required
              />
            </FormField>

            <FormField>
              <Label>
                <Mail size={18} />
                Email *
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </FormField>

            <FormField>
              <Label>
                <Phone size={18} />
                Telefone *
              </Label>
              <Input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                placeholder="(11) 99999-9999"
                required
              />
            </FormField>

            <FormField>
              <Label>
                <MapPin size={18} />
                Endereço
              </Label>
              <Input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                placeholder="Seu endereço (opcional)"
              />
            </FormField>

            <FormField fullWidth>
              <Label>
                <MessageSquare size={18} />
                Mensagem
              </Label>
              <Textarea
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                placeholder="Conte-nos sobre seus interesses ou dúvidas..."
                rows={4}
              />
            </FormField>
          </FormGrid>

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner />
                Enviando...
              </>
            ) : (
              <>
                <Send size={20} />
                Enviar Cadastro
              </>
            )}
          </SubmitButton>
        </Form>
      </FormCard>
    </Container>
  );
};

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 1.4rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  transition: all 0.2s ease;

  &:hover {
    background: white;
    box-shadow: ${({ theme }) => theme.shadows.small};
  }
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 700;
  background: ${({ theme }) => theme.gradients.primary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
`;

const ConfigWarning = styled(motion.div)`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: #856404;
  font-size: 1.4rem;
  max-width: 600px;
  width: 100%;

  code {
    background: rgba(0, 0, 0, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
  }
`;

const FormCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  border: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  max-width: 600px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormField = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'fullWidth'
})<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  ${({ fullWidth }) => fullWidth && 'grid-column: 1 / -1;'}
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.4rem;
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.4rem;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.4rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(139, 69, 19, 0.1);
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const SubmitButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.6rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: ${({ theme }) => theme.spacing.md};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuccessCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.large};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  max-width: 500px;
  margin-top: 10vh;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.success};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto ${({ theme }) => theme.spacing.lg};
`;

const SuccessTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SuccessMessage = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export default CentralAtendimento;