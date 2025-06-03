
import { GameState, Person, Gender } from '../../types/index';
import { calculateAge, createPerson } from '../entities/person.service';
import {
    MIN_MARRIAGE_AGE, MAX_CHILD_BEARING_AGE_FEMALE, AVERAGE_LIFESPAN, LIFESPAN_VARIATION,
    CHANCE_OF_RANDOM_DEATH,
    CHANCE_PLAYER_BIRTH_FIRST_CHILD, CHANCE_PLAYER_BIRTH_SECOND_CHILD,
    CHANCE_PLAYER_BIRTH_THIRD_CHILD, CHANCE_PLAYER_BIRTH_SUBSEQUENT_CHILD
} from '../../constants';
import { getRandomInt } from '../util/utility.service';

export const updatePlayerPopulation = (state: GameState): GameState => { 
    let newState = JSON.parse(JSON.stringify(state)) as GameState;
    const newAllPeople: Record<string, Person> = {};

    for (const personId in newState.allPeople) {
        let person = newState.allPeople[personId];
        if (person.isAlive) {
            const age = calculateAge(person.birthYear, newState.currentYear);
            const lifespan = AVERAGE_LIFESPAN + getRandomInt(-LIFESPAN_VARIATION, LIFESPAN_VARIATION);
            if (age > lifespan || Math.random() < CHANCE_OF_RANDOM_DEATH) {
                person.isAlive = false;
                person.deathYear = newState.currentYear;
                newState.notifications.push(`${person.firstName} ${person.lastName} has died at age ${age}.`);
                if (person.spouseId && newState.allPeople[person.spouseId]) { 
                    newState.allPeople[person.spouseId].spouseId = undefined;
                }
                if (newState.currentMonarchId === person.id) {
                    newState.notifications.push(`The realm mourns the passing of their Monarch, ${person.firstName}.`);
                }
            }
        }
        newAllPeople[personId] = person;
    }
    newState.allPeople = newAllPeople;

    const livingRoyalWomen = Object.values(newState.allPeople).filter(p =>
        p.isAlive &&
        p.gender === Gender.Female &&
        p.spouseId && newState.allPeople[p.spouseId!]?.isAlive && 
        !newState.allPeople[p.spouseId!]?.isExcommunicated && 
        !p.isExcommunicated &&
        (p.isRoyalBlood || p.isMarriedToRoyal) && 
        calculateAge(p.birthYear, newState.currentYear) >= MIN_MARRIAGE_AGE &&
        calculateAge(p.birthYear, newState.currentYear) <= MAX_CHILD_BEARING_AGE_FEMALE
    );

    for (const mother of livingRoyalWomen) {
        const father = newState.allPeople[mother.spouseId!]; 
        
        let childrenOfCoupleCount = 0;
        Object.values(newState.allPeople).forEach(person => {
            if (person.motherId === mother.id && person.fatherId === father.id) {
                childrenOfCoupleCount++;
            }
        });

        let birthChance = 0;
        switch (childrenOfCoupleCount) {
            case 0: birthChance = CHANCE_PLAYER_BIRTH_FIRST_CHILD; break;
            case 1: birthChance = CHANCE_PLAYER_BIRTH_SECOND_CHILD; break;
            case 2: birthChance = CHANCE_PLAYER_BIRTH_THIRD_CHILD; break;
            default: birthChance = CHANCE_PLAYER_BIRTH_SUBSEQUENT_CHILD; break;
        }

        if (Math.random() < birthChance) {
            const childIsRoyalBlood = mother.isRoyalBlood || father.isRoyalBlood;
            
            if (childIsRoyalBlood) {
                const childGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
                const childDynastyName = newState.dynastyName; 
                const childGeneration = Math.max(mother.generation, father.generation) + 1;
                
                const child = createPerson(
                    newState.currentYear, 
                    childGender, 
                    true, 
                    childDynastyName, 
                    childGeneration, 
                    father, 
                    mother, 
                    false, 
                    false, 
                    undefined, 
                    newState.playerDynastyOrigin
                );
                
                newState.allPeople[child.id] = child;
                if(mother.childrenIds && father.childrenIds) { 
                  mother.childrenIds.push(child.id); 
                  father.childrenIds.push(child.id); 
                }
                newState.notifications.push(`${child.firstName} ${child.lastName} was born to ${mother.firstName} and ${father.firstName}.`);
            }
        }
    }
    return newState; 
};
