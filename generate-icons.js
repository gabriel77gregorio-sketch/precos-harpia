import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function generateIcons() {
  const inputLogo = path.resolve('public/harpia-logo.jpg');
  const publicDir = path.resolve('public');

  console.log('Gerando ícones a partir de:', inputLogo);

  // Carregar imagem e obter metadados
  const image = sharp(inputLogo);
  const metadata = await image.metadata();

  const sizes = [
    { name: 'pwa-192x192.png', size: 192, padding: 20 },
    { name: 'pwa-512x512.png', size: 512, padding: 40 },
    { name: 'pwa-maskable-512x512.png', size: 512, padding: 80 },
    { name: 'apple-touch-icon-180x180.png', size: 180, padding: 16 },
    { name: 'favicon-32x32.png', size: 32, padding: 2 }
  ];

  for (const { name, size, padding } of sizes) {
    const innerSize = size - (padding * 2);
    
    // Redimensionar mantendo proporção
    const resizedLogo = await sharp(inputLogo)
      .resize({
        width: innerSize,
        height: innerSize,
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer();

    // Compor em canvas quadrado branco
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
    .composite([{ input: resizedLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, name));

    console.log(`Gerado: ${name}`);
  }

  console.log('Todos os ícones PWA foram gerados com sucesso!');
}

generateIcons().catch(console.error);
