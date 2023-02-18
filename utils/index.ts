import sanityClient from "@sanity/client";
import ImageUrlBuilder from "@sanity/image-url";

export const saveToStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    return window.localStorage.setItem(key, value);
  }
};

export const getFromStorage = (key: string) => {
  if (typeof window !== "undefined") {
    return window.localStorage.getItem(key);
  }
};

export const removefromStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage.clear();
  }
};

export const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: "2023-02-16",
  dataset: "production",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

const builder = ImageUrlBuilder(client);

export const urlFor = (source: string) => builder.image(source);
