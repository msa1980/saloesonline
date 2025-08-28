const { createClient } = require('@supabase/supabase-js');

// Configurações do Supabase
const supabaseUrl = 'https://swkpsjovjtilyzuzobvi.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a3Bzam92anRpbHl6dXpvYnZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTMwMTAyMiwiZXhwIjoyMDY0ODc3MDIyfQ.vAn5A74lqhv8wwg7UfV9wKT1wRROy5kkm9ZOYaU8h34';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testarEstrutura() {
  try {
    console.log('🔍 Testando estrutura da tabela saloes...');
    
    // Tentar inserir um registro de teste com todas as colunas que a aplicação espera
    const dadosTeste = {
      nome: 'Teste Salão',
      endereco: 'Rua Teste, 123',
      telefone: '(11) 99999-9999',
      email: 'teste@teste.com',
      logo: 'data:image/png;base64,test', // Coluna que estava causando erro
      logo_url: 'https://exemplo.com/logo.png',
      site_url: 'https://exemplo.com',
      horario_funcionamento: '08:00-18:00',
      servicos: ['Corte', 'Escova'],
      descricao: 'Salão de teste',
      ativo: true
    };
    
    console.log('📝 Tentando inserir dados de teste...');
    const { data, error } = await supabase
      .from('saloes')
      .insert(dadosTeste)
      .select();
    
    if (error) {
      console.log('❌ Erro ao inserir:', error.message);
      console.log('📋 Detalhes:', error.details);
      console.log('💡 Hint:', error.hint);
      
      // Tentar inserir apenas com colunas básicas
      console.log('\n🔄 Tentando inserir apenas colunas básicas...');
      const dadosBasicos = {
        nome: 'Teste Salão Básico',
        endereco: 'Rua Teste, 456'
      };
      
      const { data: dataBasico, error: errorBasico } = await supabase
        .from('saloes')
        .insert(dadosBasicos)
        .select();
      
      if (errorBasico) {
        console.log('❌ Erro mesmo com dados básicos:', errorBasico.message);
      } else {
        console.log('✅ Inserção básica funcionou!');
        console.log('📊 Dados inseridos:', dataBasico);
        
        // Deletar o registro de teste
        await supabase
          .from('saloes')
          .delete()
          .eq('id', dataBasico[0].id);
        console.log('🗑️ Registro de teste removido');
      }
      
    } else {
      console.log('✅ Inserção completa funcionou!');
      console.log('📊 Dados inseridos:', data);
      
      // Deletar o registro de teste
      await supabase
        .from('saloes')
        .delete()
        .eq('id', data[0].id);
      console.log('🗑️ Registro de teste removido');
    }
    
    // Tentar listar registros existentes para ver a estrutura
    console.log('\n📋 Listando registros existentes...');
    const { data: registros, error: errorListar } = await supabase
      .from('saloes')
      .select('*')
      .limit(1);
    
    if (errorListar) {
      console.log('❌ Erro ao listar:', errorListar.message);
    } else {
      console.log('📊 Registros encontrados:', registros?.length || 0);
      if (registros && registros.length > 0) {
        console.log('🔍 Estrutura do primeiro registro:');
        console.log(Object.keys(registros[0]));
      }
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testarEstrutura();