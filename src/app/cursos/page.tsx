// RUTA: src/app/cursos/page.tsx
import CursosGrid from './CursosGrid'

export const metadata = {
  title: 'Cursos — Sociología UPEA',
}

export default function CursosPage() {
  return <CursosGrid tipo='CURSOS' />
}