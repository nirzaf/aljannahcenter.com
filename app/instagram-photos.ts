export type InstagramPhoto = {
  id: string;
  src: string;
  alt: string;
  postUrl: string;
};

type CarouselPost = {
  id: string;
  files: number[];
};

const imagePath = (number: number) =>
  "/instagram/instagram-" + String(number).padStart(3, "0") + ".jpg";

const carouselPosts: CarouselPost[] = [
  { id: "DdGpeflCM4d", files: [3, 14, 15, 16] },
  { id: "DdGnkpSiA1B", files: [4, 20, 21, 22] },
  { id: "DdGZM6fiHlf", files: [5, 23, 24, 25] },
  { id: "DdGW4nxiDai", files: [6, 26, 27, 28] },
  { id: "DdGU2JFCCFW", files: [7, 29, 30, 31] },
  { id: "DdGTZkhiC4h", files: [8, 32, 33, 34] },
  { id: "DdGuV0zCC0P", files: [9, 11, 12, 13] },
  { id: "DdGn-MGiHtL", files: [10, 17, 18, 19] },
];

const reelCovers: InstagramPhoto[] = [
  {
    id: "DdLgN7IJRfa",
    src: imagePath(2),
    alt: "Al-Jannah Centre distinguished guests Instagram reel cover",
    postUrl: "https://www.instagram.com/reel/DdLgN7IJRfa/",
  },
];

export const instagramPhotos: InstagramPhoto[] = [
  ...reelCovers,
  ...carouselPosts.flatMap(({ id, files }) =>
    files.map((file, index) => ({
      id: id + "-" + (index + 1),
      src: imagePath(file),
      alt: "Al-Jannah Centre Instagram carousel image " + (index + 1),
      postUrl: "https://www.instagram.com/p/" + id + "/",
    })),
  ),
];
