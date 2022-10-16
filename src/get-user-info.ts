import { iPlace } from "./search-form";

export function getUserData(key: unknown) {
  if (
    typeof key == "string" &&
    typeof JSON.parse(localStorage[key]) == "object"
  ) {
    return JSON.parse(localStorage[key]);
  }
}

export interface iLocalStorage {
  favoritesAmount: number;
  favoriteItems: [
    {
      id: string;
      image: string;
      name: string;
    }
  ];
  user: {
    username: string;
    avatarUrl: string;
  };
  "flat-rent-db": iPlace[];
}

export function getFavoritesAmount<T extends keyof iLocalStorage>(
  key: T
): iLocalStorage[T] | null {
  if (typeof key == "string" && typeof +localStorage[key] == "number") {
    return JSON.parse(localStorage[key]) as iLocalStorage[T];
  }
}
