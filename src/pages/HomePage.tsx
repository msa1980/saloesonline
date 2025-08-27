import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useSaloes } from '../contexts/SaloesContext';
import Header from '../components/Header';
import SalaoCard from '../components/SalaoCard';
import AdminButton from '../components/AdminButton';

const HomePage: React.FC = () => {
  const { saloes } = useSaloes();
  const saloesAtivos = saloes.filter(salao => salao.ativo);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSaloes, setFilteredSaloes] = useState(saloesAtivos);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredSaloes(saloesAtivos);
    } else {
      const filtered = saloesAtivos.filter(salao => 
        salao.endereco.toLowerCase().includes(term.toLowerCase()) ||
        salao.nome.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSaloes(filtered);
    }
  };

  const openSearchPopup = () => {
    setShowSearchPopup(true);
    setFilteredSaloes(saloesAtivos);
  };

  const closeSearchPopup = () => {
    setShowSearchPopup(false);
    setSearchTerm('');
    setFilteredSaloes(saloesAtivos);
  };

  return (
    <PageContainer>
      <Header />
      
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <HeroTitle>Salões Online</HeroTitle>
          <HeroSubtitle>
            Descubra o salão mais próximo de você e agende seu horário
          </HeroSubtitle>
        </motion.div>
      </HeroSection>

      <MainContent>
        <SectionHeader>
          <SectionTitle>Nossos Salões</SectionTitle>
          <SearchButton
            onClick={openSearchPopup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Search size={20} />
            Encontre o salão mais próximo
          </SearchButton>
        </SectionHeader>

        {showSearchPopup && (
          <SearchPopupOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearchPopup}
          >
            <SearchPopupContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <SearchPopupHeader>
                <SearchPopupTitle>Encontrar Salão por Endereço</SearchPopupTitle>
                <CloseButton onClick={closeSearchPopup}>
                  <X size={24} />
                </CloseButton>
              </SearchPopupHeader>
              
              <SearchInputContainer>
                <SearchIcon>
                  <Search size={20} />
                </SearchIcon>
                <SearchInput
                  type="text"
                  placeholder="Digite o endereço ou nome do salão..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                />
              </SearchInputContainer>
              
              <SearchResults>
                {filteredSaloes.length > 0 ? (
                  filteredSaloes.map((salao) => (
                    <SearchResultItem key={salao.id}>
                      <SalaoInfo>
                        <SalaoName>{salao.nome}</SalaoName>
                        <SalaoAddress>{salao.endereco}</SalaoAddress>
                      </SalaoInfo>
                      <SelectButton onClick={() => {
                        closeSearchPopup();
                        // Scroll to the salon card
                        const element = document.getElementById(`salao-${salao.id}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}>
                        Ver Salão
                      </SelectButton>
                    </SearchResultItem>
                  ))
                ) : (
                  <NoResults>
                    {searchTerm ? 'Nenhum salão encontrado para esta pesquisa.' : 'Digite para pesquisar...'}
                  </NoResults>
                )}
              </SearchResults>
            </SearchPopupContent>
          </SearchPopupOverlay>
        )}

        <SaloesGrid>
          {saloesAtivos.map((salao, index) => (
            <motion.div
              key={salao.id}
              id={`salao-${salao.id}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <SalaoCard salao={salao} />
            </motion.div>
          ))}
        </SaloesGrid>
      </MainContent>

      <AdminButton />
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
`;

const HeroSection = styled.section`
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroTitle = styled.h1`
  font-size: 6.4rem;
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 4.8rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 2rem;
  font-weight: 300;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const MainContent = styled.main`
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const SearchButton = styled(motion.button)`
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const SearchPopupOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const SearchPopupContent = styled(motion.div)`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.large};
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SearchPopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchPopupTitle = styled.h3`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.xl};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 50px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.6rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SearchResults = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.md};
  max-height: 400px;
`;

const SearchResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SalaoInfo = styled.div`
  flex: 1;
`;

const SalaoName = styled.h4`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const SalaoAddress = styled.p`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin: 0;
`;

const SelectButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1.4rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-1px);
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.6rem;
`;



const SectionTitle = styled.h2`
  text-align: center;
  font-size: 3.6rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const SaloesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

export default HomePage;

