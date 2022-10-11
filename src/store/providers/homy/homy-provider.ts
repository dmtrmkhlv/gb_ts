import { Provider } from "../../domain/provider.js"
import { SearchFilter } from "../../domain/search-filter.js"
import { HttpHelper } from "../../utils/http-helper.js"
import { Flat } from "./response.js"
import { Place } from "../../domain/place.js"

export class HomyProvider implements Provider {

  public static provider = 'homyrent'
  private static apiUrl = 'http://localhost:3030'

  public search(query: SearchFilter): Promise < Place[] > {

    return HttpHelper.fetchAsJson < Flat[] > (
        HomyProvider.apiUrl + '/places?' +
        this.convertFilterToQueryString(query)
      )
      .then((response) => {
        return this.convertFlatListResponse(response)
      })
      .catch((err) => {
        throw new Error(err)
      })

  }

  private convertFilterToQueryString(filter: SearchFilter): string {
    let urlString = `&checkInDate=${this.dateToUnixStamp(filter.checkInDate)}` +
      `&checkOutDate=${this.dateToUnixStamp(filter.checkOutDate)}` +
      `&coordinates=${filter.city}`

    if (filter.priceLimit != null) {
      urlString += `&maxPrice=${filter.priceLimit}`
    }

    return urlString;
  }

  private dateToUnixStamp(date: Date) {
    return date.getTime() / 1000
  }


  private convertFlatListResponse(response: Flat[]): Place[] {
    return response.map((item) => {
      return this.convertFlatResponse(item)
    })
  }

  private convertFlatResponse(item: Flat): Place {
    return new Place(
      HomyProvider.provider,
      item.id,
      item.image,
      item.name,
      item.description,
      item.remoteness,
      item.price,
      item.bookedDates,
      [],
    )
  }

}
