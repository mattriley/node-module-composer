import type { UnionToIntersection } from 'type-fest'

interface CoreOptions {
    depth: number
    overrides: object
    customiser: string
    configAlias: string
    freezeConfig: boolean
    extensions: boolean
}

interface ExtensionOptions {
    globalThis: object
    publicPrefix: string
    privatePrefix: string
    functionAlias: object
    moduleAlias: string[]
}

type Options = CoreOptions & ExtensionOptions

type Composed = (...args: any) => any
type Composable = (deps: Modules) => (...args: any) => any
type Module = Record<PropertyKey, Composable | Composed>
type Modules = Record<PropertyKey, Module>

type ComposedModule<T extends Module> = {
    [K in keyof T]: ReturnType<T[K]>
}

type ModuleParameters<T extends Module, Key = keyof T> =
    Key extends PropertyKey ? Parameters<T[Key]>[0] : never

type ModuleDependencies<T extends Module> = UnionToIntersection<NonNullable<ModuleParameters<T>>>

type Compose<T extends Modules> = <Path extends keyof T>(path: Path, deps: ModuleDependencies<T[Path]>, opts?: Partial<Options>) => Record<Path, ComposedModule<T[Path]>>

interface Asis<T extends Modules> {
    asis<Path extends keyof T>(path: Path, opts?: Partial<Options>): Record<Path, T[Path]>
}

interface Composer<T extends Modules> {
    compose: Compose<T> & Asis<T>
}

declare function composer<T extends Modules>(config: T): Composer<T>

export default composer;
