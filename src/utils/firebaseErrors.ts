import { FirebaseError } from 'firebase/app';

const messages: Record<string, string> = {
  'auth/email-already-in-use': 'Este e-mail já está cadastrado. Tente entrar ou use outro e-mail.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/operation-not-allowed':
    'Login por e-mail/senha não está ativado no Firebase. Vá em Authentication → Sign-in method → E-mail/senha → Ativar.',
  'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Usuário não encontrado. Crie uma conta primeiro.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
  'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  'auth/configuration-not-found':
    'Authentication não configurado no Firebase. Ative E-mail/senha no console.',
};

export function getFirebaseErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError) {
    return messages[error.code] ?? `Erro Firebase (${error.code}): ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
