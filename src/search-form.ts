import { renderBlock } from './lib.js'

export function renderSearchFormBlock (startDate:string, endDate:string) {
  let currentDate = new Date();
  let minDate = `${currentDate.getFullYear()}-${('0'+(currentDate.getMonth()+1)).slice(-2)}-${currentDate.getDate()}`;
  let maxDateFull = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);  
  let maxDate = `${maxDateFull.getFullYear()}-${('0'+(maxDateFull.getMonth()+1)).slice(-2)}-${maxDateFull.getDate()}`;
  if(!startDate){
    startDate = `${new Date(currentDate).getFullYear()}-${('0'+(currentDate.getMonth()+1)).slice(-2)}-${('0'+(new Date(currentDate).getDate()+1)).slice(-2)}`;
  }
  if(!endDate){
    endDate = `${new Date(currentDate).getFullYear()}-${('0'+(currentDate.getMonth()+1)).slice(-2)}-${('0'+(new Date(startDate).getDate()+2)).slice(-2)}`;
  }
  
  renderBlock(
    'search-form-block',
    `
    <form>
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
            <input id="check-in-date" type="date" value="${startDate}" min="${minDate}" max="${maxDate}" name="checkin" />
          </div>
          <div>
            <label for="check-out-date">Дата выезда</label>
            <input id="check-out-date" type="date" value="${endDate}" min="${startDate}" max="${maxDate}" name="checkout" />
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
