export function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    ariaHidden: true,
  }

  const paths = {
    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
    calendar: (
      <>
        <path d="M7 3v4" />
        <path d="M17 3v4" />
        <path d="M4 8h16" />
        <path d="M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      </>
    ),
    timeline: (
      <>
        <path d="M12 5v14" />
        <path d="M7 7h5" />
        <path d="M12 12h5" />
        <path d="M7 17h5" />
      </>
    ),
    pen: (
      <>
        <path d="m15 5 4 4" />
        <path d="M4 20h4l11-11-4-4L4 16v4Z" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M9 7V5h6v2" />
        <path d="M6 7l1 13h10l1-13" />
      </>
    ),
    up: <path d="m7 14 5-5 5 5" />,
    down: <path d="m7 10 5 5 5-5" />,
    user: (
      <>
        <path d="M20 21a8 8 0 0 0-16 0" />
        <path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
      </>
    ),
  }

  return <svg {...common}>{paths[name]}</svg>
}
