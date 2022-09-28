import { renderBlock } from './lib.js'

export class User {
  userName: string
  userIcon: string
  userFavorite: number
  constructor (userName: string, userIcon: string, userFavorite?: number) {
    this.userName = userName
    this.userIcon = userIcon
    this.userFavorite = userFavorite
  }
  }
  
export function renderUserBlock (userName: string, userIcon: string, userFavorite?: number) {

  const favoritesCaption = Boolean(userFavorite) ? userFavorite : 'ничего нет'
  
  renderBlock(
    'user-block',
    `
    <div class="header-container">
      <img class="avatar" src="${userIcon}" alt="Wade Warren" />
      <div class="info">
          <p class="name">${userName}</p>
          <p class="fav">
            <i class="heart-icon${Boolean(userFavorite) ? ' active' : ''}"></i>${favoritesCaption}
          </p>
      </div>
    </div>
    `
  )
}
