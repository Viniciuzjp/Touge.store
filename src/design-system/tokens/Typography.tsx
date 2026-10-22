/*
 * BASE
 */

const heading = "font-heading text-(--color-heading) text-balance";

const sans = "font-sans font-normal";

export const Typography = {
  /*
   * DISPLAY
   */

  displayLg: `${heading} text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight`,

  displayMd: `${heading} text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight`,

  displaySm: `${heading} text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight`,

  /*
   * HEADINGS
   */

  h1: `${heading} text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight`,

  h2: `${heading} text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight`,

  h3: `${heading} text-xl md:text-2xl font-semibold leading-snug`,

  h4: `${heading} text-lg md:text-xl font-semibold leading-snug`,

  /*
   * BODY
   */

  bodyLg: `${sans} text-lg leading-relaxed`,

  body: `${sans} text-base leading-relaxed`,

  bodySm: `${sans} text-sm leading-relaxed`,

  bodyXs: `${sans} text-xs leading-normal`,

  /*
   * PRODUCT
   */

  productTitle: `${sans} text-sm md:text-base font-medium leading-snug line-clamp-2`,

  productSubtitle: `${sans} text-sm leading-normal text-neutral-500`,

  productPrice: `${sans} text-base md:text-lg font-semibold tabular-nums tracking-tight`,

  productPriceOld: `${sans} text-sm tabular-nums text-neutral-400 line-through`,

  productInstallment: `${sans} text-xs md:text-sm tabular-nums text-green-700`,

  /*
   * UI
   */

  label: `${sans} text-xs font-semibold uppercase tracking-wider text-neutral-500`,

  overline: `${sans} text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500`,

  button: `${sans} text-sm font-semibold tracking-wide`,

  link: `${sans} text-sm font-medium underline-offset-4 hover:underline`,

  input: `${sans} text-base md:text-sm`,

  helper: `${sans} text-xs leading-normal text-neutral-500`,

  caption: `${sans} text-xs leading-normal text-neutral-400`,

  badge: `${sans} text-[11px] font-semibold uppercase tracking-wider leading-none`,

  /*
   * STATUS
   */

  success: `${sans} text-sm font-medium text-green-700`,

  warning: `${sans} text-sm font-medium text-amber-700`,

  danger: `${sans} text-sm font-medium text-red-700`,

  /*
   * NAVIGATION
   */

  navbar: `${sans} text-sm font-medium tracking-wide`,

  menu: `${sans} text-sm font-medium`,

  footer: `${sans} text-sm leading-relaxed text-neutral-500`,
};
