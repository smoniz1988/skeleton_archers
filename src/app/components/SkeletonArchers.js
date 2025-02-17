"use client";
import React, {useState, useEffect} from 'react'
import Image from 'next/image';
import { rollAttack, rollDice, damageDiceSizes, ATTACK_MODES } from '../utility/Dice';

function SkeletonArchers() {
    const attackRollModifiers = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0 , 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
   
    const [results, setResults] = useState([]);
    const [resultsSummary, setResultsSummary] = useState();
 
    const getClassNameForAttack = (res) => {
        if (res.isCrit) { return 'crit'; }
        if (res.isCritFail) { return 'crit-fail'};
    }

    const handleRepent = (evt) => {
        evt.preventDefault();
        const formData = new FormData(evt.target);
        const data = Object.fromEntries(formData);
        const {numberOfAttacks, attackRollModifier, damageDiceSize, damageModifier, enemyAC=0, attackMode } = data;
    
        let attackResults = [];
        for (let i=0; i<numberOfAttacks; i++) {
            const rolls = rollAttack(attackMode);
            const attackRoll = rolls[0];
            console.log({rolls, chosenRoll: attackRoll});
            const attackRollTotal = parseInt(attackRoll) + parseInt(attackRollModifier);
            const isCrit = attackRoll === 20;
            const isCritFail = attackRoll === 1;
            const hits = isCrit || (!isCritFail && parseInt(attackRollTotal) >= parseInt(enemyAC));

            let damageRoll = 0;
            let damageTotal = 0;
            const critDamage = isCrit ? parseInt(damageDiceSize) : 0;

            if (hits) {
                damageRoll = rollDice(damageDiceSize);
                damageTotal = parseInt(damageRoll) + parseInt(damageModifier) + parseInt(critDamage);
            }

            attackResults.push({
                rolls,
                attackRoll,
                attackRollModifier,
                attackRollTotal,
                hits,
                isCrit,
                isCritFail,
                enemyAC,
                damageRoll,
                damageModifier,
                critDamage,
                damageTotal,
            });
        }
        setResults(attackResults);
    };

    const getDamageString = (res) => {
        let str = '';
        if (res.hits) {
            str += ` (`;
            str += `${res.damageRoll} + ${res.damageModifier}`;
            str += ` + Crit: ${res.critDamage}`;
            str+=')';
        }
        return str;
    }

    useEffect(() => {
        const damageSummary = getDamageSummary(results);
        setResultsSummary(damageSummary);
    }, [results]);

    const getDamageSummary = (results) => {
        const totalAttacks = results.length;
        let totalCrits = 0;
        let totalHits = 0;
        let totalDamage = 0;
        results.forEach((result) => {
            if (result.hits) { totalHits++; }
            if (result.isCrit) { totalCrits ++ };
            totalDamage += parseInt(result.damageTotal);
        });

        return {
            totalAttacks,
            totalCrits,
            totalHits,
            totalDamage,
        };
    };

    const roundToTwo = (num) => {
        return +(Math.round(num + "e+2")  + "e-2");
    };

    const getPercentage = (amt, total) => {
        return roundToTwo((amt / total) * 100);
    };
    
    const getRollStrings = (res) => {
        let str='';
        console.log({res});
        res.rolls.forEach((roll) => {
            str+= roll + '+' + res.attackRollModifier;

        })
        str += res.rolls;
  
        return str;
    };

   
 
  return (
    <div>
        <div style={{lineHeight: '150px'}}>
            <Image className="float-left" src="/images/skeleton-archer.png" width="150" height="150"/>
            <h1>Skeleton Archers</h1>
        </div>
 
       
        <div className="clear-both">
           <form onSubmit={handleRepent}>
            <div className={'mt-6'}>
                    <h2>Attack Configuration</h2>
                    <div>
                        <label>Number of Attacks</label>
                        <input type="text" name="numberOfAttacks" maxLength={4} defaultValue={24} />
                    </div>
                
                    <div>
                        <label>To Hit</label>
                        <select name="attackRollModifier" defaultValue={0}>
                            {attackRollModifiers.map((attackRollModifier) => 
                                <option key={attackRollModifier} value={attackRollModifier}>{attackRollModifier}</option>
                            )}
                        </select>
                    </div>

                    <div>
                        <label>Attack Mode</label>
                        <select name="attackMode">
                        {ATTACK_MODES.map((attackMode) => {
                            return (
                               <option value={attackMode}>{attackMode}</option>
                            );
                         })}
                        </select>
                            
                       
                    </div>
                </div>

                
                <div className={'mt-6'}>
                    <h2>Damage Configuration</h2>
                    <div>
                        <label>Damage Die</label>
                        <select name="damageDiceSize" defaultValue={6}>
                            {damageDiceSizes.map((damageDiceSize) => 
                                <option key={damageDiceSize} value={damageDiceSize}>{`d${damageDiceSize}`}</option>
                            )}
                        </select>
                    </div>
                    <div>
                        <label>Damage Modifier</label>
                        <input type="text" name="damageModifier" defaultValue={0} />
                    </div>
                </div>

                <div className={'mt-6'}>
                    <h2>Enemy Configuration</h2>
                    <div>
                        <label>AC</label>
                        <input type="text" name="enemyAC" defaultValue={16} size={3} minLength={1} maxLength={3} />
                    </div>
                </div>

                <div className={'mt-6'}>
                    <button type="submit">Repent!</button>
                </div>
           </form>
        </div>
       
        <hr className={'mt-6'}/>
       
        <div className={'mt-6'}>
          
                {results.length<=0 && (
                    <>
                        <h2>Skeletons awaiting orders...</h2>
                    </>
                )}
                {results.length>0 && (
                    <>
                        <h2>Repent, sinners!</h2>
                        <ul>
                            <li>Attacks Made: {resultsSummary.totalAttacks}</li>
                            <li>Crits: {resultsSummary.totalCrits} ({getPercentage(resultsSummary.totalCrits, resultsSummary.totalHits)}%)</li>
                            <li>Hits: {resultsSummary.totalHits} ({getPercentage(resultsSummary.totalHits, resultsSummary.totalAttacks)}%)</li>
                            <li>Total Damage: {resultsSummary.totalDamage} / Average: {roundToTwo(resultsSummary.totalDamage / resultsSummary.totalHits)}</li>
                        </ul>
                        <table className='mt-6'>
                            <thead>
                                <tr><td>Skeleton#</td><td>Dice Roll</td><td>Hits?</td><td>Damage Total</td><td>Damage Breakdown</td></tr>
                            </thead>
                            <tbody>
                            {results.map((res, index) => 
                                <tr key={`attack-${index}`}>
                                    <td>{index + 1}</td>
                                    <td className={getClassNameForAttack(res)}>
                                        {res.rolls.map((roll, rollIndex) => {
                                            const rollTotal = parseInt(roll) + parseInt(res.attackRollModifier);
                                            const rollString = `${rollTotal} (${roll} + ${res.attackRollModifier})`;
                                            const className = rollIndex===0 ? '' : 'line-through';
                                            return (
                                                <div className={className}>
                                                   {rollString}
                                                </div>
                                            );
                                        })}
                                    </td>
                                    <td>{res.hits ? 'Yes' : 'No'}</td>
                                    <td>{res.damageTotal}</td>
                                    <td>{getDamageString(res)}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </>
                    
                )}
        </div>
      
    </div>
    
  )
}

export default SkeletonArchers;