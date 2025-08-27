import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Settings, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <ButtonContainer
      as={motion.button}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => navigate('/admin')}
      title="Acesso Administrativo"
    >
      <IconContainer>
        <Settings size={24} />
        <Lock size={16} />
      </IconContainer>
      <ButtonText>Admin</ButtonText>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.button`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.xl};
  right: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.gradients.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xlarge};
  padding: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.large};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xlarge};
    transform: translateY(-4px);
  }
  
  @media (max-width: 768px) {
    bottom: ${({ theme }) => theme.spacing.lg};
    right: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const IconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg:last-child {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: ${({ theme }) => theme.colors.error};
    border-radius: 50%;
    padding: 2px;
  }
`;

const ButtonText = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default AdminButton;

