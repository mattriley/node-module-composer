import { expectType } from 'tsd/dist/index';

import composer from './main';

type Toy = string
type Food = string

type ServeFood = (food: Food) => Food[]
type FillBowl = (choice: Food, bowl: Food[]) => void
type RandomToy = () => Toy
type Play = () => void
type Eat = () => void

type HumanDeps = {
    food: { serve: ServeFood }
}

type RandomToyDeps = {
    config: { availableToys: string[] }
}

type PlayDeps = {
    toys: { randomToy: () => Toy }
    util: { shuffle: (str: string) => string }
}

type EatDeps = {
    human: { fillBowl: FillBowl }
}

const modules = {
    util: {
        shuffle: (str: string) => [...str].sort(() => Math.random() - 0.5).join('')
    },

    food: {
        serve: (): ServeFood => food => [food, food, food]
    },

    human: {
        fillBowl: ({ food }: HumanDeps): FillBowl => (choice, bowl) => bowl.concat(food.serve(choice))
    },

    toys: {
        randomToy: ({ config }: RandomToyDeps): RandomToy => () => config.availableToys[Math.floor(Math.random() * config.availableToys.length)]
    },

    cat: {
        play: ({ toys, util }: PlayDeps): Play => () => {
            const toy = toys.randomToy();
            util.shuffle(toy);
        },

        eat: ({ human }: EatDeps): Eat => () => {
            const bowl: Food[] = [];
            human.fillBowl('tuna', bowl);

            while (bowl.length > 0) {
                // have a nibble
                bowl.pop();
            }
        }
    }
};

const { compose } = composer(modules, { config: { availableToys: ['yarn', 'bell', 'feather'] } });

// compose as-is with no dependencies
const { util } = compose.asis('util');
expectType<typeof modules.util>(util);

// compose with no dependencies
const { food } = compose('food', {});
expectType<{ serve: ServeFood }>(food);

// compose with a dependency
const { human } = compose('human', { food });
expectType<{ fillBowl: FillBowl }>(human);

// compose with only config dependency
const { toys } = compose('toys', {});
expectType<{ randomToy: RandomToy }>(toys);

// compose with multiple dependencies across functions
const { cat } = compose('cat', { toys, util, human });
expectType<{ play: Play, eat: Eat }>(cat);

// config is required as a dependency if it is not passed into the composer and an option
const { compose: composeWithoutConfig } = composer(modules);
composeWithoutConfig('toys', { config: { availableToys: ['yarn', 'bell', 'feather'] } });
