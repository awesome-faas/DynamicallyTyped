import path from "path";
import resolvePackagePath from "resolve-package-path";
import {jsonInputForTargetLanguage} from "quicktype-core";
import {quicktypeJSON} from "./quicktype";
import {promises as fs} from "fs";

export type Config = {
    generators?: {
        [key: string]: GeneratorConfig[] | GeneratorConfig
    }
}

export type GeneratorConfig = { name?: string, [key: string]: any };

export type JSONGenerator<C = GeneratorConfig> = (config: C) => string | Promise<string>;
// export type TypesGenerator<C = GeneratorConfig> = (config: C) => void | Promise<void>;


const baseDir = process.cwd()

async function cleanDTyped() {
    const dtypedDir = path.join(baseDir, 'dtyped');
    await fs.rm(dtypedDir, {recursive: true, force: true});
    await fs.mkdir(dtypedDir)
}

async function saveTypes(filename: string, types: string) {
    const dtypedDir = path.join(baseDir, 'dtyped');
    await fs.writeFile(path.join(dtypedDir, `${filename}.d.ts`), types)
}

async function main() {
    const rest = await import(path.join(baseDir, `dtyped.config.ts`));
    const config = rest.default as Config;
    const packages = Object.keys(config.generators);

    await cleanDTyped();

    await Promise.all(packages.map(async pkg => {
        const packageJSONPath = resolvePackagePath(pkg, baseDir);
        const packageJSON = require(packageJSONPath);
        if (!packageJSON.dtyped) throw new Error(`Package ${pkg} is not prepared to be used with dtyped`);
        const func: { default: JSONGenerator } = await import(path.resolve(path.dirname(packageJSONPath), packageJSON.dtyped));
        const configs = Array.isArray(config.generators[pkg]) ? config.generators[pkg] : [config.generators[pkg]]
        const responses = await Promise.all(configs.map(async conf => {
            const json = await func.default(conf)
            await saveTypes(conf.name, await quicktypeJSON(conf.name, json))
        }));

    }))
}

if (require.main.filename.includes('cli.ts')) {
    main().catch(console.log);
}