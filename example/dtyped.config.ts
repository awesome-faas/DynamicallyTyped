import {Config} from "dtyped";

const config: Config = {
    generators: {
        "@dtyped/http-response": [{
            name: "RatesapiResponse",
            req: [
                "https://api.ratesapi.io/api/latest?base=USD",
                "https://api.ratesapi.io/api/latest?base=error"
            ]
        }, {
            name: "MetaWeather",
            req: [
                "https://www.metaweather.com/api/location/search/?query=Moscow",
                "https://www.metaweather.com/api/location/search/?query=Austin"
            ]
        }],

        // "@dtypes/airtable": {
        //     name: "AirtableDatabase",
        //     apiKey: "",
        //     source: {
        //         Base1: {
        //             id: "app6nX97jyyOjCae7",
        //             tables: ["Stories"]
        //         }
        //     }
        // },
    }
}

export default config