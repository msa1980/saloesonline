const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase usando as credenciais fornecidas
const supabaseUrl = 'https://swkpsjovjtilyzuzobvi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a3Bzam92anRpbHl6dXpvYnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwMTAyMiwiZXhwIjoyMDY0ODc3MDIyfQ.vAn5A74lqhv8wwg7UfV9wKT1wRROy5kkm9ZOYaU8h34';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verificarTabelas() {
  try {
    console.log('🔄 Verificando conexão com Supabase...');
    console.log('📍 URL:', supabaseUrl);
    
    // Verificar se as tabelas existem
    console.log('\n🔍 Verificando se as tabelas existem...');
    
    // Tentar acessar a tabela saloes
    const { data: saloesData, error: saloesError } = await supabase
      .from('saloes')
      .select('*')
      .limit(1);
    
    // Tentar acessar a tabela clientes
    const { data: clientesData, error: clientesError } = await supabase
      .from('clientes')
      .select('*')
      .limit(1);
    
    console.log('\n📋 RESULTADO DA VERIFICAÇÃO:');
    console.log('================================');
    
    if (saloesError) {
      console.log('❌ Tabela SALOES: NÃO EXISTE');
      console.log('   Erro:', saloesError.message);
    } else {
      console.log('✅ Tabela SALOES: EXISTE e está acessível');
      console.log('   Registros encontrados:', saloesData?.length || 0);
    }
    
    if (clientesError) {
      console.log('❌ Tabela CLIENTES: NÃO EXISTE');
      console.log('   Erro:', clientesError.message);
    } else {
      console.log('✅ Tabela CLIENTES: EXISTE e está acessível');
      console.log('   Registros encontrados:', clientesData?.length || 0);
    }
    
    // Verificar se ambas as tabelas existem
    if (!saloesError && !clientesError) {
      console.log('\n🎉 PERFEITO! Todas as tabelas estão criadas e funcionando!');
      console.log('✨ Você pode tentar a migração novamente na aplicação.');
      return true;
    } else {
      console.log('\n⚠️  PROBLEMA IDENTIFICADO: Tabelas não existem no Supabase');
      console.log('\n🔧 SOLUÇÃO OBRIGATÓRIA:');
      console.log('================================');
      console.log('1. 🌐 Acesse: https://supabase.com/dashboard/project/swkpsjovjtilyzuzobvi');
      console.log('2. 📝 Clique em "SQL Editor" no menu lateral');
      console.log('3. 📋 Abra o arquivo "EXECUTAR_NO_SUPABASE.sql" deste projeto');
      console.log('4. 📄 Copie TODO o conteúdo do arquivo');
      console.log('5. 📝 Cole no SQL Editor do Supabase');
      console.log('6. ▶️  Clique em "RUN" para executar');
      console.log('7. ✅ Aguarde a confirmação de sucesso');
      console.log('8. 🔄 Execute este script novamente para verificar');
      console.log('\n📁 Arquivo necessário: EXECUTAR_NO_SUPABASE.sql');
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ ERRO DE CONEXÃO:', error.message);
    console.error('📝 Detalhes:', error);
    
    console.log('\n🔧 POSSÍVEIS CAUSAS:');
    console.log('- Credenciais incorretas');
    console.log('- Projeto Supabase não configurado');
    console.log('- Problemas de rede');
    
    return false;
  }
}

// Executar verificação
console.log('🚀 VERIFICADOR DE TABELAS SUPABASE');
console.log('==================================');
verificarTabelas().then(sucesso => {
  if (sucesso) {
    console.log('\n🎯 STATUS: PRONTO PARA MIGRAÇÃO');
  } else {
    console.log('\n🎯 STATUS: REQUER AÇÃO MANUAL');
  }
  console.log('\n✋ Pressione Ctrl+C para sair');
});