-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO DO SUPABASE
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. CRIAR TABELA DE SALÕES
-- =====================================================
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
-- =====================================================
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

-- 3. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_saloes_nome ON public.saloes(nome);
CREATE INDEX IF NOT EXISTS idx_saloes_created_at ON public.saloes(created_at);
CREATE INDEX IF NOT EXISTS idx_clientes_salao_id ON public.clientes(salao_id);
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON public.clientes(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_created_at ON public.clientes(created_at);

-- 4. CRIAR FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 5. CRIAR TRIGGERS PARA ATUALIZAR updated_at
-- =====================================================
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

-- 6. CONFIGURAR ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Habilitar RLS nas tabelas
ALTER TABLE public.saloes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir todas as operações (para desenvolvimento)
-- IMPORTANTE: Em produção, configure políticas mais restritivas
CREATE POLICY "Permitir todas as operações em saloes" ON public.saloes
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir todas as operações em clientes" ON public.clientes
    FOR ALL USING (true) WITH CHECK (true);

-- 7. INSERIR DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================
-- Descomente as linhas abaixo se quiser inserir dados de exemplo

/*
INSERT INTO public.saloes (nome, endereco, telefone, email) VALUES
('Salão Elegance', 'Rua das Flores, 123 - Centro', '(11) 99999-9999', 'contato@salaoelegance.com'),
('Beauty Studio', 'Av. Paulista, 456 - Bela Vista', '(11) 88888-8888', 'contato@beautystudio.com'),
('Hair & Style', 'Rua Augusta, 789 - Consolação', '(11) 77777-7777', 'contato@hairandstyle.com');

-- Inserir alguns clientes de exemplo
INSERT INTO public.clientes (nome, email, telefone, salao_id) 
SELECT 
    'Cliente Exemplo ' || generate_series,
    'cliente' || generate_series || '@email.com',
    '(11) 9999-' || LPAD(generate_series::text, 4, '0'),
    (SELECT id FROM public.saloes LIMIT 1)
FROM generate_series(1, 5);
*/

-- =====================================================
-- CONFIGURAÇÃO DO STORAGE PARA LOGOS
-- =====================================================
-- Execute este comando no SQL Editor para criar o bucket de logos:

-- Criar bucket para logos dos salões
INSERT INTO storage.buckets (id, name, public)
VALUES ('saloes-logos', 'saloes-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de logos
CREATE POLICY "Permitir upload de logos" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'saloes-logos' AND
        (storage.foldername(name))[1] = 'logos'
    );

-- Política para permitir visualização de logos
CREATE POLICY "Permitir visualização de logos" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'saloes-logos'
    );

-- Política para permitir atualização de logos
CREATE POLICY "Permitir atualização de logos" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'saloes-logos'
    );

-- Política para permitir exclusão de logos
CREATE POLICY "Permitir exclusão de logos" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'saloes-logos'
    );

-- =====================================================
-- VERIFICAÇÃO DAS TABELAS CRIADAS
-- =====================================================
-- Execute esta query para verificar se tudo foi criado corretamente:

/*
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('saloes', 'clientes')
ORDER BY tablename;

-- Verificar se o bucket foi criado
SELECT * FROM storage.buckets WHERE id = 'saloes-logos';
*/

-- =====================================================
-- INSTRUÇÕES FINAIS
-- =====================================================
/*
APÓS EXECUTAR ESTE SCRIPT:

1. Vá para Settings > API no painel do Supabase
2. Copie a URL do projeto e a chave anon/public
3. Cole essas informações no arquivo .env.local:
   REACT_APP_SUPABASE_URL=sua_url_aqui
   REACT_APP_SUPABASE_ANON_KEY=sua_chave_aqui

4. Reinicie o servidor de desenvolvimento:
   npm start

5. Teste a aplicação criando, editando e deletando salões
6. Teste o upload de logos

PRONTO! Seu projeto agora está conectado ao Supabase!
*/