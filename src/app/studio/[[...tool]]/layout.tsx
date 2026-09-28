export const metadata = {
  title: 'Hardware Collection Studio',
  description: 'Sanity Studio for Hardware Collection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
