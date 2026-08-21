// useState : état local pour le timestamp saisi et la date lisible saisie
// useMemo : recalcule les conversions uniquement quand l'entrée change
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function TimestampConverter() {
  // Timestamp Unix saisi par l'utilisateur (en chaîne, car un champ input renvoie toujours du texte)
  const [timestampInput, setTimestampInput] = useState('');
  // Champ date/heure lisible, au format compatible avec <input type="datetime-local">
  const [dateInput, setDateInput] = useState('');

  // Convertit le timestamp saisi en informations de date lisibles (plusieurs formats utiles)
  const fromTimestamp = useMemo(() => {
    // Si le champ est vide ou non-numérique, on ne calcule rien
    if (!timestampInput || isNaN(Number(timestampInput))) return null;

    const num = Number(timestampInput);
    // Heuristique simple : si le nombre a plus de 10 chiffres, c'est probablement des millisecondes, pas des secondes
    const ms = timestampInput.length > 10 ? num : num * 1000;
    const date = new Date(ms);

    // Vérifie que la date obtenue est valide (évite d'afficher "Invalid Date")
    if (isNaN(date.getTime())) return null;

    return {
      iso: date.toISOString(), // format ISO 8601 standard, ex: 2026-08-20T10:00:00.000Z
      local: date.toLocaleString(), // format lisible selon la locale du système
      utc: date.toUTCString(), // format UTC lisible
    };
  }, [timestampInput]);

  // Convertit la date lisible saisie en timestamp Unix (secondes)
  const fromDate = useMemo(() => {
    if (!dateInput) return null;
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return null;
    return Math.floor(date.getTime() / 1000);
  }, [dateInput]);

  // Remplit le champ timestamp avec l'instant présent, en un clic
  const useNow = () => {
    setTimestampInput(String(Math.floor(Date.now() / 1000)));
  };

  return (
    <div className="flex flex-col h-full p-6 gap-6 max-w-xl">
      <h2 className="text-lg font-semibold">Timestamp Converter</h2>

      {/* Bloc 1 : timestamp -> date lisible */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-muted-foreground">Timestamp Unix (secondes ou millisecondes)</label>
        <div className="flex gap-2">
          <Input
            value={timestampInput}
            onChange={(e) => setTimestampInput(e.target.value)}
            placeholder="1755000000"
            className="font-mono"
          />
          <Button variant="secondary" onClick={useNow}>Maintenant</Button>
        </div>

        {/* N'affiche les résultats que si la conversion a réussi */}
        {fromTimestamp && (
          <div className="text-sm font-mono bg-muted/30 rounded-md p-3 space-y-1 mt-1">
            <p>ISO : {fromTimestamp.iso}</p>
            <p>Local : {fromTimestamp.local}</p>
            <p>UTC : {fromTimestamp.utc}</p>
          </div>
        )}
      </div>

      {/* Bloc 2 : date lisible -> timestamp */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-muted-foreground">Date et heure</label>
        {/* input natif HTML datetime-local : pas besoin de composant shadcn dédié, le navigateur gère le picker */}
        <input
          type="datetime-local"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm bg-background"
        />

        {fromDate !== null && (
          <p className="text-sm font-mono bg-muted/30 rounded-md p-3 mt-1">
            Timestamp : {fromDate}
          </p>
        )}
      </div>
    </div>
  );
}