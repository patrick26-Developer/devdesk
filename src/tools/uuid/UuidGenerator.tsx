import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw, Check } from 'lucide-react';

export default function UuidGenerator() {
  const [uuid, setUuid] = useState(() => crypto.randomUUID());
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setUuid(crypto.randomUUID());
    setCopied(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full p-6 gap-4 max-w-xl">
      <h2 className="text-lg font-semibold">UUID Generator</h2>

      <div className="flex gap-2">
        <Input value={uuid} readOnly className="font-mono text-sm" />
        <Button variant="secondary" size="icon" onClick={copy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <Button onClick={generate} className="w-fit">
        <RefreshCw className="h-4 w-4 mr-2" />
        Générer un nouveau UUID
      </Button>
    </div>
  );
}