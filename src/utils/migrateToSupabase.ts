import { supabase } from '../services/supabaseService';
import { Salao } from '../contexts/SaloesContext';

/**
 * Script para migrar dados existentes do localStorage para o Supabase
 * Execute este script uma vez após configurar o Supabase
 */

export const migrateLocalStorageToSupabase = async (): Promise<void> => {
  try {
    console.log('🚀 Iniciando migração dos dados para o Supabase...');
    
    // Verificar se o Supabase está configurado
    const { data: testData, error: testError } = await supabase
      .from('saloes')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Erro de conexão com Supabase: ${testError.message}`);
    }
    
    // Buscar dados do localStorage
    const localData = localStorage.getItem('saloes');
    if (!localData) {
      console.log('ℹ️ Nenhum dado encontrado no localStorage.');
      return;
    }
    
    const saloes: Salao[] = JSON.parse(localData);
    console.log(`📊 Encontrados ${saloes.length} salões no localStorage`);
    
    if (saloes.length === 0) {
      console.log('ℹ️ Nenhum salão para migrar.');
      return;
    }
    
    // Verificar se já existem dados no Supabase
    const { data: existingData, error: existingError } = await supabase
      .from('saloes')
      .select('id')
      .limit(1);
    
    if (existingError) {
      throw new Error(`Erro ao verificar dados existentes: ${existingError.message}`);
    }
    
    if (existingData && existingData.length > 0) {
      const shouldProceed = window.confirm(
        'Já existem dados no Supabase. Deseja continuar com a migração? Isso pode criar duplicatas.'
      );
      if (!shouldProceed) {
        console.log('❌ Migração cancelada pelo usuário.');
        return;
      }
    }
    
    // Preparar dados para inserção no Supabase
    const saloesForSupabase = saloes.map(salao => ({
      id: salao.id,
      nome: salao.nome,
      endereco: salao.endereco,
      telefone: salao.telefone,
      email: salao.email || '',
      logo: salao.logo || '',
      site_url: salao.siteUrl || '',
      horario_funcionamento: salao.horarioFuncionamento || '',
      servicos: salao.servicos || [],
      descricao: salao.descricao || '',
      ativo: salao.ativo ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    // Inserir dados no Supabase
    console.log('💾 Inserindo dados no Supabase...');
    const { data, error } = await supabase
      .from('saloes')
      .insert(saloesForSupabase)
      .select();
    
    if (error) {
      throw new Error(`Erro ao inserir dados: ${error.message}`);
    }
    
    console.log(`✅ Migração concluída com sucesso! ${data?.length || 0} salões migrados.`);
    
    // Perguntar se deve fazer backup do localStorage
    const shouldBackup = window.confirm(
      'Migração concluída! Deseja fazer backup dos dados do localStorage antes de limpá-los?'
    );
    
    if (shouldBackup) {
      // Criar backup
      const backupData = {
        timestamp: new Date().toISOString(),
        saloes: saloes
      };
      
      const backupBlob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(backupBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saloes-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('💾 Backup do localStorage criado e baixado.');
    }
    
    // Perguntar se deve limpar o localStorage
    const shouldClear = window.confirm(
      'Deseja limpar os dados do localStorage agora que estão no Supabase?'
    );
    
    if (shouldClear) {
      localStorage.removeItem('saloes');
      console.log('🧹 Dados do localStorage removidos.');
    }
    
    alert('Migração concluída com sucesso! Recarregue a página para ver os dados do Supabase.');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    alert(`Erro durante a migração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    throw error;
  }
};

/**
 * Função para verificar o status da migração
 */
export const checkMigrationStatus = async (): Promise<{
  hasLocalData: boolean;
  hasSupabaseData: boolean;
  localCount: number;
  supabaseCount: number;
}> => {
  try {
    // Verificar dados locais
    const localData = localStorage.getItem('saloes');
    const localSaloes = localData ? JSON.parse(localData) : [];
    
    // Verificar dados no Supabase
    const { data: supabaseData, error } = await supabase
      .from('saloes')
      .select('id');
    
    if (error) {
      console.error('Erro ao verificar dados do Supabase:', error);
      return {
        hasLocalData: localSaloes.length > 0,
        hasSupabaseData: false,
        localCount: localSaloes.length,
        supabaseCount: 0
      };
    }
    
    return {
      hasLocalData: localSaloes.length > 0,
      hasSupabaseData: (supabaseData?.length || 0) > 0,
      localCount: localSaloes.length,
      supabaseCount: supabaseData?.length || 0
    };
    
  } catch (error) {
    console.error('Erro ao verificar status da migração:', error);
    return {
      hasLocalData: false,
      hasSupabaseData: false,
      localCount: 0,
      supabaseCount: 0
    };
  }
};

/**
 * Função para executar a migração automaticamente se necessário
 */
export const autoMigrateIfNeeded = async (): Promise<boolean> => {
  try {
    const status = await checkMigrationStatus();
    
    // Se há dados locais mas não há dados no Supabase, sugerir migração
    if (status.hasLocalData && !status.hasSupabaseData) {
      const shouldMigrate = window.confirm(
        `Encontrados ${status.localCount} salões no armazenamento local. ` +
        'Deseja migrar esses dados para o Supabase agora?'
      );
      
      if (shouldMigrate) {
        await migrateLocalStorageToSupabase();
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Erro na migração automática:', error);
    return false;
  }
};