export default function Head() {
  return (
    <>
      {/* Force OpenGraph tags to be recognized */}
      <meta property="og:title" content="Big Based - Answer to Madness" />
      <meta
        property="og:description"
        content="Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 6000 meticulously researched pages designed to educate, inspire, and transform."
      />
      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/og-image.png`}
      />
      <meta property="og:url" content={process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Big Based" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@bigbased" />
      <meta name="twitter:title" content="Big Based - Answer to Madness" />
      <meta
        name="twitter:description"
        content="Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight, 6000 meticulously researched pages designed to educate, inspire, and transform."
      />
      <meta
        name="twitter:image"
        content={`${process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"}/og-image.png`}
      />
    </>
  )
}
