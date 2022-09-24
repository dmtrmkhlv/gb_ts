import { renderBlock } from './lib.js'

export function renderUserBlock (userName:string, userIcon:string, userFavorite:number) {

  const favoritesCaption = userFavorite >= 1 ? userFavorite : 'ничего нет'
  const hasFavoriteItems = userFavorite >= 1 ? true : false

  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${userIcon}" alt="Wade Warren" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <i class="heart-icon${hasFavoriteItems ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}
