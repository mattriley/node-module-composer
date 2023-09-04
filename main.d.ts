import type { UnionToIntersection, UnknownRecord } from 'type-fest';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Composed = (...args: any[]) => unknown
type Composable = (deps: Modules) => Composed
type Module = Record<PropertyKey, Composable | Composed>
type Modules = Record<PropertyKey, Module>

export type ComposedModule<T extends Module> = {
    [K in keyof T]: ReturnType<T[K]>
}

type ModuleParameters<T extends Module, Key = keyof T> =
    Key extends PropertyKey ? Parameters<T[Key]>[0] : never

type ModuleDependencies<T extends Module, C> = C extends UnknownRecord ? Omit<UnionToIntersection<NonNullable<ModuleParameters<T>>>, 'config'> : UnionToIntersection<NonNullable<ModuleParameters<T>>>

type Compose<T extends Modules, C> = <Path extends keyof T>(path: Path, deps: ModuleDependencies<T[Path], C>, opts?: Partial<Options>) => Record<Path, ComposedModule<T[Path]>>

interface Asis<T extends Modules> {
    asis<Path extends keyof T>(path: Path, opts?: Partial<Options>): Record<Path, T[Path]>
}

interface Composer<T extends Modules, C> {
    compose: Compose<T, C> & Asis<T>
}

declare function composer<T extends Modules, C>(target: T, config?: C): Composer<T, C>

export default composer;
