// Enable only after legal approval, final document publication and server-side enforcement.
export const legalGateEnabled = false;
export function legalDecision({enabled, userId, version, accepted, error}) {
 if (!enabled || !userId) return 'allow';
 if (error) return 'error';
 if (!version) return 'error';
 return accepted ? 'allow' : 'accept';
}
