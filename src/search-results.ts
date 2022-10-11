import { renderBlock } from './lib.js'
import { Place } from './store/domain/place.js';


export function renderSearchStubBlock() {
  renderBlock(
    'search-results-block',
    `
    <div class="before-results-block">
      <img src="img/start-search.png" />
      <p>Чтобы начать поиск, заполните форму и&nbsp;нажмите "Найти"</p>
    </div>
    `
  )
}

export function renderEmptyOrErrorSearchBlock(reasonMessage) {
  renderBlock(
    'search-results-block',
    `
    <div class="no-results-block">
      <img src="img/no-results.png" />
      <p>${reasonMessage}</p>
    </div>
    `
  )
}

export function renderSearchResultsBlock(results: Place[], sort?: string) {
  const placeItems = [];

  let optionsNames = [
    'Сначала дешёвые',
    'Сначала дорогие',
    'Сначала ближе'
  ];
  let options = optionsNames.map((option)=>{
    
    if(option == sort){
      return `<option selected>${option}</option>`
    }
    else{
      return `<option>${option}</option>`
    }
  })
    
  if(Object.keys(results).length != 0){
      results.forEach((place: Place ) => {
        placeItems.push(
          `
          <li class="result">
          <div class="result-container">
            <div class="result-img-container">
              <div data-id=${place.id} data-name=${JSON.stringify(place.name)})} data-image=${place.image} class="favorites js-favorite"></div>
              <img class="result-img" src="${place.image}" alt="">
            </div>	
            <div class="result-info">
              <div class="result-info--header">
                <p>${place.name}</p>
                <p class="price">${place.price}&#8381;</p>
              </div>
              <div class="result-info--map"><i class="map-icon"></i> ${place.remoteness}км от вас</div>
              <div class="result-info--descr">${place.description}</div>
              <div class="result-info--footer">
                <div>
                  <button>Забронировать</button>
                </div>
              </div>
            </div>
          </div>
        </li>
        `
        )
    
      });
  
  }else{
    placeItems.push(`<li class="result">Данные отсутсвуют</li>`);
  }


  renderBlock(
    'search-results-block',
    `
    <div class="search-results-header">
        <p>Результаты поиска</p>
        <div class="search-results-filter">
            <span><i class="icon icon-filter"></i> Сортировать:</span>
            <select id="sort">
                ${options.join('')}
            </select>
        </div>
    </div>
    <ul class="results-list js-results-list">
    ${placeItems.join('')}
    </ul>
    `
  )
}
