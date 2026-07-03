export type LogoImport = string | { src: string };

export function logoUrl(logo: LogoImport): string {
  return typeof logo === 'string' ? logo : logo.src;
}
