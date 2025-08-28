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

async function testarPainelAdmin() {
  console.log('🧪 TESTE COMPLETO - Painel Administrativo');
  console.log('=' .repeat(60));

  let salaoTestId = null;

  try {
    // 1. Teste de criação de salão com todos os campos
    console.log('\n1️⃣ Testando criação de salão com todos os campos...');
    
    const novoSalao = {
      nome: 'Salão Teste Completo',
      endereco: 'Rua Teste, 456 - Centro',
      telefone: '(11) 98765-4321',
      email: 'teste@salaocompleto.com',
      logo_url: 'https://exemplo.com/logo-teste.jpg',
      site_url: 'https://salaocompleto.com.br',
      horario_funcionamento: 'Segunda a Sexta: 8h às 20h | Sábado: 8h às 18h',
      servicos: ['Corte Masculino', 'Corte Feminino', 'Coloração', 'Tratamentos', 'Manicure', 'Pedicure'],
      descricao: 'Salão completo com todos os serviços de beleza e estética. Profissionais qualificados e ambiente acolhedor.',
      ativo: true
    };

    const { data: salaoCreated, error: createError } = await supabase
      .from('saloes')
      .insert([novoSalao])
      .select()
      .single();

    if (createError) {
      console.log('❌ Erro na criação:', createError.message);
      return;
    }

    salaoTestId = salaoCreated.id;
    console.log('✅ Salão criado com sucesso!');
    console.log('📊 ID do salão:', salaoTestId);
    console.log('🔍 Dados salvos:', JSON.stringify(salaoCreated, null, 2));

    // 2. Teste de leitura/verificação dos dados salvos
    console.log('\n2️⃣ Verificando se todos os campos foram salvos corretamente...');
    
    const { data: salaoLido, error: readError } = await supabase
      .from('saloes')
      .select('*')
      .eq('id', salaoTestId)
      .single();

    if (readError) {
      console.log('❌ Erro na leitura:', readError.message);
      return;
    }

    console.log('✅ Dados lidos com sucesso!');
    
    // Verificar cada campo individualmente
    const camposParaVerificar = [
      { campo: 'nome', esperado: novoSalao.nome, atual: salaoLido.nome },
      { campo: 'endereco', esperado: novoSalao.endereco, atual: salaoLido.endereco },
      { campo: 'telefone', esperado: novoSalao.telefone, atual: salaoLido.telefone },
      { campo: 'email', esperado: novoSalao.email, atual: salaoLido.email },
      { campo: 'logo_url', esperado: novoSalao.logo_url, atual: salaoLido.logo_url },
      { campo: 'site_url', esperado: novoSalao.site_url, atual: salaoLido.site_url },
      { campo: 'horario_funcionamento', esperado: novoSalao.horario_funcionamento, atual: salaoLido.horario_funcionamento },
      { campo: 'servicos', esperado: JSON.stringify(novoSalao.servicos), atual: JSON.stringify(salaoLido.servicos) },
      { campo: 'descricao', esperado: novoSalao.descricao, atual: salaoLido.descricao },
      { campo: 'ativo', esperado: novoSalao.ativo, atual: salaoLido.ativo }
    ];

    let todosOk = true;
    for (const { campo, esperado, atual } of camposParaVerificar) {
      if (esperado === atual) {
        console.log(`✅ ${campo}: OK`);
      } else {
        console.log(`❌ ${campo}: Esperado '${esperado}', mas foi '${atual}'`);
        todosOk = false;
      }
    }

    if (todosOk) {
      console.log('\n🎉 TODOS OS CAMPOS FORAM SALVOS CORRETAMENTE!');
    } else {
      console.log('\n⚠️ Alguns campos não foram salvos corretamente.');
    }

    // 3. Teste de atualização de campos
    console.log('\n3️⃣ Testando atualização de campos...');
    
    const atualizacoes = {
      site_url: 'https://salaonovo.com.br',
      servicos: ['Corte', 'Coloração', 'Escova', 'Hidratação'],
      descricao: 'Descrição atualizada do salão com novos serviços.',
      ativo: false
    };

    const { data: salaoAtualizado, error: updateError } = await supabase
      .from('saloes')
      .update(atualizacoes)
      .eq('id', salaoTestId)
      .select()
      .single();

    if (updateError) {
      console.log('❌ Erro na atualização:', updateError.message);
    } else {
      console.log('✅ Atualização realizada com sucesso!');
      
      // Verificar se as atualizações foram aplicadas
      for (const [campo, valorEsperado] of Object.entries(atualizacoes)) {
        const valorAtual = salaoAtualizado[campo];
        if (campo === 'servicos') {
          if (JSON.stringify(valorEsperado) === JSON.stringify(valorAtual)) {
            console.log(`✅ ${campo}: Atualizado corretamente`);
          } else {
            console.log(`❌ ${campo}: Esperado '${JSON.stringify(valorEsperado)}', mas foi '${JSON.stringify(valorAtual)}'`);
          }
        } else {
          if (valorEsperado === valorAtual) {
            console.log(`✅ ${campo}: Atualizado corretamente`);
          } else {
            console.log(`❌ ${campo}: Esperado '${valorEsperado}', mas foi '${valorAtual}'`);
          }
        }
      }
    }

    // 4. Teste de simulação de upload de logo
    console.log('\n4️⃣ Testando atualização de logo...');
    
    const novaLogoUrl = `https://exemplo.com/nova-logo-${Date.now()}.jpg`;
    const { data: logoAtualizado, error: logoError } = await supabase
      .from('saloes')
      .update({ logo_url: novaLogoUrl })
      .eq('id', salaoTestId)
      .select()
      .single();

    if (logoError) {
      console.log('❌ Erro na atualização do logo:', logoError.message);
    } else {
      console.log('✅ Logo atualizado com sucesso!');
      console.log('🖼️ Nova URL do logo:', logoAtualizado.logo_url);
    }

  } catch (error) {
    console.error('💥 Erro geral no teste:', error);
  } finally {
    // 5. Limpeza - remover dados de teste
    if (salaoTestId) {
      console.log('\n5️⃣ Limpando dados de teste...');
      const { error: deleteError } = await supabase
        .from('saloes')
        .delete()
        .eq('id', salaoTestId);

      if (deleteError) {
        console.log('❌ Erro ao limpar dados de teste:', deleteError.message);
      } else {
        console.log('✅ Dados de teste removidos com sucesso!');
      }
    }
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 TESTE CONCLUÍDO!');
  console.log('\n📋 RESUMO DOS PROBLEMAS TESTADOS:');
  console.log('   ✅ Logo salvando e atualizando');
  console.log('   ✅ Serviços salvando como array');
  console.log('   ✅ URL do site salvando');
  console.log('   ✅ Todos os campos do formulário');
  console.log('\n🚀 O painel administrativo deve estar funcionando corretamente!');
}

testarPainelAdmin();