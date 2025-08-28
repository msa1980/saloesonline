import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { MapPin, Phone, ExternalLink, Star } from 'lucide-react';
import { Salao } from '../contexts/SaloesContext';

interface SalaoCardProps {
  salao: Salao;
}

const SalaoCard: React.FC<SalaoCardProps> = ({ salao }) => {

  return (
    <CardContainer
      as={motion.div}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardHeader>
        <LogoContainer>
          <LogoPlaceholder>
            {salao.logo ? (
              <LogoImage src={salao.logo} alt={`Logo ${salao.nome}`} />
            ) : (
              <LogoText>{salao.nome.charAt(0)}</LogoText>
            )}
          </LogoPlaceholder>
        </LogoContainer>
        
        <CardTitle>{salao.nome}</CardTitle>
        
        <RatingContainer>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={16} fill="#F59E0B" color="#F59E0B" />
          ))}
          <RatingText>5.0</RatingText>
        </RatingContainer>
      </CardHeader>

      <CardContent>
        <InfoItem>
          <MapPin size={18} />
          <AddressLink
            onClick={() => {
              const encodedAddress = encodeURIComponent(salao.endereco);
              window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
            }}
          >
            {salao.endereco}
          </AddressLink>
        </InfoItem>
        
        <InfoItem>
          <Phone size={18} />
          <span>{salao.telefone}</span>
        </InfoItem>
        
        <ServicesContainer>
          <ServicesTitle>Serviços:</ServicesTitle>
          <ServicesList>
            {salao.servicos?.map((servico, index) => (
              <ServiceTag key={index}>{servico}</ServiceTag>
            )) || <ServiceTag>Nenhum serviço cadastrado</ServiceTag>}
          </ServicesList>
        </ServicesContainer>
        
        <Description>{salao.descricao}</Description>
      </CardContent>

      <CardActions>
        <VisitButton
          href={salao.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ExternalLink size={18} />
          Visitar Site
        </VisitButton>
      </CardActions>
    </CardContainer>
  );
};

const CardContainer = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};
  height: 600px;
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xlarge};
  }
`;

const CardHeader = styled.div`
  background: ${({ theme }) => theme.gradients.secondary};
  color: white;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LogoPlaceholder = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

const LogoText = styled.div`
  font-size: 3.2rem;
  font-weight: 700;
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 2.4rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RatingText = styled.span`
  font-size: 1.4rem;
  font-weight: 500;
  margin-left: ${({ theme }) => theme.spacing.xs};
`;

const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.4rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
    flex-shrink: 0;
  }
`;

const ServicesContainer = styled.div`
  margin-top: auto;
`;

const ServicesTitle = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ServicesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ServiceTag = styled.span`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1.2rem;
  font-weight: 500;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const AddressLink = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.4rem;
  line-height: 1.5;
  margin-top: auto;
`;

const CardActions = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const VisitButton = styled(motion.a)`
  width: 100%;
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;





export default SalaoCard;

