import { createClient } from '@supabase/supabase-js'

// Configurações do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseKey || 
    supabaseUrl === 'https://seu-projeto.supabase.co' || 
    supabaseKey === 'sua-chave-publica-aqui') {
  console.warn('⚠️ Supabase não configurado. Configure as variáveis no .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Interfaces
export interface Salao {
  id?: string
  nome: string
  endereco?: string
  telefone?: string
  email?: string
  logo_url?: string
  created_at?: string
}

export interface Cliente {
  id?: string
  nome: string
  email?: string
  telefone?: string
  endereco?: string
  salao_id?: string
  created_at?: string
}

// Serviços para Salões
export const saloesService = {
  // Buscar todos os salões
  async getSaloes(): Promise<{ data: Salao[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('saloes')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar salões:', error)
      return { data: null, error }
    }
  },

  // Buscar salão por ID
  async getSalaoById(id: string): Promise<{ data: Salao | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('saloes')
        .select('*')
        .eq('id', id)
        .single()
      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar salão:', error)
      return { data: null, error }
    }
  },

  // Criar novo salão
  async createSalao(salao: Omit<Salao, 'id' | 'created_at'>): Promise<{ data: Salao | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('saloes')
        .insert([salao])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Erro ao criar salão:', error)
      return { data: null, error }
    }
  },

  // Atualizar salão
  async updateSalao(id: string, updates: Partial<Salao>): Promise<{ data: Salao | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('saloes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar salão:', error)
      return { data: null, error }
    }
  },

  // Deletar salão
  async deleteSalao(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('saloes')
        .delete()
        .eq('id', id)
      return { error }
    } catch (error) {
      console.error('Erro ao deletar salão:', error)
      return { error }
    }
  }
}

// Serviços para Clientes
export const clientesService = {
  // Buscar todos os clientes
  async getClientes(): Promise<{ data: Cliente[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      return { data: null, error }
    }
  },

  // Buscar clientes por salão
  async getClientesBySalao(salaoId: string): Promise<{ data: Cliente[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('salao_id', salaoId)
        .order('created_at', { ascending: false })
      return { data, error }
    } catch (error) {
      console.error('Erro ao buscar clientes do salão:', error)
      return { data: null, error }
    }
  },

  // Criar novo cliente
  async createCliente(cliente: Omit<Cliente, 'id' | 'created_at'>): Promise<{ data: Cliente | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert([cliente])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      return { data: null, error }
    }
  },

  // Atualizar cliente
  async updateCliente(id: string, updates: Partial<Cliente>): Promise<{ data: Cliente | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      return { data, error }
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      return { data: null, error }
    }
  },

  // Deletar cliente
  async deleteCliente(id: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)
      return { error }
    } catch (error) {
      console.error('Erro ao deletar cliente:', error)
      return { error }
    }
  }
}

// Serviços para Storage (Upload de Logos)
export const storageService = {
  // Upload de logo
  async uploadLogo(file: File, salaoId: string): Promise<{ data: { publicUrl: string } | null, error: any }> {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${salaoId}-${Date.now()}.${fileExt}`
      const filePath = `logos/${fileName}`

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('saloes-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (uploadError) {
        throw uploadError
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('saloes-logos')
        .getPublicUrl(filePath)

      return { data: { publicUrl }, error: null }
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error)
      return { data: null, error }
    }
  },

  // Deletar logo
  async deleteLogo(logoUrl: string): Promise<{ error: any }> {
    try {
      // Extrair o caminho do arquivo da URL
      const urlParts = logoUrl.split('/storage/v1/object/public/saloes-logos/')
      if (urlParts.length < 2) {
        throw new Error('URL do logo inválida')
      }
      
      const filePath = urlParts[1]
      
      const { error } = await supabase.storage
        .from('saloes-logos')
        .remove([filePath])
      
      return { error }
    } catch (error) {
      console.error('Erro ao deletar logo:', error)
      return { error }
    }
  },

  // Listar logos
  async listLogos(): Promise<{ data: any[] | null, error: any }> {
    try {
      const { data, error } = await supabase.storage
        .from('saloes-logos')
        .list('logos', {
          limit: 100,
          offset: 0
        })
      return { data, error }
    } catch (error) {
      console.error('Erro ao listar logos:', error)
      return { data: null, error }
    }
  }
}

// Função para verificar se o Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && 
           supabaseKey && 
           supabaseUrl !== 'https://seu-projeto.supabase.co' && 
           supabaseKey !== 'sua-chave-publica-aqui')
}

// Função para testar conexão
export const testConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('saloes')
      .select('count', { count: 'exact', head: true })
    
    return !error
  } catch (error) {
    console.error('Erro ao testar conexão:', error)
    return false
  }
}

export default supabase