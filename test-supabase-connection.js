// Script para testar a conexão com o Supabase
// Execute com: node test-supabase-connection.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configurações do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NÃO DEFINIDA');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('\n1. Testando conexão básica...');
    
    // Teste 1: Verificar se consegue conectar
    const { data: healthCheck, error: healthError } = await supabase
      .from('_supabase_health_check')
      .select('*')
      .limit(1);
    
    if (healthError && !healthError.message.includes('relation "_supabase_health_check" does not exist')) {
      console.error('❌ Erro de conexão:', healthError.message);
      return;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    
    console.log('\n2. Verificando se as tabelas existem...');
    
    // Teste 2: Verificar tabelas
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables_info')
      .then(() => ({ data: 'RPC disponível', error: null }))
      .catch(async () => {
        // Fallback: tentar acessar diretamente as tabelas
        const { data, error } = await supabase
          .from('saloes')
          .select('count')
          .limit(1);
        return { data, error };
      });
    
    if (tablesError) {
      console.error('❌ Tabela "saloes" não encontrada:', tablesError.message);
      console.log('\n📋 SOLUÇÃO:');
      console.log('1. Acesse o painel do Supabase: https://supabase.com/');
      console.log('2. Vá para SQL Editor');
      console.log('3. Execute o script supabase-setup.sql');
      console.log('4. Verifique se as tabelas foram criadas');
      return;
    }
    
    console.log('✅ Tabela "saloes" encontrada!');
    
    console.log('\n3. Testando operações CRUD...');
    
    // Teste 3: Inserir dados de teste
    const testSalao = {
      nome: 'Teste Conexão',
      endereco: 'Endereço de teste',
      telefone: '(11) 99999-9999',
      email: 'teste@teste.com'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('saloes')
      .insert([testSalao])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Erro ao inserir dados:', insertError.message);
      return;
    }
    
    console.log('✅ Inserção bem-sucedida!');
    
    // Teste 4: Buscar dados
    const { data: selectData, error: selectError } = await supabase
      .from('saloes')
      .select('*')
      .eq('id', insertData.id)
      .single();
    
    if (selectError) {
      console.error('❌ Erro ao buscar dados:', selectError.message);
      return;
    }
    
    console.log('✅ Busca bem-sucedida!');
    
    // Teste 5: Limpar dados de teste
    const { error: deleteError } = await supabase
      .from('saloes')
      .delete()
      .eq('id', insertData.id);
    
    if (deleteError) {
      console.error('⚠️ Aviso: Não foi possível limpar dados de teste:', deleteError.message);
    } else {
      console.log('✅ Limpeza bem-sucedida!');
    }
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('Sua conexão com o Supabase está funcionando perfeitamente.');
    
  } catch (error) {
    console.error('❌ Erro inesperado:', error.message);
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se as variáveis de ambiente estão corretas');
    console.log('2. Confirme se o projeto Supabase está ativo');
    console.log('3. Execute o script supabase-setup.sql no SQL Editor');
    console.log('4. Verifique as permissões RLS (Row Level Security)');
  }
}

testConnection();