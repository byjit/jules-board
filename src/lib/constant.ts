export const SYSTEM_NOTIFICATION_EMAIL = "Jit <jit@byjit.com>";
export const SYSTEM_ADMIN_EMAIL = "prasanjitdutta45@gmail.com";

export const SYSTEM_ADMIN_USER_IDS = ["de"];
export const APP_NAME = "Template";
export const APP_DESCRIPTION = "Template";

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    type: "image",
    src: "https://cdn.prod.website-files.com/5fcb3bbf6fdac55b7a345a8e/62596ca7d654fc32acc1224e_glass%20look.png",
    alt: "Glass look",
  },
];
export type GalleryItem = {
  type: "image" | "video";
  src: string;
  alt?: string;
  title?: string;
  caption?: string;
};

export const CONTACT_FORM = "https://tally.so/r/ODQJ2k";
