import {
    quicktype,
    jsonInputForTargetLanguage,
    InputData,
    TypeScriptTargetLanguage,
} from "quicktype-core";


export async function quicktypeJSON(typeName, jsonString) {
    const jsonInput = jsonInputForTargetLanguage('typescript');
    await jsonInput.addSource({
        name: typeName,
        samples: [jsonString],

    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);
    const lang = new TypeScriptTargetLanguage();

    const {lines} = await quicktype({
        inputData,
        lang,
        rendererOptions: {"just-types": "true"}
    });
    
    return lines.join('\n')
}


