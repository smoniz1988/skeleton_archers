"use client";
import React, {useState, useEffect} from 'react'

function SkeletonArchers() {
    const attackRollModifiers = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0 , 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const damageDiceSizes = [4, 6, 8, 10, 12];
    const [results, setResults] = useState([]);
    const [resultsSummary, setResultsSummary] = useState();
    
    const rollDice = (size) => Math.floor(Math.random() * size) + 1;

    const getClassNameForAttack = (res) => {
        if (res.isCrit) { return 'crit'; }
        if (res.isCritFail) { return 'crit-fail'};
    }

    const handleRepent = (evt) => {
        evt.preventDefault();
        const formData = new FormData(evt.target);
        const data = Object.fromEntries(formData);
        const {numberOfAttacks, attackRollModifier, advantage, damageDiceSize, damageModifier, enemyAC } = data;
    
        let attackResults = [];
        for (let i=0; i<numberOfAttacks; i++) {
            const attackRoll = rollDice(20);
            const isCrit = attackRoll === 20;
            const isCritFail = attackRoll === 1;
            const attackRollTotal = parseInt(attackRoll) + parseInt(attackRollModifier);
            const hits = !isCritFail && parseInt(attackRollTotal) >= parseInt(enemyAC);
            let damageRoll = 0;
            let damageTotal = 0;
            const critDamage = isCrit ? parseInt(damageDiceSize) : 0;

            if (hits) {
                damageRoll = rollDice(damageDiceSize);
                damageTotal = parseInt(damageRoll) + parseInt(damageModifier) + parseInt(critDamage);
            }

            attackResults.push({
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
        console.log(res);
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

 
  return (
    <div>
        <h1>Skeleton Archers</h1>
        <div>
           <form onSubmit={handleRepent}>
            <div className={'mt-6'}>
                    <h2>Attack Configuration</h2>
                    <div>
                        <label>Number of Attacks</label>
                        <input type="text" name="numberOfAttacks" defaultValue={24} />
                    </div>
                
                    <div>
                        <label>To Hit</label>
                        <select name="attackRollModifier">
                            {attackRollModifiers.map((attackRollModifier) => 
                                <option selected={attackRollModifier===0} key={attackRollModifier} value={attackRollModifier}>{attackRollModifier}</option>
                            )}
                        </select>
                    </div>
                
                    <div>
                        <label>Advantage?</label>
                        <input name="advantage" type="checkbox"/>
                    </div>
                </div>

                
                <div className={'mt-6'}>
                    <h2>Damage Configuration</h2>
                    <div>
                        <label>Damage Die</label>
                        <select name="damageDiceSize">
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
                        <input type="text" name="enemyAC" defaultValue={16} />
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
                        <h2>Skeletons Ready to Deal  Justice...</h2>
                        <span>Waiting on orders...</span>
                    </>
                )}
                {results.length>0 && (
                    <>
                        <h2>Repent!</h2>
                        <ul>
                            <li>Attacks Made: {resultsSummary.totalAttacks}</li>
                            <li>Crits: {resultsSummary.totalCrits}</li>
                            <li>Hits: {resultsSummary.totalHits}</li>
                            <li>Total Damage: {resultsSummary.totalDamage}</li>
                        </ul>
                        <table className='mt-6'>
                            <thead>
                                <tr><td>Skeleton#</td><td>Dice Roll</td><td>Hits?</td><td>Damage Total</td><td>Damage Breakdown</td></tr>
                            </thead>
                            <tbody>
                            {results.map((res, index) => 
                                <tr key={`attack-${index}`}>
                                    <td>{index + 1}</td>
                                    <td className={getClassNameForAttack(res)}>{res.attackRollTotal} ({res.attackRoll} + {res.attackRollModifier})</td>
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