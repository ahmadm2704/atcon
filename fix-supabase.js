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
  // Update the Atcon Premium Material Reel
  const { data: d1, error: e1 } = await supabase
    .from('media')
    .update({ 
      video_id: 'fKcnCBdEKLk', 
      image_url: 'https://i.ytimg.com/vi/fKcnCBdEKLk/hq2.jpg' 
    })
    .like('video_id', '%fKcnCBdEKLk%');

  console.log('Fixed fKcnCBdEKLk', e1);

  // Update the Atcon Engineers & Developers short (isx5Gk7ogmw)
  const { data: d2, error: e2 } = await supabase
    .from('media')
    .update({ 
      video_id: 'isx5Gk7ogmw', 
      image_url: 'https://i.ytimg.com/vi/isx5Gk7ogmw/hq2.jpg' 
    })
    .like('video_id', '%isx5Gk7ogmw%');

  console.log('Fixed isx5Gk7ogmw', e2);
  
  console.log('Database repair completed.');
}

run();
