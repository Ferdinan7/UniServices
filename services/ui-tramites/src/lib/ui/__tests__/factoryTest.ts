// Test para verificar que el patrón Abstract Factory funciona correctamente
import { UIFactoryProvider } from '../UIFactoryProvider';
import type { IButtonFactory, ThemeType } from '../types';

console.log('🧪 Iniciando test del patrón Abstract Factory...');

// Obtener la instancia del provider
const provider = UIFactoryProvider.getInstance();

// Test 1: Verificar que se puede obtener factories para todos los temas
const themes: ThemeType[] = ['modern', 'classic', 'minimal'];

themes.forEach((theme, index) => {
  try {
    const factory = provider.getButtonFactoryByTheme(theme);
    console.log(`✅ Factory para tema '${theme}' obtenida correctamente`);

    // Test 2: Verificar que se pueden crear botones
    const primaryButton = factory.createPrimaryButton({ label: `Botón ${theme} Primary` });
    const secondaryButton = factory.createSecondaryButton({ label: `Botón ${theme} Secondary` });
    const ghostButton = factory.createGhostButton({ label: `Botón ${theme} Ghost` });

    console.log(`✅ Botones creados para tema '${theme}':`, {
      primary: primaryButton,
      secondary: secondaryButton,
      ghost: ghostButton
    });

  } catch (error) {
    console.error(`❌ Error con tema '${theme}':`, error);
  }
});

// Test 3: Verificar rotación de temas
console.log('🔄 Test de rotación de temas...');
for (let i = 0; i < 6; i++) {
  const themeIndex = i % themes.length;
  const theme = themes[themeIndex];
  const factory = provider.getButtonFactoryByTheme(theme);
  const button = factory.createPrimaryButton({ label: `Botón rotativo ${i}` });
  console.log(`Categoría ${i} -> Tema: ${theme}`, button);
}

console.log('🎉 Test del patrón Abstract Factory completado');


