const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verificarEstrutura() {
  console.log('🔍 Verificando estrutura da tabela saloes...');
  console.log('=' .repeat(60));

  try {
    // 1. Tentar inserir um registro completo para ver quais campos são aceitos
    console.log('\n1️⃣ Testando inserção com todos os campos...');
    
    const dadosCompletos = {
      nome: 'Teste Estrutura',
      endereco: 'Rua Teste, 123',
      telefone: '(11) 99999-9999',
      email: 'teste@teste.com',
      logo_url: 'https://exemplo.com/logo.jpg',
      site_url: 'https://teste.com',
      horario_funcionamento: 'Seg-Sex: 9h às 18h',
      servicos: ['Corte', 'Coloração'],
      descricao: 'Salão de teste',
      ativo: true
    };

    const { data: insertData, error: insertError } = await supabase
      .from('saloes')
      .insert([dadosCompletos])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Erro na inserção:', insertError.message);
      console.log('📝 Detalhes:', insertError.details);
      console.log('💡 Hint:', insertError.hint);
    } else {
      console.log('✅ Inserção bem-sucedida!');
      console.log('📊 Dados inseridos:', JSON.stringify(insertData, null, 2));
      
      // Limpar o registro de teste
      await supabase.from('saloes').delete().eq('id', insertData.id);
      console.log('🗑️ Registro de teste removido');
    }

    // 2. Tentar buscar registros existentes para ver a estrutura
    console.log('\n2️⃣ Verificando registros existentes...');
    const { data: existingData, error: selectError } = await supabase
      .from('saloes')
      .select('*')
      .limit(1);

    if (selectError) {
      console.log('❌ Erro na consulta:', selectError.message);
    } else {
      console.log(`📊 Encontrados ${existingData?.length || 0} registros`);
      if (existingData && existingData.length > 0) {
        console.log('🔍 Estrutura do primeiro registro:');
        console.log(JSON.stringify(existingData[0], null, 2));
        console.log('\n📋 Campos disponíveis:', Object.keys(existingData[0]).join(', '));
      }
    }

    // 3. Testar campos específicos individualmente
    console.log('\n3️⃣ Testando campos específicos...');
    const camposParaTestar = [
      { campo: 'site_url', valor: 'https://teste.com' },
      { campo: 'horario_funcionamento', valor: 'Seg-Sex: 9h às 18h' },
      { campo: 'servicos', valor: ['Corte', 'Coloração'] },
      { campo: 'descricao', valor: 'Descrição teste' },
      { campo: 'ativo', valor: true }
    ];

    for (const { campo, valor } of camposParaTestar) {
      const dadosTeste = {
        nome: `Teste ${campo}`,
        [campo]: valor
      };

      const { data, error } = await supabase
        .from('saloes')
        .insert([dadosTeste])
        .select()
        .single();

      if (error) {
        console.log(`❌ Campo '${campo}': ${error.message}`);
      } else {
        console.log(`✅ Campo '${campo}': OK`);
        // Limpar registro de teste
        await supabase.from('saloes').delete().eq('id', data.id);
      }
    }

  } catch (error) {
    console.error('💥 Erro geral:', error);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 Verificação concluída!');
}

verificarEstrutura();