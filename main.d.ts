import type { ConditionalKeys, EmptyObject, UnionToIntersection, UnknownRecord } from 'type-fest';

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

type ComposerOptionsConfig = UnknownRecord | UnknownRecord[]
interface ComposerOptions {
    config?: ComposerOptionsConfig
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Composed = (...args: any[]) => any
type Composable = (deps: Modules) => Composed
type ModuleFunction = Composable | Composed
type SetupComposable = { setup: (deps: Modules) => Composed }

type Module<T = UnknownRecord> = {
    [K in keyof T]: T[K] extends ModuleFunction
    ? ModuleFunction
    : Module<T[K]>
}

type Modules = Record<PropertyKey, Module | unknown>

type ComposedBySetup<T extends SetupComposable> = ReturnType<ReturnType<T['setup']>>
type ComposedIndividually<T extends Module> = {
    [K in keyof T]: T[K] extends ModuleFunction
    ? ReturnType<T[K]>
    : ComposedModule<T[K]>
}

export type ComposedModule<T extends Module> =
    T extends SetupComposable
    ? ComposedBySetup<T>
    : ComposedIndividually<T>

type ModuleParameters<T extends Module, Key = keyof T> =
    Key extends PropertyKey
    ? T[Key] extends ModuleFunction
    ? Parameters<T[Key]>[0]
    : ModuleParameters<T[Key]>
    : never

type ModuleDependencies<T extends Module, C extends ComposerOptions> =
    C['config'] extends ComposerOptionsConfig
    ? Omit<UnionToIntersection<NonNullable<ModuleParameters<T>>>, 'config'>
    : UnionToIntersection<NonNullable<ModuleParameters<T>>>

type Deps<T extends Modules, Path extends keyof T, C extends ComposerOptions> = Omit<ModuleDependencies<ModulePath<T, Path>, C>, Path | 'self'>
type ComposeResult<T extends Modules, Path extends keyof T> = Record<Path, ComposedModule<ModulePath<T, Path>>>

type ModuleKeys<T> = ConditionalKeys<T, Module>
type ModulePath<T, Path extends keyof T> = T extends Module ? T[Path] : never

type Compose<T extends Modules, C extends ComposerOptions> = <Path extends ModuleKeys<T>, PathDeps = Deps<T, Path, C>>(
    path: Path,
    ...args: PathDeps extends EmptyObject ? [PathDeps?, Partial<Options>?] : [PathDeps, Partial<Options>?]
) => ComposeResult<T, Path>

interface Asis<T extends Modules> {
    asis<Path extends keyof T>(path: Path, opts?: Partial<Options>): Record<Path, T[Path]>
}

interface Deep<T extends Modules, C extends ComposerOptions> {
    deep: Compose<T, C>
}

interface Target<T> {
    target: T
}

interface Composer<T extends Modules, C extends ComposerOptions> {
    compose: Target<T> & Compose<T, C> & Asis<T> & Deep<T, C>
}

declare function composer<T extends Modules, C extends ComposerOptions>(target: T, config?: C): Composer<T, C>

export default composer;
