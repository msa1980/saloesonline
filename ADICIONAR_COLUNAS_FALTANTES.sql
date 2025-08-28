-- =====================================================
-- SCRIPT PARA ADICIONAR COLUNAS FALTANTES NA TABELA SALOES
-- =====================================================
-- Execute este script no Supabase SQL Editor para resolver o erro:
-- "Could not find the 'ativo' column of 'saloes' in the schema cache"
--
-- Link do SQL Editor: https://supabase.com/dashboard/project/swkpsjovjtilyzuzobvi/sql
-- =====================================================

-- 1. ADICIONAR COLUNA ATIVO (PRINCIPAL CAUSA DO ERRO)
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- 2. ADICIONAR OUTRAS COLUNAS USADAS PELA APLICAÇÃO
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS site_url TEXT;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS horario_funcionamento TEXT;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS servicos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS descricao TEXT;

-- 3. VERIFICAR SE AS COLUNAS FORAM ADICIONADAS
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'saloes'
ORDER BY ordinal_position;

-- 4. ATUALIZAR REGISTROS EXISTENTES (SE HOUVER)
UPDATE public.saloes 
SET ativo = true 
WHERE ativo IS NULL;

-- =====================================================
-- APÓS EXECUTAR ESTE SCRIPT:
-- 1. A coluna 'ativo' estará disponível
-- 2. A migração deve funcionar sem erros
-- 3. Volte para a aplicação e tente migrar novamente
-- =====================================================

-- VERIFICAÇÃO FINAL - Execute para confirmar:
SELECT 
    COUNT(*) as total_saloes,
    COUNT(CASE WHEN ativo = true THEN 1 END) as saloes_ativos,
    COUNT(CASE WHEN ativo = false THEN 1 END) as saloes_inativos
FROM public.saloes;

-- Se você ver os resultados acima, as colunas foram adicionadas com sucesso!