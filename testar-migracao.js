const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://swkpsjovjtilyzuzobvi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a3Bzam92anRpbHl6dXpvYnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwMTAyMiwiZXhwIjoyMDY0ODc3MDIyfQ.vAn5A74lqhv8wwg7UfV9wKT1wRROy5kkm9ZOYaU8h34';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simular dados de salão como na aplicação
const dadosSalaoTeste = {
  nome: "Salão Teste Migração",
  endereco: "Rua Teste, 123",
  telefone: "(11) 99999-9999",
  email: "teste@salao.com",
  logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0iIzAwN2JmZiIvPjwvc3ZnPg==",
  logo_url: null,
  site_url: "https://salao-teste.com",
  horario_funcionamento: "Segunda a Sexta: 8h às 18h",
  servicos: ["Corte", "Escova", "Manicure"],
  descricao: "Salão de beleza completo",
  ativo: true
};

async function testarMigracao() {
  try {
    console.log('🧪 Testando migração de dados para Supabase...');
    console.log('📊 Dados a serem migrados:', JSON.stringify(dadosSalaoTeste, null, 2));
    
    // 1. Verificar conexão
    console.log('\n🔌 Verificando conexão com Supabase...');
    const { data: healthCheck, error: healthError } = await supabase
      .from('saloes')
      .select('count')
      .limit(0);
    
    if (healthError) {
      console.log('❌ Erro de conexão:', healthError.message);
      console.log('📋 Código do erro:', healthError.code);
      console.log('📋 Detalhes:', healthError.details);
      return;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // 2. Tentar inserir dados (simulando migração)
    console.log('\n📝 Tentando inserir dados na tabela saloes...');
    const { data, error } = await supabase
      .from('saloes')
      .insert(dadosSalaoTeste)
      .select();
    
    if (error) {
      console.log('❌ ERRO NA MIGRAÇÃO:');
      console.log('📋 Mensagem:', error.message);
      console.log('📋 Código:', error.code);
      console.log('📋 Detalhes:', error.details);
      console.log('📋 Hint:', error.hint);
      
      // Verificar se é o erro específico da tabela
      if (error.message.includes('Could not find the table') || 
          error.message.includes('schema cache')) {
        console.log('\n🎯 ESTE É O ERRO REPORTADO PELO USUÁRIO!');
        console.log('\n🔍 Investigando possíveis causas...');
        
        // Tentar diferentes abordagens
        console.log('\n1️⃣ Testando com schema explícito...');
        const { data: data2, error: error2 } = await supabase
          .from('public.saloes')
          .select('*')
          .limit(1);
        
        if (error2) {
          console.log('❌ Erro com schema explícito:', error2.message);
        } else {
          console.log('✅ Schema explícito funcionou!');
        }
        
        console.log('\n2️⃣ Verificando permissões RLS...');
        const { data: data3, error: error3 } = await supabase
          .from('saloes')
          .select('*')
          .limit(1);
        
        if (error3) {
          console.log('❌ Possível problema de RLS:', error3.message);
        } else {
          console.log('✅ RLS está funcionando!');
        }
      }
      
    } else {
      console.log('✅ MIGRAÇÃO REALIZADA COM SUCESSO!');
      console.log('📊 Dados inseridos:', data);
      
      // Limpar dados de teste
      if (data && data[0]) {
        await supabase
          .from('saloes')
          .delete()
          .eq('id', data[0].id);
        console.log('🗑️ Dados de teste removidos');
      }
    }
    
    // 3. Verificar estrutura atual da tabela
    console.log('\n🔍 Verificando registros existentes...');
    const { data: registros, error: errorRegistros } = await supabase
      .from('saloes')
      .select('*');
    
    if (errorRegistros) {
      console.log('❌ Erro ao buscar registros:', errorRegistros.message);
    } else {
      console.log(`📊 Total de registros na tabela: ${registros?.length || 0}`);
      if (registros && registros.length > 0) {
        console.log('🔍 Colunas disponíveis:', Object.keys(registros[0]));
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral no teste:', error.message);
    console.error('📋 Stack trace:', error.stack);
  }
}

// Executar teste
testarMigracao().then(() => {
  console.log('\n🏁 Teste de migração concluído.');
}).catch(error => {
  console.error('💥 Erro fatal:', error);
});