import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const NAME_REGEX = /\s+/;
const GITHUB_HTTPS_REGEX = /github\.com\/([^/]+)\/([^/]+)/;
const GITHUB_SSH_REGEX = /github\.com[:/]([^/]+)\/([^/]+)/;
const GIT_SUFFIX_REGEX = /\.git$/;
const TRAILING_SLASH_REGEX = /\/$/;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name?: string): string {
  if (!name) return "U";
  const words = name.trim().split(NAME_REGEX).filter(Boolean);
  const initials = words
    .slice(0, 2)
    .map((word) => word?.[0]?.toUpperCase())
    .join("");
  return initials || "U";
}

export function parseGitHubUrl(url: string): string {
  const cleanUrl = url.trim().replace(TRAILING_SLASH_REGEX, "");

  if (cleanUrl.startsWith("sources/github/")) {
    return cleanUrl;
  }

  // Match https://github.com/owner/repo or http://github.com/owner/repo
  const httpsMatch = cleanUrl.match(GITHUB_HTTPS_REGEX);
  if (httpsMatch?.[1] && httpsMatch?.[2]) {
    const owner = httpsMatch[1];
    const repo = httpsMatch[2];
    const cleanRepo = repo.replace(GIT_SUFFIX_REGEX, "");
    return `sources/github/${owner}/${cleanRepo}`;
  }

  // Match git@github.com:owner/repo.git
  const sshMatch = cleanUrl.match(GITHUB_SSH_REGEX);
  if (sshMatch?.[1] && sshMatch?.[2]) {
    const owner = sshMatch[1];
    const repo = sshMatch[2];
    const cleanRepo = repo.replace(GIT_SUFFIX_REGEX, "");
    return `sources/github/${owner}/${cleanRepo}`;
  }

  return cleanUrl;
}
