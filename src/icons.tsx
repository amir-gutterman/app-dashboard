import type { SVGProps } from 'react'

function BunnyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <ellipse cx="9" cy="6.5" rx="2" ry="5.5" transform="rotate(-16 9 6.5)" />
      <ellipse cx="15" cy="6.5" rx="2" ry="5.5" transform="rotate(16 15 6.5)" />
      <circle cx="12" cy="15.5" r="6.2" />
      <circle cx="9.8" cy="14.5" r="0.9" fill="var(--icon-accent, #1f2937)" />
      <circle cx="14.2" cy="14.5" r="0.9" fill="var(--icon-accent, #1f2937)" />
      <ellipse cx="12" cy="17" rx="0.9" ry="0.6" fill="var(--icon-accent, #1f2937)" />
    </svg>
  )
}

function PlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2.5 1.5V22l4-1 4 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  )
}

function RocketIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2c3 1.5 5 5 5 9 0 1.5-.3 2.9-.8 4.1l2.3 2.3-3.3.6-.6 3.3-2.3-2.3c-1.2.5-2.6.8-4.1.8s-2.9-.3-4.1-.8l-2.3 2.3-.6-3.3-3.3-.6 2.3-2.3C-.3 14.9-.6 13.5-.6 12c0-4 2-7.5 5-9 1.3 1 2 2.5 2 4.5 0-2 .7-3.5 2-4.5s2.7.3 3.6 2.5z" />
    </svg>
  )
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7L12 17.3 5.7 20.9l1.7-7L2 9.2l7.1-.6L12 2z" />
    </svg>
  )
}

function GlobeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18M4.5 7.5h15M4.5 16.5h15" />
    </svg>
  )
}

function PuzzleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4h5.5a1.8 1.8 0 0 1 3.4 0H18a1 1 0 0 1 1 1v5.1a1.8 1.8 0 0 1 0 3.4V19a1 1 0 0 1-1 1h-5.1a1.8 1.8 0 0 1-3.4 0H4a1 1 0 0 1-1-1v-5.5a1.8 1.8 0 0 1 0-3.4V5a1 1 0 0 1 1-1z" />
    </svg>
  )
}

function BoltIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13 2 3 14h6l-1 8 11-13h-6l1-7z" />
    </svg>
  )
}

function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 4h2l2.4 12.2a1.5 1.5 0 0 0 1.5 1.3h8.2a1.5 1.5 0 0 0 1.5-1.2L20.5 8H6.2" />
      <circle cx="10" cy="20.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function QuestionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M9.2 9.5a2.8 2.8 0 1 1 4.3 2.4c-.9.6-1.5 1.1-1.5 2.1" />
      <circle cx="12" cy="17" r="0.1" fill="currentColor" />
    </svg>
  )
}

function MedicalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

export const ICONS = {
  bunny: BunnyIcon,
  plane: PlaneIcon,
  rocket: RocketIcon,
  star: StarIcon,
  globe: GlobeIcon,
  puzzle: PuzzleIcon,
  bolt: BoltIcon,
  cart: CartIcon,
  question: QuestionIcon,
  medical: MedicalIcon,
} as const

export type IconKey = keyof typeof ICONS

export const ICON_KEYS = Object.keys(ICONS) as IconKey[]
