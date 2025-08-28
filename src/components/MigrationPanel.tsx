import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Database, Download, Upload, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { 
  migrateLocalStorageToSupabase, 
  checkMigrationStatus 
} from '../utils/migrateToSupabase';

interface MigrationStatus {
  hasLocalData: boolean;
  hasSupabaseData: boolean;
  localCount: number;
  supabaseCount: number;
}

const MigrationPanel: React.FC = () => {
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const migrationStatus = await checkMigrationStatus();
      setStatus(migrationStatus);
    } catch (err) {
      setError('Erro ao verificar status da migração');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await migrateLocalStorageToSupabase();
      setSuccess('Migração concluída com sucesso!');
      
      // Recarregar status após migração
      setTimeout(() => {
        loadStatus();
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro durante a migração');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  if (!status && !loading) {
    return null;
  }

  // Não mostrar o painel se não há dados locais e já há dados no Supabase
  if (status && !status.hasLocalData && status.hasSupabaseData) {
    return null;
  }

  return (
    <MigrationContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <MigrationHeader>
        <Database size={24} />
        <MigrationTitle>Migração de Dados</MigrationTitle>
        <RefreshButton onClick={loadStatus} disabled={loading}>
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
        </RefreshButton>
      </MigrationHeader>

      {error && (
        <ErrorMessage>
          <AlertCircle size={16} />
          {error}
        </ErrorMessage>
      )}

      {success && (
        <SuccessMessage>
          <CheckCircle size={16} />
          {success}
        </SuccessMessage>
      )}

      {loading ? (
        <LoadingMessage>
          <LoadingSpinner />
          Verificando dados...
        </LoadingMessage>
      ) : status ? (
        <MigrationContent>
          <StatusGrid>
            <StatusCard>
              <StatusLabel>Dados Locais</StatusLabel>
              <StatusValue $hasData={status.hasLocalData}>
                {status.localCount} salões
              </StatusValue>
            </StatusCard>
            
            <StatusCard>
              <StatusLabel>Dados no Supabase</StatusLabel>
              <StatusValue $hasData={status.hasSupabaseData}>
                {status.supabaseCount} salões
              </StatusValue>
            </StatusCard>
          </StatusGrid>

          {status.hasLocalData && (
            <MigrationActions>
              <MigrationInfo>
                <AlertCircle size={16} />
                Encontrados dados no armazenamento local. 
                {status.hasSupabaseData 
                  ? 'Você pode migrar dados adicionais ou fazer backup.' 
                  : 'Recomendamos migrar para o Supabase para evitar perda de dados.'}
              </MigrationInfo>
              
              <ActionButtons>
                <MigrateButton 
                  onClick={handleMigration}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Upload size={16} />
                  {status.hasSupabaseData ? 'Migrar Dados Adicionais' : 'Migrar para Supabase'}
                </MigrateButton>
              </ActionButtons>
            </MigrationActions>
          )}

          {!status.hasLocalData && !status.hasSupabaseData && (
            <EmptyState>
              <Database size={48} />
              <EmptyTitle>Nenhum dado encontrado</EmptyTitle>
              <EmptyDescription>
                Não há dados no armazenamento local nem no Supabase.
                Comece adicionando seu primeiro salão!
              </EmptyDescription>
            </EmptyState>
          )}
        </MigrationContent>
      ) : null}
    </MigrationContainer>
  );
};

const MigrationContainer = styled(motion.div)`
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const MigrationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.primary};
`;

const MigrationTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const RefreshButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textLight};
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1.4rem;
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.success};
  color: white;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1.4rem;
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.4rem;
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
`;

const MigrationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatusCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const StatusLabel = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatusValue = styled.div<{ $hasData: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ $hasData, theme }) => $hasData ? theme.colors.success : theme.colors.textLight};
`;

const MigrationActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MigrationInfo = styled.div`
  background: ${({ theme }) => theme.colors.warning}20;
  border: 1px solid ${({ theme }) => theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.warning};
  font-size: 1.4rem;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
`;

const MigrateButton = styled(motion.button)`
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
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textLight};
`;

const EmptyTitle = styled.h4`
  font-size: 1.8rem;
  font-weight: 600;
  margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  margin: 0;
`;

export default MigrationPanel;