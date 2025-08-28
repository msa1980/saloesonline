-- =====================================================
-- SCRIPT URGENTE - EXECUTE NO SUPABASE SQL EDITOR
-- =====================================================
-- Copie e cole este código no SQL Editor do Supabase
-- e clique em "Run" para criar as tabelas necessárias

-- 1. CRIAR TABELA DE SALÕES
CREATE TABLE IF NOT EXISTS public.saloes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CRIAR TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    endereco TEXT,
    salao_id UUID REFERENCES public.saloes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CONFIGURAR PERMISSÕES (RLS)
ALTER TABLE public.saloes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS DE ACESSO (PERMISSIVO PARA DESENVOLVIMENTO)
CREATE POLICY "Permitir todas as operações em saloes" ON public.saloes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir todas as operações em clientes" ON public.clientes
    FOR ALL USING (true) WITH CHECK (true);

-- 5. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_saloes_nome ON public.saloes(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_salao_id ON public.clientes(salao_id);

-- 6. VERIFICAR SE AS TABELAS FORAM CRIADAS
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('saloes', 'clientes')
ORDER BY tablename;

-- Se você ver as tabelas 'saloes' e 'clientes' listadas acima,
-- as tabelas foram criadas com sucesso!

-- =====================================================
-- APÓS EXECUTAR ESTE SCRIPT:
-- 1. Volte para a aplicação
-- 2. Tente a migração novamente
-- 3. As tabelas agora devem estar disponíveis
-- =====================================================