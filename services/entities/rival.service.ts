
import { RivalDynasty, RivalPerson, Gender, GameState } from '../../types/index';
import {
  RIVAL_LIFESPAN, RIVAL_LIFESPAN_VARIATION, CHANCE_RIVAL_DEATH_PER_YEAR_OLD_AGE,
  RIVAL_MAX_CHILDREN, RIVAL_BASE_INCOME, RIVAL_INCOME_PER_STATUS_POINT,
  RIVAL_STATUS_FROM_MONARCH_WEIGHT, RIVAL_STATUS_FROM_TREASURY_FACTOR, RIVAL_STATUS_PER_MEMBER_FACTOR,
  RIVAL_MIN_MARRIAGE_AGE, RIVAL_MAX_CHILD_BEARING_AGE, AI_CHANCE_SEEK_MARRIAGE_PER_YEAR,
  MALE_FIRST_NAMES, FEMALE_FIRST_NAMES, EUROPEAN_DYNASTY_BASENAMES, 
  CHANCE_RIVAL_MONARCH_BIRTH_FIRST_CHILD, CHANCE_RIVAL_MONARCH_BIRTH_SECOND_CHILD, CHANCE_RIVAL_MONARCH_BIRTH_SUBSEQUENT_CHILD
} from '../../constants';
import { calculateAge, createRivalPerson } from './person.service'; 
import { getRandomInt, getRandomElement } from '../util/utility.service';

export const updateRivalDynastyTitles = (rival: RivalDynasty): RivalDynasty => {
  const updatedRival = JSON.parse(JSON.stringify(rival)) as RivalDynasty;
  const monarch = updatedRival.currentMonarchId ? updatedRival.members[updatedRival.currentMonarchId] : null;
  const rivalDynastyBaseName = updatedRival.name.replace(/^House of /, "").split(" of ")[0];

  // 1. Clear all titles
  for (const memberId in updatedRival.members) {
    updatedRival.members[memberId].title = undefined;
  }

  // 2. Assign King/Queen and Consort
  if (monarch && monarch.isAlive) {
    updatedRival.members[monarch.id].title = monarch.gender === Gender.Male ? 'King' : 'Queen';
    if (monarch.spouseInfo) {
      const spouseAsMember = Object.values(updatedRival.members).find(m =>
        m.isAlive &&
        m.firstName === monarch.spouseInfo!.firstName &&
        m.lastName === monarch.spouseInfo!.lastName &&
        m.id !== monarch.id &&
        !m.title 
      );
      if (spouseAsMember) {
        spouseAsMember.title = monarch.gender === Gender.Male ? 'Queen Consort' : 'Prince Consort';
      }
    }

    // 3. Assign Prince/Princess to monarch's children (simplified identification)
    const monarchChildren: RivalPerson[] = [];
    Object.values(updatedRival.members).forEach(member => {
        if (member.isAlive && member.id !== monarch.id && !member.spouseInfo && member.lastName === rivalDynastyBaseName && !member.title) {
            const ageDifferenceFromMonarch = calculateAge(member.birthYear, monarch.birthYear);
            if (ageDifferenceFromMonarch < -RIVAL_MIN_MARRIAGE_AGE) { 
                 member.title = member.gender === Gender.Male ? 'Prince' : 'Princess';
                 monarchChildren.push(member); 
                 if (member.spouseInfo) { 
                    const spouseOfPrinceOrPrincess = Object.values(updatedRival.members).find(s =>
                        s.isAlive && !s.title && s.firstName === member.spouseInfo!.firstName && s.lastName === member.spouseInfo!.lastName
                    );
                    if (spouseOfPrinceOrPrincess) {
                        spouseOfPrinceOrPrincess.title = member.gender === Gender.Male ? 'Princess' : 'Prince Consort';
                    }
                 }
            }
        }
    });

    // 4. Assign Duke/Duchess for other high-status members or specific relations
    Object.values(updatedRival.members).forEach(member => {
        if (member.isAlive && member.lastName === rivalDynastyBaseName && !member.title && member.id !== monarch.id) {
            const age = calculateAge(member.birthYear, monarch.birthYear);
            if (Math.abs(age) <= 15 && age > -RIVAL_MIN_MARRIAGE_AGE) { 
                 member.title = member.gender === Gender.Male ? 'Duke' : 'Duchess';
                 if (member.spouseInfo) {
                    const dukeOrDuchessSpouse = Object.values(updatedRival.members).find(s =>
                        s.isAlive && !s.title && s.firstName === member.spouseInfo!.firstName && s.lastName === member.spouseInfo!.lastName
                    );
                    if (dukeOrDuchessSpouse) {
                        dukeOrDuchessSpouse.title = member.gender === Gender.Male ? 'Duchess' : 'Duke Consort';
                    }
                 }
            }
        }
    });
     monarchChildren.forEach(princeOrPrincess => {
        Object.values(updatedRival.members).forEach(potentialGrandchild => {
            if(potentialGrandchild.isAlive && !potentialGrandchild.title && potentialGrandchild.lastName === rivalDynastyBaseName &&
               calculateAge(potentialGrandchild.birthYear, princeOrPrincess.birthYear) < -RIVAL_MIN_MARRIAGE_AGE + 5) { 
                 potentialGrandchild.title = potentialGrandchild.gender === Gender.Male ? 'Duke' : 'Duchess';
                  if (potentialGrandchild.spouseInfo) {
                    const grandchildSpouse = Object.values(updatedRival.members).find(s =>
                        s.isAlive && !s.title && s.firstName === potentialGrandchild.spouseInfo!.firstName && s.lastName === potentialGrandchild.spouseInfo!.lastName
                    );
                    if (grandchildSpouse) {
                        grandchildSpouse.title = potentialGrandchild.gender === Gender.Male ? 'Duchess' : 'Duke Consort';
                    }
                 }
            }
        });
    });

  }
  return updatedRival;
};

