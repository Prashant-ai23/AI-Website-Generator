import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/v1';

async function test() {
  try {
    console.log('🚀 Testing generation with wait...\n');

    // Login
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123',
    });

    const token = loginRes.data.data.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    console.log('✅ Logged in\n');

    // Generate project
    const genRes = await axios.post(
      `${BASE_URL}/ai-generator/generate`,
      {
        name: 'E-commerce Store',
        slug: 'ecommerce-store',
        prompt: 'Create an e-commerce store with products, cart, checkout, user authentication, and admin panel',
        projectType: 'fullstack',
        techStack: {
          frontend: 'React',
          backend: 'Express.js',
          database: 'MongoDB',
          authentication: 'JWT',
        },
        options: {
          includeTests: false,
          includeDocumentation: true,
          useDocker: true,
        },
      },
      config
    );

    const projectId = genRes.data.data.project._id;
    console.log(`📦 Project created: ${projectId}\n`);

    // Wait for generation
    console.log('⏳ Waiting for generation to complete...');
    let completed = false;
    let attempts = 0;
    let lastProgress = 0;

    while (!completed && attempts < 120) {
      await new Promise((r) => setTimeout(r, 2000));

      const statusRes = await axios.get(
        `${BASE_URL}/ai-generator/projects/${projectId}`,
        config
      );

      const project = statusRes.data.data.project;
      const progress = project.metadata?.progress || 0;
      const phase = project.metadata?.currentPhase || 'unknown';

      if (progress > lastProgress) {
        console.log(`  📊 Progress: ${progress}% - Phase: ${phase}`);
        lastProgress = progress;
      }

      if (progress >= 100 || phase === 'completed') {
        completed = true;
        console.log(`\n✅ Generation completed!\n`);
      }

      attempts++;
    }

    // Get files
    const filesRes = await axios.get(
      `${BASE_URL}/ai-generator/projects/${projectId}/files`,
      config
    );

    const files = filesRes.data.data.files;
    console.log(`📁 Generated ${files.length} files:\n`);

    const categories = {};
    files.forEach((file) => {
      const cat = file.category || 'other';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(file.fileName);
    });

    for (const [cat, fileList] of Object.entries(categories)) {
      console.log(`  ${cat.toUpperCase()}: ${fileList.length} files`);
      fileList.slice(0, 3).forEach((f) => console.log(`    - ${f}`));
      if (fileList.length > 3) console.log(`    ... and ${fileList.length - 3} more`);
    }

    console.log('\n✨ Generation test successful!');
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

test();
