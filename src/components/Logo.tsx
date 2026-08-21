// Logo basé sur ton fichier de marque réel (assets/branding/devdesk-icon.svg).
// Le chemin "/branding/..." fonctionne en dev ET en build, car Vite copie tout "publicDir" à la racine du dossier de sortie.
interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return <img src="./assets/branding/devdesk-icon.png" alt="DevDesk" className={className} />;
}