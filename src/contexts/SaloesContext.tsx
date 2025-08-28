import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saloesService, storageService, isSupabaseConfigured, Salao as SupabaseSalao } from '../services/supabaseService';

export interface Salao {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  logo: string;
  siteUrl?: string;
  horarioFuncionamento?: string;
  servicos?: string[];
  descricao?: string;
  ativo?: boolean;
}

interface SaloesContextData {
  saloes: Salao[];
  loading: boolean;
  error: string | null;
  addSalao: (salao: Omit<Salao, 'id'>) => Promise<void>;
  updateSalao: (id: string, salao: Partial<Salao>) => Promise<void>;
  deleteSalao: (id: string) => Promise<void>;
  toggleSalaoStatus: (id: string) => Promise<void>;
  uploadLogo: (file: File, salaoId: string) => Promise<string | null>;
  refreshSaloes: () => Promise<void>;
}

const SaloesContext = createContext<SaloesContextData>({
  saloes: [],
  loading: false,
  error: null,
  addSalao: async () => {},
  updateSalao: async () => {},
  deleteSalao: async () => {},
  toggleSalaoStatus: async () => {},
  uploadLogo: async () => null,
  refreshSaloes: async () => {}
} as SaloesContextData);

export const useSaloes = () => {
  const context = useContext(SaloesContext);
  if (!context) {
    throw new Error('useSaloes deve ser usado dentro de um SaloesProvider');
  }
  return context;
};

interface SaloesProviderProps {
  children: ReactNode;
}

