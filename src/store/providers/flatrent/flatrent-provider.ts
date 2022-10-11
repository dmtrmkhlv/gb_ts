import { Provider } from "../../domain/provider.js"
import { SearchFilter } from "../../domain/search-filter.js"
import { HttpHelper } from "../../utils/http-helper"
import { Flat } from "./response.js"
import { Place } from "../../domain/place.js"
import { FlatRentSdk } from "../../../geekbrains-flat-rent-sdk.js"

export class FlatrentProvider implements Provider {

  public static provider = 'flatrent'
  private static apiUrl = 'http://localhost/3040'
  private static sdk = new FlatRentSdk()

  public search(query: SearchFilter): Promise < Place[] > {

    return new Promise((resolve, reject) => {
      FlatrentProvider.sdk.search(query)
        .then((response: Flat[]) => {
          
          resolve(this.convertFlatListResponse(response));
        })
        .catch((err) => {
          throw new Error(err)
        })
    })

  }

  private convertFlatListResponse(response: Flat[]): Place[] {
    return response.map((item) => {
      return this.convertFlatResponse(item)
    })
  }

  private convertFlatResponse(item: Flat): Place {
    return new Place(
      FlatrentProvider.provider,
      item.id,
      item.photos[0],
      item.title,
      item.details,
      0,
      item.totalPrice,
      item.bookedDates,
      item.coordinates,
    )
  }

}
