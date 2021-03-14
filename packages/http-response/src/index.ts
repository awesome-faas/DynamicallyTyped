import got, {OptionsOfJSONResponseBody} from "got";
import {JSONGenerator} from "dtyped";

export type HttpResponseConfig = {
    name: string,
    req: (string | OptionsOfJSONResponseBody | (() => any | Promise<any>))[]
}


const generator: JSONGenerator<HttpResponseConfig> = async (config) => {
    const responses = await Promise.all(config.req.map(async (req) => {
        if (typeof req === 'function') return req();

        if (typeof req === 'string') return (await got({
            url: req, method: "GET", throwHttpErrors: false, responseType:'json'
        })).body

        if (req.responseType !== 'json') throw new Error("You have to set {responseType: 'json'} in options")

        return got(req).json()
    }));

    return JSON.stringify(responses)
}

export default generator;