export const processRivalDynastyYear = (rival: RivalDynasty, currentYear: number): RivalDynasty => {
    let updatedRival = JSON.parse(JSON.stringify(rival)) as RivalDynasty;
    let totalLivingMembers = 0;
    for (const memberId in updatedRival.members) {
      let member = updatedRival.members[memberId];
      if (member.isAlive) {
        const age = calculateAge(member.birthYear, currentYear);
        const rivalLifespan = RIVAL_LIFESPAN + getRandomInt(-RIVAL_LIFESPAN_VARIATION, RIVAL_LIFESPAN_VARIATION);
        if (age > rivalLifespan || (age > 60 && Math.random() < CHANCE_RIVAL_DEATH_PER_YEAR_OLD_AGE)) {
          member.isAlive = false;
          member.deathYear = currentYear;
          if (member.id === updatedRival.currentMonarchId) {
            updatedRival.currentMonarchId = null; 
          }
           if (member.spouseInfo) {
            const spouseName = member.spouseInfo.firstName;
            const spouseLastName = member.spouseInfo.lastName;
            const livingSpouse = Object.values(updatedRival.members).find(m => m.isAlive && m.firstName === spouseName && m.lastName === spouseLastName && m.spouseInfo?.firstName === member.firstName);
            if(livingSpouse){ 
                livingSpouse.spouseInfo = undefined;
            }
          }
        } else {
          totalLivingMembers++;
        }
      }
      updatedRival.members[memberId] = member;
    }
    
    if (!updatedRival.currentMonarchId && totalLivingMembers > 0) {
        const rivalDynastyBaseName = updatedRival.name.replace(/^House of /, "").split(" of ")[0];
        const potentialHeirs = Object.values(updatedRival.members)
            .filter(m => m.isAlive && m.lastName === rivalDynastyBaseName) 
            .sort((a,b) => a.birthYear - b.birthYear); 
        if (potentialHeirs.length > 0) {
            updatedRival.currentMonarchId = potentialHeirs[0].id;
        }
    }
    const currentMonarch = updatedRival.currentMonarchId ? updatedRival.members[updatedRival.currentMonarchId] : null;

    if (currentMonarch && currentMonarch.isAlive && currentMonarch.spouseInfo && currentMonarch.childrenCount < RIVAL_MAX_CHILDREN) {
        const monarchAge = calculateAge(currentMonarch.birthYear, currentYear);
        let birthChance = 0;
        switch (currentMonarch.childrenCount) {
            case 0: birthChance = CHANCE_RIVAL_MONARCH_BIRTH_FIRST_CHILD; break;
            case 1: birthChance = CHANCE_RIVAL_MONARCH_BIRTH_SECOND_CHILD; break;
            default: birthChance = CHANCE_RIVAL_MONARCH_BIRTH_SUBSEQUENT_CHILD; break;
        }

        const isEligibleFemaleMonarch = currentMonarch.gender === Gender.Female && monarchAge <= RIVAL_MAX_CHILD_BEARING_AGE && monarchAge >= RIVAL_MIN_MARRIAGE_AGE;
        const isEligibleMaleMonarch = currentMonarch.gender === Gender.Male; 

        if ((isEligibleFemaleMonarch || isEligibleMaleMonarch) && Math.random() < birthChance) {
            const childGender = Math.random() < 0.5 ? Gender.Male : Gender.Female;
            const child = createRivalPerson(currentYear, childGender, updatedRival.name.replace(/^House of /, "").split(" of ")[0], false);
            updatedRival.members[child.id] = child;
            if(updatedRival.members[currentMonarch.id]) { 
                updatedRival.members[currentMonarch.id].childrenCount++;
            }
        }
    }
    
    Object.values(updatedRival.members).forEach(member => {
      if (member.isAlive && !member.spouseInfo && calculateAge(member.birthYear, currentYear) >= RIVAL_MIN_MARRIAGE_AGE && Math.random() < AI_CHANCE_SEEK_MARRIAGE_PER_YEAR) {
          const spouseGender = member.gender === Gender.Male ? Gender.Female : Gender.Male;
          const spouseFirstName = (spouseGender === Gender.Male ? getRandomElement(MALE_FIRST_NAMES) : getRandomElement(FEMALE_FIRST_NAMES)) || "SpouseName";
          member.spouseInfo = {
              firstName: spouseFirstName,
              lastName: getRandomElement(EUROPEAN_DYNASTY_BASENAMES.filter(n => n !== member.lastName)) || "SpouseLastName", 
              statusPoints: getRandomInt(15,50) 
          };
      }
    });

    let newStatus = 0;
    const livingMonarch = updatedRival.currentMonarchId ? updatedRival.members[updatedRival.currentMonarchId] : null; 
    if (livingMonarch && livingMonarch.isAlive) {
        newStatus += livingMonarch.statusPoints * RIVAL_STATUS_FROM_MONARCH_WEIGHT;
        if (livingMonarch.spouseInfo) {
            newStatus += livingMonarch.spouseInfo.statusPoints * (RIVAL_STATUS_FROM_MONARCH_WEIGHT / 2);
        }
    }
    newStatus += updatedRival.treasury * RIVAL_STATUS_FROM_TREASURY_FACTOR;
    newStatus += Object.values(updatedRival.members).filter(m => m.isAlive).length * RIVAL_STATUS_PER_MEMBER_FACTOR;
    newStatus = Math.max(0, Math.min(100, newStatus + getRandomInt(-2,2))); 
    updatedRival.status = parseFloat(newStatus.toFixed(2));

    updatedRival.treasury += RIVAL_BASE_INCOME + Math.floor(updatedRival.status * RIVAL_INCOME_PER_STATUS_POINT) + getRandomInt(-5,10);
    updatedRival.treasury = Math.max(0, updatedRival.treasury);

    updatedRival = updateRivalDynastyTitles(updatedRival); 

    return updatedRival;
};
