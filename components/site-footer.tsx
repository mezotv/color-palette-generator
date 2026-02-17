export function SiteFooter() {
  return (
    <footer className="border-t-3 border-black bg-primary px-4 py-5 text-primary-foreground md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-3 sm:flex-row">
        <p className="text-center text-sm font-bold">Powered by</p>
        <a
          href="https://neon.com/?utm_source=v0"
          target="_blank"
          rel="noopener noreferrer"
          className="px-1 py-1"
          aria-label="Open Neon website"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="22.4" fill="none" viewBox="0 0 80 22.4">
            <path fill="#34d59a" d="M22.034.006V22.4l-8.598-7.606v7.458H0V0zM2.701 19.551h8.035V8.867l8.598 7.606V2.706L2.702 2.702z"/>
            <path fill="#fff" d="m39.976 18.499-8.596-7.608v7.458h-2.704V4.961l8.597 7.608V5.11h2.704zm2.978-.15V5.11h8.093v2.666h-5.389v2.611h4.27v2.61h-4.27v2.686h5.389v2.666zm16.464.15a6.757 6.757 0 0 1-6.769-6.77 6.757 6.757 0 0 1 6.768-6.769 6.757 6.757 0 0 1 6.77 6.769 6.757 6.757 0 0 1-6.769 6.77m0-2.611c2.312 0 4.046-1.864 4.046-4.158s-1.734-4.158-4.046-4.158-4.046 1.865-4.046 4.158 1.734 4.158 4.046 4.158m19.91 2.611-8.597-7.608v7.458h-2.704V4.961l8.597 7.608V5.11h2.704z"/>
          </svg>
        </a>
      </div>
    </footer>
  )
}
