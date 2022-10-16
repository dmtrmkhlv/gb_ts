import { getFavoritesAmount } from "./get-user-info.js";
import { renderBlock } from "./lib.js";

export class User {
  userName: string;
  userIcon: string;
  userFavorite: number;
  constructor(userName: string, userIcon: string, userFavorite?: number) {
    this.userName = userName;
    this.userIcon = userIcon;
    this.userFavorite = userFavorite;
  }
}

export function renderUserBlock(
  userName: string,
  userIcon: string,
  userFavorite?: number
) {
  const favoritesCaption = Boolean(userFavorite) ? userFavorite : "ничего нет";

  renderBlock(
    "user-block",
    `
    <div class="header-container">
      <img class="avatar" src="${userIcon}" alt="Wade Warren" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <i class="heart-icon${
              Boolean(userFavorite) ? " active" : ""
            }"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  );
}

export function toggleFavoriteItem() {
  const allItems = document.querySelector(".js-results-list");
  allItems.addEventListener("click", (e) => {
    let target = e.target as HTMLElement;
    if (target.classList.contains("js-favorite")) {
      if (target.classList.contains("active")) {
        let newFavoriteData = getFavoritesAmount("favoriteItems");
        let index = newFavoriteData.findIndex(
          (item) => item.id == target.dataset.id
        );
        if (index != -1) {
          newFavoriteData.splice(index, 1);
          localStorage.favoriteItems = JSON.stringify(newFavoriteData);
        }
        target.classList.remove("active");
      } else {
        target.classList.add("active");
        localStorage.favoriteItems = JSON.stringify([
          ...getFavoritesAmount("favoriteItems"),
          {
            id: target.dataset.id,
            name: target.dataset.name,
            image: target.dataset.image,
          },
        ]);
      }
    }
  });
}
