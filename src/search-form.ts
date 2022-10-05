import { searchPlace } from './get-api.js';
import { renderBlock } from './lib.js'
import { renderSearchResultsBlock } from './search-results.js';
import { toggleFavoriteItem } from './user.js';

import {FlatRentSdk} from './geekbrains-flat-rent-sdk.js'

const sdk = new FlatRentSdk()

// Создать интерфейс SearchFormData, в котором описать структуру для полей поисковой формы. 
export interface SearchFormData {
  startDate:string, 
  endDate:string,
  maxPrice?: number,
  flatRent?: boolean,
  homy?: boolean
}

/*
2. Написать функцию-обработчик формы search, которая собирает заполненные пользователем данные в формате описанной структуры и передаёт их в функцию поиска.
3. * Добавить в функцию search вторым аргументом функцию-обратного вызова, которая
принимает либо ошибку либо массив результатов интерфейса Place. Данный интерфейс пока
оставить пустым. Функция поиска делает задержку в несколько секунд, после чего с
вероятностью 50 на 50 выдаёт либо ошибку либо пустой массив.
*/

export interface Place{
  id: number | string;
  image: string;
  name: string;
  description: string;
  remoteness: number;
  bookedDates: number[];
  price: number;

  coordinates?:number[]
  details?:string;
  photos?:string[];
  title?:string;
  totalPrice?:number;
}

export function CallBack(value: string | Place){
  if(Math.random() >= 0.5){
    throw Error("value");;
  }
  return []
};

export function search (formName: string, cb:Function = function() {}) {  
  const form = document.getElementById(formName);
  const data = {'startDate':form['check-in-date'].value, 'endDate':form['check-out-date'].value, 'flatRent': form['flat-rent'].checked, 'homy':form['homy'].checked};
  findData(data);
  setTimeout(cb, 3000);
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let data = {'startDate':form['check-in-date'].value, 'endDate':form['check-out-date'].value, 'maxPrice':form['max-price'].value || null, 'flatRent': form['flat-rent'].checked, 'homy':form['homy'].checked};    
    findData(data);
  })
}

// Функция поиска принимает как аргумент переменную интерфейса SearchFormData, выводит полученный аргумент в консоль и ничего не возвращает
export function findData (data: SearchFormData):void {

  new Promise(function(resolve, reject) {
    
    if(data['flatRent']){
      resolve( new Promise((resolve, reject) => { // (*)
        sdk.search({
          city: 'Санкт-Петербург',
          checkInDate: new Date(data['startDate']),
          checkOutDate: new Date(data['endDate']),
          priceLimit: data['maxPrice']
        })
        .then((flatResult:object|null) => {
          resolve(flatResult);
        })
      }))
    }
    resolve({})

  }).then((flatResult: {})=>{

    if(data['homy']){
      return new Promise((resolve, reject) => {
        searchPlace(new Date(data['startDate']), new Date(data['endDate']), data['maxPrice'])
        .then((homyResults:object|null) => {
          if(Object.keys(flatResult).length != 0){
            resolve({flatResult, homyResults});
          }
          resolve({homyResults});
        })
      });
    }
    if(Object.keys(flatResult).length != 0){
      return {flatResult}
    }
    return {}
    

  }).then((allResult: {})=>{    
    renderSearchResultsBlock(allResult);
    toggleFavoriteItem();
  })
}

export function renderSearchFormBlock (data: SearchFormData) {
  let currentDate = new Date();
  let minDate = `${currentDate.getFullYear()}-${('0'+(currentDate.getMonth()+1)).slice(-2)}-${currentDate.getDate()}`;
  let maxDateFull = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);  
  let maxDate = `${maxDateFull.getFullYear()}-${('0'+(maxDateFull.getMonth()+1)).slice(-2)}-${maxDateFull.getDate()}`;
  if(!data.startDate){
    data.startDate = `${new Date(currentDate).getFullYear()}-${('0'+(currentDate.getMonth()+1)).slice(-2)}-${('0'+(new Date(currentDate).getDate()+1)).slice(-2)}`;
  }
  if(!data.endDate){
    data.endDate = `${new Date(currentDate).getFullYear()}-${('0'+(currentDate.getMonth()+1)).slice(-2)}-${('0'+(new Date(currentDate).getDate()+2)).slice(-2)}`;
  }
  
  renderBlock(
    'search-form-block',
    `
    <form id="search">
      <fieldset class="search-filedset">
        <div class="row">
          <div>
            <label for="city">Город</label>
            <input id="city" type="text" disabled value="Санкт-Петербург" />
            <input type="hidden" disabled value="59.9386,30.3141" />
          </div>
          <div class="providers">
            <label><input type="checkbox" name="provider" value="homy" id="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" id="flat-rent" checked /> FlatRent</label>
          </div>
        </div>
        <div class="row">
          <div>
            <label for="check-in-date">Дата заезда</label>
            <input id="check-in-date" type="date" value="${data.startDate}" min="${minDate}" max="${maxDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${data.endDate}" min="${data.startDate}" max="${maxDate}" name="checkout" />
          </div>
          <div>
            <label for="max-price">Макс. цена суток</label>
            <input id="max-price" type="number" value="" name="price" class="max-price" />
          </div>
          <div>
            <div><button>Найти</button></div>
          </div>
        </div>
      </fieldset>
    </form>
    `
  )
}