export const SaloesProvider: React.FC<SaloesProviderProps> = ({ children }) => {
  const [saloes, setSaloes] = useState<Salao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Dados padrão para fallback
  const defaultSaloes: Salao[] = [
    {
      id: '1',
      nome: 'Salão Elegance',
      endereco: 'Rua das Flores, 123 - Centro',
      telefone: '(11) 99999-9999',
      email: 'contato@salaoelegance.com',
      logo: '/logos/salao1.svg',
      siteUrl: 'https://salaoelegance.com',
      horarioFuncionamento: 'Seg-Sex: 9h às 20h | Sáb: 9h às 18h',
      servicos: ['Corte', 'Coloração', 'Tratamentos', 'Maquiagem'],
      descricao: 'Salão especializado em tratamentos capilares e maquiagem profissional',
      ativo: true,
    },
    {
      id: '2',
      nome: 'Beauty Studio',
      endereco: 'Av. Paulista, 456 - Bela Vista',
      telefone: '(11) 88888-8888',
      email: 'contato@beautystudio.com',
      logo: '/logos/salao2.svg',
      siteUrl: 'https://beautystudio.com',
      horarioFuncionamento: 'Seg-Sáb: 8h às 19h',
      servicos: ['Corte', 'Coloração', 'Tratamentos', 'Unhas'],
      descricao: 'Studio de beleza completo com foco em qualidade e atendimento personalizado',
      ativo: true,
    },
    {
      id: '3',
      nome: 'Hair & Style',
      endereco: 'Rua Augusta, 789 - Consolação',
      telefone: '(11) 77777-7777',
      email: 'contato@hairandstyle.com',
      logo: '/logos/salao3.svg',
      siteUrl: 'https://hairandstyle.com',
      horarioFuncionamento: 'Ter-Sáb: 10h às 21h',
      servicos: ['Corte', 'Coloração', 'Tratamentos', 'Penteado'],
      descricao: 'Salão especializado em cortes modernos e tendências',
      ativo: true,
    },
  ];

  // Função para carregar dados do localStorage (fallback)
  const loadSaloesFromStorage = (): Salao[] => {
    try {
      const storedSaloes = localStorage.getItem('saloes');
      if (storedSaloes) {
        return JSON.parse(storedSaloes);
      }
    } catch (error) {
      console.error('Erro ao carregar salões do localStorage:', error);
    }
    return defaultSaloes;
  };

  // Função para salvar no localStorage (fallback)
  const saveSaloesToStorage = (newSaloes: Salao[]) => {
    try {
      localStorage.setItem('saloes', JSON.stringify(newSaloes));
    } catch (error) {
      console.error('Erro ao salvar salões no localStorage:', error);
    }
  };

  // Função para carregar salões
  const refreshSaloes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await saloesService.getSaloes();
        if (error) {
          throw new Error(error.message || 'Erro ao carregar salões');
        }
        
        // Converter dados do Supabase para o formato local
        const formattedSaloes: Salao[] = (data || []).map(salao => ({
          id: salao.id!,
          nome: salao.nome,
          endereco: salao.endereco || '',
          telefone: salao.telefone || '',
          email: salao.email || '',
          logo: salao.logo_url || '/logos/default.svg',
          siteUrl: salao.site_url || '',
          horarioFuncionamento: salao.horario_funcionamento || '',
          servicos: salao.servicos || [],
          descricao: salao.descricao || '',
          ativo: salao.ativo !== undefined ? salao.ativo : true
        }));
        
        setSaloes(formattedSaloes);
        saveSaloesToStorage(formattedSaloes);
      } else {
        // Fallback para localStorage
        const localSaloes = loadSaloesFromStorage();
        setSaloes(localSaloes);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao carregar salões:', err);
      
      // Fallback para localStorage em caso de erro
      const localSaloes = loadSaloesFromStorage();
      setSaloes(localSaloes);
    } finally {
      setLoading(false);
    }
  };

  // Carregar salões na inicialização
  useEffect(() => {
    refreshSaloes();
  }, []);

  const addSalao = async (salao: Omit<Salao, 'id'>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isSupabaseConfigured()) {
        const supabaseSalao = {
          nome: salao.nome,
          endereco: salao.endereco,
          telefone: salao.telefone,
          email: salao.email,
          logo_url: salao.logo,
          site_url: salao.siteUrl,
          horario_funcionamento: salao.horarioFuncionamento,
          servicos: salao.servicos,
          descricao: salao.descricao,
          ativo: salao.ativo !== undefined ? salao.ativo : true
        };
        
        const { data, error } = await saloesService.createSalao(supabaseSalao);
        if (error) {
          throw new Error(error.message || 'Erro ao criar salão');
        }
        
        await refreshSaloes();
      } else {
        // Fallback para localStorage
        const newSalao: Salao = {
          ...salao,
          id: Date.now().toString(),
        };
        const updatedSaloes = [...saloes, newSalao];
        setSaloes(updatedSaloes);
        saveSaloesToStorage(updatedSaloes);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar salão';
      setError(errorMessage);
      console.error('Erro ao adicionar salão:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSalao = async (id: string, salao: Partial<Salao>) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isSupabaseConfigured()) {
        const updates: any = {};
        if (salao.nome !== undefined) updates.nome = salao.nome;
        if (salao.endereco !== undefined) updates.endereco = salao.endereco;
        if (salao.telefone !== undefined) updates.telefone = salao.telefone;
        if (salao.email !== undefined) updates.email = salao.email;
        if (salao.logo !== undefined) updates.logo_url = salao.logo;
        if (salao.siteUrl !== undefined) updates.site_url = salao.siteUrl;
        if (salao.horarioFuncionamento !== undefined) updates.horario_funcionamento = salao.horarioFuncionamento;
        if (salao.servicos !== undefined) updates.servicos = salao.servicos;
        if (salao.descricao !== undefined) updates.descricao = salao.descricao;
        if (salao.ativo !== undefined) updates.ativo = salao.ativo;
        
        const { error } = await saloesService.updateSalao(id, updates);
        if (error) {
          throw new Error(error.message || 'Erro ao atualizar salão');
        }
        
        await refreshSaloes();
      } else {
        // Fallback para localStorage
        const updatedSaloes = saloes.map(s => s.id === id ? { ...s, ...salao } : s);
        setSaloes(updatedSaloes);
        saveSaloesToStorage(updatedSaloes);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar salão';
      setError(errorMessage);
      console.error('Erro ao atualizar salão:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSalao = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (isSupabaseConfigured()) {
        // Primeiro, deletar o logo se existir
        const salao = saloes.find(s => s.id === id);
        if (salao?.logo && salao.logo.includes('supabase')) {
          await storageService.deleteLogo(salao.logo);
        }
        
        const { error } = await saloesService.deleteSalao(id);
        if (error) {
          throw new Error(error.message || 'Erro ao deletar salão');
        }
        
        await refreshSaloes();
      } else {
        // Fallback para localStorage
        const updatedSaloes = saloes.filter(s => s.id !== id);
        setSaloes(updatedSaloes);
        saveSaloesToStorage(updatedSaloes);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar salão';
      setError(errorMessage);
      console.error('Erro ao deletar salão:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSalaoStatus = async (id: string) => {
    const salao = saloes.find(s => s.id === id);
    if (!salao) return;
    
    await updateSalao(id, { ativo: !salao.ativo });
  };

  const uploadLogo = async (file: File, salaoId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await storageService.uploadLogo(file, salaoId);
        if (error) {
          throw new Error(error.message || 'Erro ao fazer upload do logo');
        }
        
        // Atualizar o salão com a nova URL do logo
        if (data?.publicUrl) {
          await updateSalao(salaoId, { logo: data.publicUrl });
          return data.publicUrl;
        }
        
        return null;
      } else {
        // Para desenvolvimento local, apenas simular o upload
        const logoUrl = `/logos/${salaoId}-${Date.now()}.${file.name.split('.').pop()}`;
        await updateSalao(salaoId, { logo: logoUrl });
        return logoUrl;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer upload do logo';
      setError(errorMessage);
      console.error('Erro ao fazer upload do logo:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SaloesContext.Provider value={{
      saloes,
      loading,
      error,
      addSalao,
      updateSalao,
      deleteSalao,
      toggleSalaoStatus,
      uploadLogo,
      refreshSaloes,
    }}>
      {children}
    </SaloesContext.Provider>
  );
};

