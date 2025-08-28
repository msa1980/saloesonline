-- =====================================================
-- SCRIPT PARA CORRIGIR COMPLETAMENTE A TABELA SALOES
-- =====================================================
-- Execute este script no Supabase SQL Editor para resolver todos os erros de colunas
-- Link: https://supabase.com/dashboard/project/swkpsjovjtilyzuzobvi/sql
-- =====================================================

-- 1. REMOVER TABELA EXISTENTE (SE HOUVER PROBLEMAS)
-- CUIDADO: Isso apagará todos os dados existentes!
-- Descomente apenas se necessário:
-- DROP TABLE IF EXISTS public.saloes CASCADE;

-- 2. CRIAR TABELA COMPLETA COM TODAS AS COLUNAS NECESSÁRIAS
CREATE TABLE IF NOT EXISTS public.saloes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    logo TEXT,                    -- Coluna 'logo' (não 'logo_url')
    logo_url TEXT,               -- Manter também 'logo_url' para compatibilidade
    site_url TEXT,
    horario_funcionamento TEXT,
    servicos JSONB DEFAULT '[]'::jsonb,
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. ADICIONAR COLUNAS SE A TABELA JÁ EXISTIR (MÉTODO SEGURO)
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS logo TEXT;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS site_url TEXT;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS horario_funcionamento TEXT;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS servicos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- 4. CRIAR TABELA CLIENTES (SE NÃO EXISTIR)
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

-- 5. CONFIGURAR RLS (ROW LEVEL SECURITY)
ALTER TABLE public.saloes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- 6. CRIAR POLÍTICAS PERMISSIVAS (PARA DESENVOLVIMENTO)
DROP POLICY IF EXISTS "Permitir todas as operações em saloes" ON public.saloes;
CREATE POLICY "Permitir todas as operações em saloes" ON public.saloes
    FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir todas as operações em clientes" ON public.clientes;
CREATE POLICY "Permitir todas as operações em clientes" ON public.clientes
    FOR ALL USING (true) WITH CHECK (true);

-- 7. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_saloes_nome ON public.saloes(nome);
CREATE INDEX IF NOT EXISTS idx_saloes_ativo ON public.saloes(ativo);
CREATE INDEX IF NOT EXISTS idx_clientes_salao_id ON public.clientes(salao_id);

-- 8. CRIAR FUNÇÃO PARA ATUALIZAR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. CRIAR TRIGGERS PARA ATUALIZAR updated_at
DROP TRIGGER IF EXISTS update_saloes_updated_at ON public.saloes;
CREATE TRIGGER update_saloes_updated_at
    BEFORE UPDATE ON public.saloes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 10. VERIFICAR ESTRUTURA FINAL DA TABELA
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'saloes'
ORDER BY ordinal_position;

-- 11. VERIFICAR SE AS TABELAS FORAM CRIADAS
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('saloes', 'clientes')
ORDER BY tablename;

-- =====================================================
-- APÓS EXECUTAR ESTE SCRIPT:
-- 1. Todas as colunas necessárias estarão disponíveis
-- 2. A migração deve funcionar sem erros
-- 3. Volte para a aplicação e tente migrar novamente
-- =====================================================