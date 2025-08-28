const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://swkpsjovjtilyzuzobvi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a3Bzam92anRpbHl6dXpvYnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwMTAyMiwiZXhwIjoyMDY0ODc3MDIyfQ.vAn5A74lqhv8wwg7UfV9wKT1wRROy5kkm9ZOYaU8h34';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function criarTabelaSaloes() {
  try {
    console.log('🔌 Conectando ao Supabase...');
    
    // Testar conexão básica
    const { data: testData, error: testError } = await supabase
      .from('_supabase_health_check')
      .select('*')
      .limit(1);
    
    if (testError && !testError.message.includes('does not exist')) {
      throw new Error(`Erro de conexão: ${testError.message}`);
    }
    
    console.log('✅ Conectado ao Supabase com sucesso!');
    
    // Como o Supabase não permite executar DDL via API REST,
    // vamos usar uma abordagem diferente: executar via SQL usando rpc
    
    console.log('🏗️ Criando tabelas via SQL...');
    
    // SQL completo para criar as tabelas
    const sqlScript = `
      -- Criar tabela saloes
      CREATE TABLE IF NOT EXISTS public.saloes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        endereco TEXT,
        telefone VARCHAR(20),
        email VARCHAR(255),
        logo TEXT,
        logo_url TEXT,
        site_url TEXT,
        horario_funcionamento TEXT,
        servicos JSONB DEFAULT '[]'::jsonb,
        descricao TEXT,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Criar tabela clientes
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
      
      -- Habilitar RLS
      ALTER TABLE public.saloes ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
      
      -- Criar políticas
      DROP POLICY IF EXISTS "Permitir todas as operações em saloes" ON public.saloes;
      CREATE POLICY "Permitir todas as operações em saloes" ON public.saloes
        FOR ALL USING (true) WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Permitir todas as operações em clientes" ON public.clientes;
      CREATE POLICY "Permitir todas as operações em clientes" ON public.clientes
        FOR ALL USING (true) WITH CHECK (true);
      
      -- Criar índices
      CREATE INDEX IF NOT EXISTS idx_saloes_nome ON public.saloes(nome);
      CREATE INDEX IF NOT EXISTS idx_saloes_ativo ON public.saloes(ativo);
      CREATE INDEX IF NOT EXISTS idx_clientes_salao_id ON public.clientes(salao_id);
      
      -- Criar função para updated_at
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      -- Criar triggers
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
    `;
    
    // Tentar executar via RPC (se disponível)
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: sqlScript });
      
      if (error) {
        console.log('⚠️ RPC exec_sql não disponível, isso é normal.');
        console.log('📋 Erro:', error.message);
      } else {
        console.log('✅ Tabelas criadas via RPC!');
      }
    } catch (rpcError) {
      console.log('⚠️ RPC não disponível, tentando método alternativo...');
    }
    
    // Verificar se as tabelas existem tentando acessá-las
    console.log('🔍 Verificando se as tabelas existem...');
    
    try {
      const { data: saloesData, error: saloesError } = await supabase
        .from('saloes')
        .select('*')
        .limit(1);
      
      if (saloesError) {
        console.log('❌ Tabela saloes não existe ou não está acessível.');
        console.log('📋 Erro:', saloesError.message);
        
        // Instruções manuais
        console.log('\n📋 SOLUÇÃO MANUAL NECESSÁRIA:');
        console.log('1. Acesse: https://supabase.com/dashboard/project/swkpsjovjtilyzuzobvi/sql');
        console.log('2. Copie e execute o conteúdo do arquivo CORRIGIR_TABELA_SALOES.sql');
        console.log('3. Após executar, tente a migração novamente na aplicação.');
        
      } else {
        console.log('✅ Tabela saloes existe e está acessível!');
        console.log(`📊 Registros encontrados: ${saloesData?.length || 0}`);
      }
      
      const { data: clientesData, error: clientesError } = await supabase
        .from('clientes')
        .select('*')
        .limit(1);
      
      if (clientesError) {
        console.log('❌ Tabela clientes não existe ou não está acessível.');
      } else {
        console.log('✅ Tabela clientes existe e está acessível!');
        console.log(`📊 Registros encontrados: ${clientesData?.length || 0}`);
      }
      
    } catch (verifyError) {
      console.error('❌ Erro ao verificar tabelas:', verifyError.message);
    }
    
    console.log('\n🎯 PRÓXIMOS PASSOS:');
    console.log('1. Se as tabelas não existem, execute manualmente o SQL no Supabase');
    console.log('2. Use o arquivo CORRIGIR_TABELA_SALOES.sql');
    console.log('3. Após criar as tabelas, teste a migração na aplicação');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    
    console.log('\n📋 SOLUÇÃO MANUAL:');
    console.log('1. Acesse: https://supabase.com/dashboard/project/swkpsjovjtilyzuzobvi/sql');
    console.log('2. Execute o conteúdo do arquivo CORRIGIR_TABELA_SALOES.sql');
    console.log('3. Isso criará todas as tabelas e colunas necessárias');
  }
}

criarTabelaSaloes();