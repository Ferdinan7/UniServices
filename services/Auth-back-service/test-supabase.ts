import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

// Crear cliente Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function testSignUp() {
  const email = 'testuser1234@gmail.com'; // usa un email que no exista todavía
  const password = '12345678';

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (error) {
      console.error('Error al registrarse:', error.message);
    } else {
      console.log('SignUp exitoso:', data);
    }
  } catch (err) {
    console.error('Error inesperado:', err);
  }
}

testSignUp();
