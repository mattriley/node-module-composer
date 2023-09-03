import { expectType } from 'tsd/dist/index';

import composer from './main';

type Toy = string
type Food = string

type ServeFood = (food: Food, bowl: Food[]) => void 
type FillBowl = (choice: Food, bowl: Food[]) => void 
type RandomToy = () => Toy 
type Play = () => void 
type Eat = () => void 

type HumanDeps = {
    food: { serve: ServeFood }
}

type PlayDeps = {
    toys: { randomToy: () => Toy }
    util: { shuffle: (str: string) => string}
}

type EatDeps = {
    human: { fillBowl: FillBowl }
}

const modules = { 
    util : {
        shuffle: (str: string) => [...str].sort(() => Math.random() - 0.5).join('')
    },

    food: { 
        serve: (): ServeFood => (food, bowl) => { bowl.push(food); }
    },
    
    human: { 
        fillBowl: ({ food }: HumanDeps): FillBowl => (choice, bowl) => food.serve(choice, bowl)
    },
    
    toys: { 
        randomToy: (): RandomToy => () => 'yarn'
    },

    cat: { 
        play: ({ toys, util }: PlayDeps): Play => () => {
            const toy = toys.randomToy();
            util.shuffle(toy);
        } ,

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

const { compose } = composer(modules);

// compose as-is with no dependencies
const { util } = compose.asis('util');
expectType<typeof modules.util>(util);

// compose with no dependencies
const { food } = compose('food', {});
expectType<{ serve: ServeFood }>(food);

// compose with a dependency
const { human } = compose('human', { food });
expectType<{ fillBowl: FillBowl }>(human);

// compose with no dependencies
const { toys } = compose('toys', { food });
expectType<{ randomToy: RandomToy }>(toys);

// compose with multiple dependencies across functions
const { cat } = compose('cat',  { toys, util, human });
expectType<{ play: Play, eat: Eat }>(cat);
