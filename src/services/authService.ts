import bcrypt from 'bcryptjs';

// Configurações de segurança
const SALT_ROUNDS = 12;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

// Interface para dados de usuário
interface User {
  username: string;
  passwordHash: string;
  role: string;
}

// Interface para tentativas de login
interface LoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// Usuário administrador com senha hasheada
const ADMIN_USER: User = {
  username: 'thelo1980',
  // Hash da senha 'msa198320' - gerado com bcrypt
  passwordHash: '$2b$12$uN6eM99ovA42NXcanUawAeRTswba6o8x5ioJbMPkpV.eH4zPk5Zxy',
  role: 'admin'
};

// Armazenamento temporário de tentativas de login (em produção seria no banco de dados)
const loginAttempts = new Map<string, LoginAttempt>();

// Função para gerar hash da senha
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Erro ao processar senha');
  }
};

// Função para verificar senha
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
};

// Função para verificar se o usuário está bloqueado
const isUserLocked = (username: string): boolean => {
  const attempts = loginAttempts.get(username);
  if (!attempts || !attempts.lockedUntil) return false;
  
  if (Date.now() > attempts.lockedUntil) {
    // Desbloqueio automático
    loginAttempts.delete(username);
    return false;
  }
  
  return true;
};

// Função para registrar tentativa de login
const recordLoginAttempt = (username: string, success: boolean): void => {
  const now = Date.now();
  const attempts = loginAttempts.get(username) || { count: 0, lastAttempt: now };
  
  if (success) {
    // Login bem-sucedido - limpar tentativas
    loginAttempts.delete(username);
    return;
  }
  
  // Login falhado - incrementar contador
  attempts.count += 1;
  attempts.lastAttempt = now;
  
  // Bloquear se exceder o limite
  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.lockedUntil = now + LOCKOUT_TIME;
  }
  
  loginAttempts.set(username, attempts);
};

// Função principal de autenticação
export const authenticateUser = async (username: string, password: string): Promise<{
  success: boolean;
  message: string;
  token?: string;
  user?: { username: string; role: string };
}> => {
  try {
    // Verificar se o usuário está bloqueado
    if (isUserLocked(username)) {
      const attempts = loginAttempts.get(username);
      const remainingTime = attempts?.lockedUntil ? Math.ceil((attempts.lockedUntil - Date.now()) / 60000) : 0;
      return {
        success: false,
        message: `Conta temporariamente bloqueada. Tente novamente em ${remainingTime} minutos.`
      };
    }
    
    // Verificar se o usuário existe
    if (username !== ADMIN_USER.username) {
      recordLoginAttempt(username, false);
      return {
        success: false,
        message: 'Credenciais inválidas.'
      };
    }
    
    // Verificar senha
    const isValidPassword = await verifyPassword(password, ADMIN_USER.passwordHash);
    
    if (!isValidPassword) {
      recordLoginAttempt(username, false);
      return {
        success: false,
        message: 'Credenciais inválidas.'
      };
    }
    
    // Login bem-sucedido
    recordLoginAttempt(username, true);
    
    // Gerar token JWT simulado (em produção seria um JWT real)
    const token = generateSecureToken(username);
    
    return {
      success: true,
      message: 'Login realizado com sucesso.',
      token,
      user: {
        username: ADMIN_USER.username,
        role: ADMIN_USER.role
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: 'Erro interno do servidor.'
    };
  }
};

// Função para gerar token seguro
const generateSecureToken = (username: string): string => {
  const timestamp = Date.now();
  const randomBytes = Math.random().toString(36).substring(2, 15);
  const payload = btoa(JSON.stringify({
    username,
    timestamp,
    expires: timestamp + (24 * 60 * 60 * 1000), // 24 horas
    random: randomBytes
  }));
  
  return `Bearer.${payload}.${btoa(randomBytes + timestamp)}`;
};

// Função para validar token
export const validateToken = (token: string): {
  valid: boolean;
  user?: { username: string; role: string };
} => {
  try {
    if (!token || !token.startsWith('Bearer.')) {
      return { valid: false };
    }
    
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar expiração
    if (Date.now() > payload.expires) {
      return { valid: false };
    }
    
    // Verificar se o usuário ainda é válido
    if (payload.username !== ADMIN_USER.username) {
      return { valid: false };
    }
    
    return {
      valid: true,
      user: {
        username: ADMIN_USER.username,
        role: ADMIN_USER.role
      }
    };
    
  } catch (error) {
    return { valid: false };
  }
};

// Função para logout
export const logout = (): void => {
  // Remover token do localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminAuthenticated');
};

// Função para verificar se está autenticado
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  
  const validation = validateToken(token);
  return validation.valid;
};

// Função utilitária para obter informações do usuário atual
export const getCurrentUser = (): { username: string; role: string } | null => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  const validation = validateToken(token);
  return validation.valid ? validation.user || null : null;
};

// Função para gerar hash da senha atual (utilitário para desenvolvimento)
export const generatePasswordHash = async (password: string): Promise<void> => {
  const hash = await hashPassword(password);
  console.log(`Hash da senha '${password}':`, hash);
};

// Descomente a linha abaixo para gerar o hash da nova senha durante o desenvolvimento
// generatePasswordHash('msa198320');