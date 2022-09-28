import { renderBlock } from './lib.js'

// Создать интерфейс SearchFormData, в котором описать структуру для полей поисковой формы. 
export interface SearchFormData {
  startDate:string, 
  endDate:string
}

// Написать функцию-обработчик формы search, которая собирает заполненные пользователем данные в формате описанной структуры и передаёт их в функцию поиска.
export function search (formName: string) {  
  const form = document.getElementById(formName);
  const data = {'startDate':form['check-in-date'].value, 'endDate':form['check-out-date'].value};
  findData(data);
  form.addEventListener('change',()=>{
    const data = {'startDate':form['check-in-date'].value, 'endDate':form['check-out-date'].value};
    findData(data);
  })
}

// Функция поиска принимает как аргумент переменную интерфейса SearchFormData, выводит полученный аргумент в консоль и ничего не возвращает
export function findData (data: SearchFormData):void {
  console.log(data);
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
          <!--<div class="providers">
            <label><input type="checkbox" name="provider" value="homy" checked /> Homy</label>
            <label><input type="checkbox" name="provider" value="flat-rent" checked /> FlatRent</label>
          </div>--!>
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
            <input id="max-price" type="text" value="" name="price" class="max-price" />
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
