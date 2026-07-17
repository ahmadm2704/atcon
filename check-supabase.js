const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const envs = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    val = val.replace(/^['"](.*)['"]$/, '$1'); // remove quotes
    envs[match[1]] = val;
  }
});

const supabase = createClient(
  envs.NEXT_PUBLIC_SUPABASE_URL,
  envs.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('category', 'YouTube Shorts');

  if (error) {
    console.error('Error fetching media:', error);
  } else {
    console.log('Shorts from Supabase:');
    console.log(JSON.stringify(data, null, 2));
  }
}

run();
