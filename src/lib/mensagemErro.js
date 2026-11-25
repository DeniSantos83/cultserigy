// Mensagens públicas: nunca reproduzir mensagens arbitrárias do servidor.
export function mensagemErro(error, fallback = 'Não foi possível concluir a operação. Tente novamente.') {
  const code = String(error?.code ?? '');
  const status = Number(error?.status ?? 0);
  const message = String(error?.message ?? '');
  if (import.meta.env?.DEV) console.debug('[CultSerigy] Falha:', { code, status });
  if (code === 'invalid_credentials') return 'E-mail ou senha incorretos.';
  if (code === 'email_not_confirmed') return 'Confirme seu e-mail antes de entrar.';
  if (code === 'weak_password') return 'Escolha uma senha mais forte.';
  if (status === 429 || ['over_request_rate_limit','over_email_send_rate_limit'].includes(code)) return 'Muitas tentativas. Aguarde alguns instantes e tente novamente.';
  if (code === '42501' || status === 403) return 'Você não tem permissão para esta operação.';
  if (status === 401 || code === 'PGRST301') return 'Sua sessão expirou. Entre novamente.';
  if (code === '23505') return 'Este registro já existe.';
  if (code === '23514' || code === '22P02') return 'Confira os dados informados e tente novamente.';
  if (/^(URL de (mídia|avatar|Instagram|YouTube|Spotify|capa) não autorizada)$/.test(message)) return 'O endereço informado não é permitido. Confira o link.';
  if (/failed to fetch|networkerror|network request failed/i.test(message)) return 'Não foi possível conectar. Confira sua internet e tente novamente.';
  return fallback;
}
