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

async function verificarECriarBucket() {
  console.log('🔍 VERIFICANDO E CRIANDO BUCKET DE STORAGE');
  console.log('=' .repeat(60));

  try {
    // 1. Verificar se o bucket existe
    console.log('\n1️⃣ Verificando se o bucket "saloes-logos" existe...');
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.log('❌ Erro ao listar buckets:', listError.message);
      return;
    }
    
    console.log('📋 Buckets existentes:', buckets.map(b => b.name));
    
    const bucketExists = buckets.some(bucket => bucket.name === 'saloes-logos');
    
    if (bucketExists) {
      console.log('✅ Bucket "saloes-logos" já existe!');
    } else {
      console.log('⚠️ Bucket "saloes-logos" não encontrado. Tentando criar...');
      
      // 2. Criar o bucket
      const { data: createData, error: createError } = await supabase.storage
        .createBucket('saloes-logos', {
          public: true,
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
          fileSizeLimit: 5242880 // 5MB
        });
      
      if (createError) {
        console.log('❌ Erro ao criar bucket:', createError.message);
        console.log('💡 Você precisa criar o bucket manualmente no painel do Supabase:');
        console.log('   1. Vá para Storage no painel do Supabase');
        console.log('   2. Clique em "New bucket"');
        console.log('   3. Nome: saloes-logos');
        console.log('   4. Marque como "Public bucket"');
        console.log('   5. Clique em "Create bucket"');
        return;
      }
      
      console.log('✅ Bucket "saloes-logos" criado com sucesso!');
    }
    
    // 3. Testar upload de arquivo
    console.log('\n2️⃣ Testando upload de arquivo...');
    
    // Criar um arquivo de teste simples
    const testContent = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzAwN2JmZiIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVzdGU8L3RleHQ+PC9zdmc+';
    
    // Converter base64 para blob
    const response = await fetch(testContent);
    const blob = await response.blob();
    
    const fileName = `teste-${Date.now()}.svg`;
    const filePath = `logos/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('saloes-logos')
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (uploadError) {
      console.log('❌ Erro no teste de upload:', uploadError.message);
      return;
    }
    
    console.log('✅ Teste de upload realizado com sucesso!');
    
    // 4. Obter URL pública
    console.log('\n3️⃣ Testando obtenção de URL pública...');
    
    const { data: { publicUrl } } = supabase.storage
      .from('saloes-logos')
      .getPublicUrl(filePath);
    
    console.log('✅ URL pública gerada:', publicUrl);
    
    // 5. Limpar arquivo de teste
    console.log('\n4️⃣ Limpando arquivo de teste...');
    
    const { error: deleteError } = await supabase.storage
      .from('saloes-logos')
      .remove([filePath]);
    
    if (deleteError) {
      console.log('⚠️ Aviso: Não foi possível remover o arquivo de teste:', deleteError.message);
    } else {
      console.log('✅ Arquivo de teste removido com sucesso!');
    }
    
    // 6. Verificar políticas de storage
    console.log('\n5️⃣ Verificando políticas de storage...');
    
    try {
      // Tentar listar arquivos para verificar se as políticas estão corretas
      const { data: files, error: listFilesError } = await supabase.storage
        .from('saloes-logos')
        .list('logos', {
          limit: 1
        });
      
      if (listFilesError) {
        console.log('⚠️ Possível problema com políticas de storage:', listFilesError.message);
        console.log('💡 Você pode precisar configurar as políticas manualmente no Supabase:');
        console.log('   1. Vá para Storage > Policies no painel do Supabase');
        console.log('   2. Crie políticas para permitir SELECT, INSERT, UPDATE, DELETE');
        console.log('   3. Configure para o bucket "saloes-logos"');
      } else {
        console.log('✅ Políticas de storage funcionando corretamente!');
      }
    } catch (policyError) {
      console.log('⚠️ Erro ao verificar políticas:', policyError);
    }
    
  } catch (error) {
    console.error('💥 Erro geral:', error);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 VERIFICAÇÃO CONCLUÍDA!');
  console.log('\n📋 PRÓXIMOS PASSOS:');
  console.log('   1. Se o bucket foi criado com sucesso, teste o upload no painel admin');
  console.log('   2. Se houve erro, siga as instruções para criar manualmente');
  console.log('   3. Verifique se as políticas de storage estão configuradas');
  console.log('\n🚀 Após resolver, o upload de logos deve funcionar!');
}

verificarECriarBucket();