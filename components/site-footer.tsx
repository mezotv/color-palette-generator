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
          <svg xmlns="http://www.w3.org/2000/svg" width="90" height="25" fill="none">
            <path fill="#34D59A" d="M27.542.008V28l-10.747-9.508v9.323H0V0zM3.376 24.439H13.42V11.084l10.747 9.508V3.382l-20.79-.005z" />
            <path fill="#fff" d="m49.97 23.124-10.745-9.51v9.323h-3.38V6.201l10.746 9.51V6.387h3.38zm3.722-.187V6.387h10.116V9.72h-6.736v3.264h5.338v3.263h-5.338v3.357h6.736v3.333zm20.58.187a8.446 8.446 0 0 1-8.461-8.462 8.446 8.446 0 0 1 8.46-8.461 8.446 8.446 0 0 1 8.462 8.461 8.446 8.446 0 0 1-8.461 8.462m0-3.264c2.89 0 5.058-2.33 5.058-5.198 0-2.867-2.168-5.198-5.058-5.198s-5.058 2.331-5.058 5.198 2.168 5.198 5.058 5.198m24.888 3.264-10.746-9.51v9.323h-3.38V6.201l10.746 9.51V6.387h3.38z" />
          </svg>
        </a>
      </div>
    </footer>
  )
}
