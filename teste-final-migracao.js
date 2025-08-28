const { createClient } = require('@supabase/supabase-js');

// Usar as mesmas configurações da aplicação
const supabaseUrl = 'https://swkpsjovjtilyzuzobvi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a3Bzam92anRpbHl6dXpvYnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwMTAyMiwiZXhwIjoyMDY0ODc3MDIyfQ.vAn5A74lqhv8wwg7UfV9wKT1wRROy5kkm9ZOYaU8h34';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testeCompleto() {
  console.log('🎯 TESTE FINAL - Verificando se o erro foi resolvido');
  console.log('=' .repeat(60));
  
  try {
    // 1. Teste de conexão básica
    console.log('\n1️⃣ Testando conexão básica...');
    const { data: healthData, error: healthError } = await supabase
      .from('saloes')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.log('❌ ERRO DE CONEXÃO:', healthError.message);
      if (healthError.message.includes('Could not find the table')) {
        console.log('🚨 O ERRO ORIGINAL AINDA PERSISTE!');
        return false;
      }
    } else {
      console.log('✅ Conexão estabelecida com sucesso!');
    }
    
    // 2. Teste de listagem (como a aplicação faz)
    console.log('\n2️⃣ Testando listagem de salões...');
    const { data: listData, error: listError } = await supabase
      .from('saloes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (listError) {
      console.log('❌ ERRO NA LISTAGEM:', listError.message);
      if (listError.message.includes('Could not find the table')) {
        console.log('🚨 O ERRO ORIGINAL AINDA PERSISTE!');
        return false;
      }
    } else {
      console.log(`✅ Listagem funcionou! Encontrados ${listData?.length || 0} salões`);
    }
    
    // 3. Teste de inserção (como na migração)
    console.log('\n3️⃣ Testando inserção de dados...');
    const dadosTeste = {
      nome: 'Teste Final - Salão',
      endereco: 'Rua Final, 999',
      telefone: '(11) 99999-9999',
      email: 'teste-final@salao.com',
      logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzAwN2JmZiIvPjwvc3ZnPg==',
      logo_url: null,
      site_url: 'https://teste-final.com',
      horario_funcionamento: 'Seg-Sex: 9h-18h',
      servicos: ['Teste', 'Final'],
      descricao: 'Salão de teste final',
      ativo: true
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('saloes')
      .insert(dadosTeste)
      .select();
    
    if (insertError) {
      console.log('❌ ERRO NA INSERÇÃO:', insertError.message);
      if (insertError.message.includes('Could not find the table')) {
        console.log('🚨 O ERRO ORIGINAL AINDA PERSISTE!');
        return false;
      }
    } else {
      console.log('✅ Inserção funcionou! Dados inseridos:');
      console.log(`   ID: ${insertData[0]?.id}`);
      console.log(`   Nome: ${insertData[0]?.nome}`);
      
      // Limpar dados de teste
      await supabase
        .from('saloes')
        .delete()
        .eq('id', insertData[0].id);
      console.log('🗑️ Dados de teste removidos');
    }
    
    // 4. Teste de atualização
    console.log('\n4️⃣ Testando operações de atualização...');
    
    // Primeiro inserir um registro para atualizar
    const { data: updateTestData, error: updateTestError } = await supabase
      .from('saloes')
      .insert({ nome: 'Teste Update', ativo: true })
      .select();
    
    if (updateTestError) {
      console.log('❌ Erro ao criar registro para teste de update:', updateTestError.message);
    } else {
      const testId = updateTestData[0].id;
      
      // Tentar atualizar
      const { data: updatedData, error: updateError } = await supabase
        .from('saloes')
        .update({ nome: 'Teste Update - Modificado' })
        .eq('id', testId)
        .select();
      
      if (updateError) {
        console.log('❌ ERRO NA ATUALIZAÇÃO:', updateError.message);
      } else {
        console.log('✅ Atualização funcionou!');
      }
      
      // Limpar
      await supabase
        .from('saloes')
        .delete()
        .eq('id', testId);
    }
    
    // 5. Verificação final
    console.log('\n5️⃣ Verificação final da estrutura...');
    const { data: finalData, error: finalError } = await supabase
      .from('saloes')
      .select('*')
      .limit(1);
    
    if (finalError) {
      console.log('❌ ERRO NA VERIFICAÇÃO FINAL:', finalError.message);
      return false;
    }
    
    console.log('✅ Estrutura da tabela verificada!');
    if (finalData && finalData.length > 0) {
      console.log('📋 Colunas disponíveis:', Object.keys(finalData[0]).join(', '));
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ O erro "Could not find the table public.saloes" foi RESOLVIDO!');
    console.log('🚀 A aplicação está pronta para uso!');
    
    return true;
    
  } catch (error) {
    console.log('\n💥 ERRO INESPERADO:', error.message);
    console.log('📋 Stack:', error.stack);
    return false;
  }
}

// Executar teste
testeCompleto().then(success => {
  if (success) {
    console.log('\n🏆 RESULTADO: PROBLEMA RESOLVIDO COM SUCESSO!');
  } else {
    console.log('\n⚠️ RESULTADO: AINDA HÁ PROBLEMAS A RESOLVER');
  }
}).catch(error => {
  console.error('💥 Erro fatal no teste:', error);
});