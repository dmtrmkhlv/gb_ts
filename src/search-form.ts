import { Place } from "./store/domain/place.js";
import { renderBlock } from "./lib.js";
import { renderSearchResultsBlock } from "./search-results.js";
import { FlatrentProvider } from "./store/providers/flatrent/flatrent-provider.js";
import { HomyProvider } from "./store/providers/homy/homy-provider.js";
import { toggleFavoriteItem } from "./user.js";

const flatrentProvider = new FlatrentProvider();
const homyProvider = new HomyProvider();

export interface iSearchFormData {
  startDate: string;
  endDate: string;
  maxPrice?: number;
  flatRent?: boolean;
  homy?: boolean;
}

export interface iPlace {
  provider: string;
  originalId: string;
  image: string;
  name: string;
  description: string;
  remoteness: number;
  price: number;
  bookedDates: Date[] | number[];
  coordinates?: number[];
}

export interface iSortParams {
  key: string;
  by: number;
  value: string;
}

export function CallBack(value: string | Place): Error | [] {
  if (Math.random() >= 0.5) {
    throw Error("value");
  }
  return [];
}

export function sortPlaces(arr: Place[], sort: iSortParams) {
  function sortBy(one: any, two: any) {
    if (one[sort.key] > two[sort.key]) {
      return sort.by;
    } else if (one[sort.key] < two[sort.key]) {
      return -sort.by;
    } else {
      return 0;
    }
  }
  return arr.sort(sortBy);
}

export function search(formName: string, cb: Function = function () {}) {
  const form = document.getElementById(formName);

  let data = {
    startDate: (document.getElementById("check-in-date") as HTMLInputElement)
      .value,
    endDate: (document.getElementById("check-out-date") as HTMLInputElement)
      .value,
    flatRent: (document.getElementById("flat-rent") as HTMLInputElement)
      .checked,
    homy: (document.getElementById("homy") as HTMLInputElement).checked,
  };
  findData(data);
  setTimeout(cb, 3000);
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    let data = {
      startDate: (document.getElementById("check-in-date") as HTMLInputElement)
        .value,
      endDate: (document.getElementById("check-out-date") as HTMLInputElement)
        .value,
      maxPrice: +(document.getElementById("max-price") as HTMLInputElement)
        .value,
      flatRent: (document.getElementById("flat-rent") as HTMLInputElement)
        .checked,
      homy: (document.getElementById("homy") as HTMLInputElement).checked,
    };
    findData(data);
  });
}

export function findData(
  data: iSearchFormData,
  sortParams?: iSortParams
): void {
  Promise.all([
    flatrentProvider.search({
      city: "Санкт-Петербург",
      checkInDate: new Date(data["startDate"]),
      checkOutDate: new Date(data["endDate"]),
      priceLimit: data["maxPrice"],
    }),
    homyProvider.search({
      city: [59.9386, 30.3141],
      checkInDate: new Date(data["startDate"]),
      checkOutDate: new Date(data["endDate"]),
      priceLimit: data["maxPrice"],
    }),
  ]).then((results) => {
    let allResults: Place[] = [];
    if (data["flatRent"] && data["homy"]) {
      allResults = ([] as Place[]).concat(results[0], results[1]);
    } else {
      if (data["flatRent"]) {
        allResults = ([] as Place[]).concat(results[0]);
      }
      if (data["homy"]) {
        allResults = ([] as Place[]).concat(results[1]);
      }
    }

    sortPlaces(
      allResults,
      sortParams || { key: "price", by: 1, value: "Сначала дешёвые" }
    );
    renderSearchResultsBlock(
      allResults,
      sortParams?.value || "Сначала дешёвые"
    );
    toggleFavoriteItem();

    const sort = document.getElementById("sort") as HTMLInputElement;
    sort.addEventListener("change", (e) => {
      e.preventDefault();
      const target = e.target as HTMLInputElement;
      switch (target.value) {
        case "Сначала дорогие":
          findData(data, { key: "price", by: -1, value: target.value });
          break;
        case "Сначала дешёвые":
          findData(data, { key: "price", by: 1, value: target.value });
          break;
        case "Сначала ближе":
          findData(data, { key: "remoteness", by: 1, value: target.value });
          break;
      }
    });
  });
}

export function renderSearchFormBlock(data: iSearchFormData) {
  let currentDate = new Date();
  let minDate = `${currentDate.getFullYear()}-${(
    "0" +
    (currentDate.getMonth() + 1)
  ).slice(-2)}-${currentDate.getDate()}`;
  let maxDateFull = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 2,
    0
  );
  let maxDate = `${maxDateFull.getFullYear()}-${(
    "0" +
    (maxDateFull.getMonth() + 1)
  ).slice(-2)}-${maxDateFull.getDate()}`;
  if (!data.startDate) {
    data.startDate = `${new Date(currentDate).getFullYear()}-${(
      "0" +
      (currentDate.getMonth() + 1)
    ).slice(-2)}-${("0" + (new Date(currentDate).getDate() + 1)).slice(-2)}`;
  }
  if (!data.endDate) {
    data.endDate = `${new Date(currentDate).getFullYear()}-${(
      "0" +
      (currentDate.getMonth() + 1)
    ).slice(-2)}-${("0" + (new Date(currentDate).getDate() + 2)).slice(-2)}`;
  }

  renderBlock(
    "search-form-block",
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
  );
}
