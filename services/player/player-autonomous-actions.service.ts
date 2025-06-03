
import { GameState, Person, Gender } from '../../types/index';
import { calculateAge, createPerson } from '../entities/person.service';
import { updatePlayerTitles } from './dynasty.service';
import { marryPeople } from '../player/relationship.service'; 
import {
    MIN_MARRIAGE_AGE, CHANCE_PLAYER_MEMBER_AUTONOMOUS_MARRIAGE,
    COMMON_LAST_NAMES, COUNTRIES, MALE_FIRST_NAMES, FEMALE_FIRST_NAMES
} from '../../constants';
import { getRandomInt, getRandomElement } from '../util/utility.service';

export const processPlayerAutonomousMarriages = (state: GameState): GameState => {
    let newState = JSON.parse(JSON.stringify(state)) as GameState;
    const playerDynastyBaseName = newState.dynastyName ? newState.dynastyName.replace("House of ", "") : "";
    const personIds = Object.keys(newState.allPeople);

    for (const personId of personIds) {
        const person = newState.allPeople[personId];
        if (!person) continue;

        if (
            person.isAlive &&
            !person.isExcommunicated &&
            !person.spouseId &&
            person.lastName === playerDynastyBaseName &&
            (person.isRoyalBlood) &&
            calculateAge(person.birthYear, newState.currentYear) >= MIN_MARRIAGE_AGE &&
            Math.random() < CHANCE_PLAYER_MEMBER_AUTONOMOUS_MARRIAGE
        ) {
            const eligibleSuitors = newState.potentialSuitors.filter(s =>
                s.gender !== person.gender &&
                calculateAge(s.birthYear, newState.currentYear) >= MIN_MARRIAGE_AGE &&
                !s.spouseId &&
                !s.isExcommunicated &&
                s.statusPoints >= person.statusPoints * 0.4 
            ).sort((a, b) => b.statusPoints - a.statusPoints); // Prioritize highest status

            if (eligibleSuitors.length > 0) {
                const chosenSuitor = eligibleSuitors[0];
                newState = marryPeople(newState, person.id, chosenSuitor.id);
            } else {
                const spouseGender = person.gender === Gender.Male ? Gender.Female : Gender.Male;
                const personAge = calculateAge(person.birthYear, newState.currentYear);
                const spouseAgeMin = Math.max(MIN_MARRIAGE_AGE, personAge - 10);
                const spouseAgeMax = Math.min(personAge + 10, 50);
                const spouseAge = getRandomInt(spouseAgeMin, spouseAgeMax);
                const spouseBirthYear = newState.currentYear - spouseAge;
                
                const spouseOriginalLastName = getRandomElement(COMMON_LAST_NAMES) || "SpouseLastName";
                const spouseOriginCountries = COUNTRIES.filter(c => c !== newState.playerDynastyOrigin);
                const defaultOrigin = "Unknown Origin";
                const spouseOrigin = (spouseOriginCountries.length > 0 ? getRandomElement(spouseOriginCountries) : getRandomElement(COUNTRIES)) || defaultOrigin;

                const spouse = createPerson(
                    spouseBirthYear,
                    spouseGender,
                    false, 
                    spouseOriginalLastName,
                    person.generation,
                    undefined, undefined, false, false, undefined,
                    spouseOrigin,
                    person.statusPoints 
                );
                
                let generatedSpouseStatus = Math.floor(person.statusPoints * 0.5 + getRandomInt(-5, 10));
                generatedSpouseStatus = Math.min(100, Math.max(10, generatedSpouseStatus));
                spouse.statusPoints = generatedSpouseStatus;

                if (spouse.statusPoints > 55) {
                    spouse.title = "Socialite";
                }

                newState.allPeople[spouse.id] = spouse; 

                const personToUpdate = newState.allPeople[person.id]; 
                const spouseToUpdate = newState.allPeople[spouse.id]; 

                personToUpdate.spouseId = spouse.id;
                spouseToUpdate.spouseId = person.id;
                spouseToUpdate.isMarriedToRoyal = true;
                spouseToUpdate.lastName = person.lastName; 

                newState.notifications.push(`${person.firstName} ${person.lastName} has autonomously married ${spouse.firstName} ${spouse.originalLastName} (now ${spouseToUpdate.lastName}, Status: ${spouseToUpdate.statusPoints}).`);
            }
        }
    }
    newState = updatePlayerTitles(newState);
    return newState;
};
