// Import ES du PNG réel : Vite le bundle et hash correctement, avec un chemin qui reste valide
// aussi bien en développement qu'une fois l'app packagée (contrairement à un chemin écrit en texte).
// Plus aucune référence SVG dans ce composant.
import logoSrc from '../../assets/branding/devdesk-icon.png';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return <img src={logoSrc} alt="DevDesk" className={className} />;
}