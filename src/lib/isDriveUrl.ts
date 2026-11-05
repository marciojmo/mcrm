const DRIVE_HOSTS = ['drive.google.com', 'docs.google.com'];

export function isDriveUrl(url: string) {
  return DRIVE_HOSTS.includes(new URL(url).hostname);
}
