import './globals.css'

export const metadata = {
  title: 'Light DAM | Editorial OS',
  description: 'AI-first digital asset management',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
