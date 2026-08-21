// useMemo : redécode le JWT uniquement quand le token saisi change
import { useMemo, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

// Décode une chaîne Base64URL (variante du Base64 utilisée par les JWT : - au lieu de +, _ au lieu de /, pas de padding =)
function base64UrlDecode(str: string): string {
  // Remplace les caractères spécifiques à Base64URL par ceux du Base64 standard
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // Réajoute le padding '=' manquant, requis par atob pour un décodage correct
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  // decodeURIComponent + escape/atob : gère correctement les caractères UTF-8 (accents, emojis dans les claims)
  return decodeURIComponent(escape(atob(base64)));
}

export default function JwtDecoder() {
  // Le token JWT brut collé par l'utilisateur (format: header.payload.signature)
  const [token, setToken] = useState('');

  // Décode le header et le payload à chaque changement de token
  const decoded = useMemo(() => {
    if (!token.trim()) return null;

    // Un JWT valide a exactement 3 parties séparées par des points
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { error: 'Format invalide : un JWT doit contenir 3 parties séparées par des points' };
    }

    try {
      // Décode et parse le header (algorithme, type de token)
      const header = JSON.parse(base64UrlDecode(parts[0]));
      // Décode et parse le payload (claims : sub, exp, iat, données custom...)
      const payload = JSON.parse(base64UrlDecode(parts[1]));

      // Vérifie si le token est expiré, si le claim "exp" (timestamp Unix en secondes) est présent
      const isExpired = payload.exp ? Date.now() / 1000 > payload.exp : null;

      return { header, payload, isExpired, error: null };
    } catch {
      // Si le décodage Base64 ou le parsing JSON échoue, le token est mal formé
      return { error: 'Impossible de décoder ce token (Base64 ou JSON invalide)' };
    }
  }, [token]);

  return (
    <div className="flex flex-col h-full p-6 gap-4">
      <h2 className="text-lg font-semibold">JWT Decoder</h2>
      <p className="text-xs text-muted-foreground">
        Décodage uniquement, en local — aucune vérification de signature, aucune donnée envoyée nulle part.
      </p>

      {/* Zone de collage du token */}
      <Textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Colle ton token JWT ici (eyJhbGciOiJ...)"
        className="font-mono text-sm resize-none h-24"
      />

      {/* Affiche l'erreur si le token est mal formé */}
      {decoded?.error && (
        <p className="text-sm text-destructive">{decoded.error}</p>
      )}

      {/* Affiche header + payload si le décodage a réussi */}
      {decoded && !decoded.error && (
        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground">Header</label>
            <pre className="flex-1 overflow-auto font-mono text-xs bg-muted/30 rounded-md p-3">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm text-muted-foreground flex items-center gap-2">
              Payload
              {/* Badge d'expiration, coloré selon le statut */}
              {decoded.isExpired !== null && (
                <span
                  className={
                    decoded.isExpired
                      ? 'text-destructive text-xs font-medium'
                      : 'text-green-600 text-xs font-medium'
                  }
                >
                  {decoded.isExpired ? '● Expiré' : '● Valide (non expiré)'}
                </span>
              )}
            </label>
            <pre className="flex-1 overflow-auto font-mono text-xs bg-muted/30 rounded-md p-3">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}