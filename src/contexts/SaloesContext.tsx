import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Salao {
  id: string;
  nome: string;
  endereco: string;
  telefone: string;
  email: string;
  logo: string;
  siteUrl: string;
  horarioFuncionamento: string;
  servicos: string[];
  descricao: string;
  ativo: boolean;
}

interface SaloesContextData {
  saloes: Salao[];
  addSalao: (salao: Omit<Salao, 'id'>) => void;
  updateSalao: (id: string, salao: Partial<Salao>) => void;
  deleteSalao: (id: string) => void;
  toggleSalaoStatus: (id: string) => void;
}

const SaloesContext = createContext<SaloesContextData>({} as SaloesContextData);

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
  // Função para carregar dados do localStorage
  const loadSaloesFromStorage = (): Salao[] => {
    try {
      const storedSaloes = localStorage.getItem('saloes');
      if (storedSaloes) {
        return JSON.parse(storedSaloes);
      }
    } catch (error) {
      console.error('Erro ao carregar salões do localStorage:', error);
    }
    
    // Dados padrão se não houver nada no localStorage
    return [
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
  };

  const [saloes, setSaloes] = useState<Salao[]>(loadSaloesFromStorage);

  // Função para salvar no localStorage
  const saveSaloesToStorage = (newSaloes: Salao[]) => {
    try {
      localStorage.setItem('saloes', JSON.stringify(newSaloes));
    } catch (error) {
      console.error('Erro ao salvar salões no localStorage:', error);
    }
  };

  const addSalao = (salao: Omit<Salao, 'id'>) => {
    const newSalao: Salao = {
      ...salao,
      id: Date.now().toString(),
    };
    const updatedSaloes = [...saloes, newSalao];
    setSaloes(updatedSaloes);
    saveSaloesToStorage(updatedSaloes);
  };

  const updateSalao = (id: string, salao: Partial<Salao>) => {
    const updatedSaloes = saloes.map(s => s.id === id ? { ...s, ...salao } : s);
    setSaloes(updatedSaloes);
    saveSaloesToStorage(updatedSaloes);
  };

  const deleteSalao = (id: string) => {
    const updatedSaloes = saloes.filter(s => s.id !== id);
    setSaloes(updatedSaloes);
    saveSaloesToStorage(updatedSaloes);
  };

  const toggleSalaoStatus = (id: string) => {
    const updatedSaloes = saloes.map(s => 
      s.id === id ? { ...s, ativo: !s.ativo } : s
    );
    setSaloes(updatedSaloes);
    saveSaloesToStorage(updatedSaloes);
  };

  return (
    <SaloesContext.Provider value={{
      saloes,
      addSalao,
      updateSalao,
      deleteSalao,
      toggleSalaoStatus,
    }}>
      {children}
    </SaloesContext.Provider>
  );
};

