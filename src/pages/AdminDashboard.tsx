import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, LogOut, 
  Search, ArrowLeft, Save, X, Upload 
} from 'lucide-react';
import { useSaloes, Salao } from '../contexts/SaloesContext';

interface FormData {
  nome?: string;
  endereco?: string;
  telefone?: string;
  email?: string;
  logo?: string;
  siteUrl?: string;
  horarioFuncionamento?: string;
  servicos?: string[] | string;
  descricao?: string;
  ativo?: boolean;
}

const AdminDashboard: React.FC = () => {
  const { saloes, addSalao, updateSalao, deleteSalao, toggleSalaoStatus } = useSaloes();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSalao, setEditingSalao] = useState<Salao | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('adminAuthenticated');
    if (!auth) {
      navigate('/admin');
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin');
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setFormData({ ...formData, logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setFormData({ ...formData, logo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSalao = () => {
    if (formData.nome && formData.endereco && formData.telefone) {
      addSalao({
        nome: formData.nome,
        endereco: formData.endereco,
        telefone: formData.telefone,
        email: formData.email || '',
        logo: formData.logo || '',
        siteUrl: formData.siteUrl || '',
        horarioFuncionamento: formData.horarioFuncionamento || '',
        servicos: typeof formData.servicos === 'string' 
          ? formData.servicos.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : formData.servicos || [],
        descricao: formData.descricao || '',
        ativo: true,
      });
      setFormData({});
      setShowAddForm(false);
    }
  };

  const handleUpdateSalao = () => {
    if (editingSalao && formData.nome) {
      const updatedData = {
        ...formData,
        servicos: typeof formData.servicos === 'string' 
          ? formData.servicos.split(',').map((s: string) => s.trim()).filter((s: string) => s)
          : formData.servicos || []
      };
      updateSalao(editingSalao.id, updatedData);
      setEditingSalao(null);
      setFormData({});
    }
  };

  const handleDeleteSalao = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este salão?')) {
      deleteSalao(id);
    }
  };

  const filteredSaloes = saloes.filter(salao =>
    salao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salao.endereco.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardContainer>
      <Header>
        <HeaderContent>
          <BackButton onClick={() => navigate('/')}>
            <ArrowLeft size={20} />
            Voltar ao Site
          </BackButton>
          
          <HeaderTitle>Painel Administrativo</HeaderTitle>
          
          <LogoutButton onClick={handleLogout}>
            <LogOut size={20} />
            Sair
          </LogoutButton>
        </HeaderContent>
      </Header>

      <MainContent>
        <ControlsSection>
          <SearchContainer>
            <Search size={20} />
            <SearchInput
              type="text"
              placeholder="Buscar salões..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>

          <AddButton
            onClick={() => setShowAddForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Adicionar Salão
          </AddButton>
        </ControlsSection>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <FormCard>
              <FormTitle>Adicionar Novo Salão</FormTitle>
              <FormGrid>
                <FormField>
                  <Label>Nome do Salão *</Label>
                  <Input
                    type="text"
                    value={formData.nome || ''}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do salão"
                  />
                </FormField>
                
                <FormField>
                  <Label>Endereço *</Label>
                  <Input
                    type="text"
                    value={formData.endereco || ''}
                    onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                    placeholder="Endereço completo"
                  />
                </FormField>
                
                <FormField>
                  <Label>Telefone *</Label>
                  <Input
                    type="text"
                    value={formData.telefone || ''}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </FormField>
                
                <FormField>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@salao.com"
                  />
                </FormField>
                
                <FormField>
                  <Label>URL do Site</Label>
                  <Input
                    type="url"
                    value={formData.siteUrl || ''}
                    onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                    placeholder="https://salao.com"
                  />
                </FormField>
                
                <FormField>
                  <Label>Horário de Funcionamento</Label>
                  <Input
                    type="text"
                    value={formData.horarioFuncionamento || ''}
                    onChange={(e) => setFormData({ ...formData, horarioFuncionamento: e.target.value })}
                    placeholder="Seg-Sex: 9h às 20h"
                  />
                </FormField>
                
                <FormField>
                  <Label>Logo</Label>
                  <LogoUploadContainer>
                    {formData.logo && (
                      <LogoPreview>
                        <img src={formData.logo} alt="Preview" />
                      </LogoPreview>
                    )}
                    <UploadButton
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload size={20} />
                      {formData.logo ? 'Alterar Logo' : 'Fazer Upload do Logo'}
                    </UploadButton>
                    <HiddenFileInput
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </LogoUploadContainer>
                </FormField>
                
                <FormField>
                  <Label>Serviços (separados por vírgula)</Label>
                  <Input
                    type="text"
                    value={Array.isArray(formData.servicos) ? formData.servicos.join(', ') : ''}
                    onChange={(e) => setFormData({ ...formData, servicos: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                    placeholder="Corte, Coloração, Tratamentos, Maquiagem"
                  />
                </FormField>
                
                <FormField fullWidth>
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.descricao || ''}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição do salão..."
                    rows={3}
                  />
                </FormField>
              </FormGrid>
              
              <FormActions>
                <SaveButton onClick={handleAddSalao}>
                  <Save size={20} />
                  Salvar
                </SaveButton>
                <CancelButton onClick={() => setShowAddForm(false)}>
                  <X size={20} />
                  Cancelar
                </CancelButton>
              </FormActions>
            </FormCard>
          </motion.div>
        )}

        <SaloesTable>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Logo</TableHeaderCell>
              <TableHeaderCell>Nome</TableHeaderCell>
              <TableHeaderCell>Endereço</TableHeaderCell>
              <TableHeaderCell>Telefone</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {filteredSaloes.map((salao) => (
              <TableRow key={salao.id}>
                <TableCell>
                  <LogoCell>
                    {salao.logo ? (
                      <LogoImage src={salao.logo} alt={salao.nome} />
                    ) : (
                      <LogoPlaceholder>{salao.nome.charAt(0)}</LogoPlaceholder>
                    )}
                  </LogoCell>
                </TableCell>
                
                <TableCell>
                  <SalaoName>{salao.nome}</SalaoName>
                  <SalaoEmail>{salao.email}</SalaoEmail>
                </TableCell>
                
                <TableCell>
                  <SalaoAddress>{salao.endereco}</SalaoAddress>
                </TableCell>
                
                <TableCell>
                  <SalaoPhone>{salao.telefone}</SalaoPhone>
                </TableCell>
                
                <TableCell>
                  <StatusToggle
                    onClick={() => toggleSalaoStatus(salao.id)}
                    $active={salao.ativo}
                  >
                    {salao.ativo ? <Eye size={16} /> : <EyeOff size={16} />}
                    {salao.ativo ? 'Ativo' : 'Inativo'}
                  </StatusToggle>
                </TableCell>
                
                <TableCell>
                  <ActionButtons>
                    <EditButton
                      onClick={() => {
                        setEditingSalao(salao);
                        setFormData(salao);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit size={16} />
                    </EditButton>
                    
                    <DeleteButton
                      onClick={() => handleDeleteSalao(salao.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 size={16} />
                    </DeleteButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </SaloesTable>
      </MainContent>

      {editingSalao && (
        <EditModal>
          <EditModalContent>
            <EditModalHeader>
              <EditModalTitle>Editar Salão</EditModalTitle>
              <CloseButton onClick={() => setEditingSalao(null)}>
                <X size={24} />
              </CloseButton>
            </EditModalHeader>
            
            <EditFormGrid>
              <FormField>
                <Label>Nome do Salão</Label>
                <Input
                  type="text"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </FormField>
              
              <FormField>
                <Label>Endereço</Label>
                <Input
                  type="text"
                  value={formData.endereco || ''}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                />
              </FormField>
              
              <FormField>
                <Label>Telefone</Label>
                <Input
                  type="text"
                  value={formData.telefone || ''}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </FormField>
              
              <FormField>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormField>
              
              <FormField>
                <Label>URL do Site</Label>
                <Input
                  type="url"
                  value={formData.siteUrl || ''}
                  onChange={(e) => setFormData({ ...formData, siteUrl: e.target.value })}
                  placeholder="https://salao.com"
                />
              </FormField>
              
              <FormField>
                <Label>Serviços (separados por vírgula)</Label>
                <Input
                  type="text"
                  value={Array.isArray(formData.servicos) ? formData.servicos.join(', ') : formData.servicos || ''}
                  onChange={(e) => setFormData({ ...formData, servicos: e.target.value })}
                  placeholder="Corte, Coloração, Tratamentos, Maquiagem"
                />
              </FormField>
              
              <FormField>
                <Label>Logo</Label>
                <LogoUploadContainer>
                  {formData.logo && (
                    <LogoPreview>
                      <img src={formData.logo} alt="Preview" />
                    </LogoPreview>
                  )}
                  <UploadButton
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    <Upload size={20} />
                    {formData.logo ? 'Alterar Logo' : 'Fazer Upload do Logo'}
                  </UploadButton>
                  <HiddenFileInput
                    ref={editFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleEditLogoUpload}
                  />
                </LogoUploadContainer>
              </FormField>
            </EditFormGrid>
            
            <EditModalActions>
              <SaveButton onClick={handleUpdateSalao}>
                <Save size={20} />
                Salvar Alterações
              </SaveButton>
              <CancelButton onClick={() => setEditingSalao(null)}>
                <X size={20} />
                Cancelar
              </CancelButton>
            </EditModalActions>
          </EditModalContent>
        </EditModal>
      )}
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.surface};
`;

const Header = styled.header`
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 1.4rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const LogoutButton = styled.button`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: 1.4rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #dc2626;
  }
`;

const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

const ControlsSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  svg {
    position: absolute;
    left: ${({ theme }) => theme.spacing.md};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md} 4.8rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.6rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const AddButton = styled(motion.button)`
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

const FormCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormField = styled.div<{ fullWidth?: boolean }>`
  ${({ fullWidth }) => fullWidth && 'grid-column: 1 / -1;'}
`;

const Label = styled.label`
  display: block;
  font-size: 1.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.6rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.6rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background: ${({ theme }) => theme.colors.success};
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
  
  &:hover {
    background: #059669;
  }
`;

const CancelButton = styled.button`
  background: ${({ theme }) => theme.colors.textLight};
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
  
  &:hover {
    background: #475569;
  }
`;

const SaloesTable = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableHeader = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 80px 2fr 2fr 1fr 1fr 120px;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
    text-align: center;
  }
`;

const TableHeaderCell = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.4rem;
`;

const TableBody = styled.div``;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LogoCell = styled.div`
  display: flex;
  justify-content: center;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const LogoPlaceholder = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
`;

const SalaoName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const SalaoEmail = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const SalaoAddress = styled.div`
  color: ${({ theme }) => theme.colors.text};
`;

const SalaoPhone = styled.div`
  color: ${({ theme }) => theme.colors.text};
`;

const StatusToggle = styled.button<{ $active: boolean }>`
  background: ${({ $active, theme }) => $active ? theme.colors.success : theme.colors.textLight};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const EditButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.info};
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: #2563eb;
  }
`;

const DeleteButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: #dc2626;
  }
`;

const EditModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const EditModalContent = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const EditModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EditModalTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLight};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const EditFormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EditModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const LogoUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const LogoPreview = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid ${({ theme }) => theme.colors.border};
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UploadButton = styled.button`
  background: ${({ theme }) => theme.gradients.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.4rem;
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

const HiddenFileInput = styled.input`
  display: none;
`;

export default AdminDashboard;

