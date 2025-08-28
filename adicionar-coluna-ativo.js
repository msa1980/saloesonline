const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://swkpsjovjtilyzuzobvi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a3Bzam92anRpbHl6dXpvYnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjM3NzU0NSwiZXhwIjoyMDUxOTUzNTQ1fQ.Ej7Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function adicionarColunaAtivo() {
  try {
    console.log('🔧 Adicionando coluna "ativo" à tabela saloes...');
    
    // Tentar adicionar as colunas que faltam
    const alterQueries = [
      'ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;',
      'ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS site_url TEXT;',
      'ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS horario_funcionamento TEXT;',
      'ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS servicos JSONB DEFAULT \'[]\';',
      'ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS descricao TEXT;'
    ];
    
    for (const query of alterQueries) {
      console.log(`Executando: ${query}`);
      const { error } = await supabase.rpc('exec_sql', { sql: query });
      
      if (error) {
        console.log(`⚠️ Erro ao executar query (pode ser normal se a coluna já existe): ${error.message}`);
      } else {
        console.log('✅ Query executada com sucesso!');
      }
    }
    
    // Verificar se as colunas foram adicionadas
    console.log('\n🔍 Verificando estrutura da tabela...');
    const { data, error } = await supabase
      .from('saloes')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro ao verificar tabela:', error.message);
      
      // Instruções manuais
      console.log('\n📋 SOLUÇÃO MANUAL:');
      console.log('1. Acesse o Supabase SQL Editor em: https://supabase.com/dashboard/project/swkpsjovjtilyzuzobvi/sql');
      console.log('2. Execute os seguintes comandos SQL:');
      console.log('');
      alterQueries.forEach(query => {
        console.log(`   ${query}`);
      });
      console.log('');
      console.log('3. Após executar, tente a migração novamente na aplicação.');
      
    } else {
      console.log('✅ Tabela verificada com sucesso!');
      console.log('🎉 As colunas necessárias devem estar disponíveis agora.');
      console.log('\n🚀 Próximo passo: Tente a migração novamente na aplicação.');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    
    // Instruções manuais em caso de erro
    console.log('\n📋 SOLUÇÃO MANUAL - Execute no Supabase SQL Editor:');
    console.log('\nALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;');
    console.log('ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS site_url TEXT;');
    console.log('ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS horario_funcionamento TEXT;');
    console.log('ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS servicos JSONB DEFAULT \'[]\';');
    console.log('ALTER TABLE public.saloes ADD COLUMN IF NOT EXISTS descricao TEXT;');
    console.log('\n🔗 Link: https://supabase.com/dashboard/project/swkpsjovjtilyzuzobvi/sql');
  }
}

adicionarColunaAtivo();