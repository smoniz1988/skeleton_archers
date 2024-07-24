export const ATTACK_MODE_NORMAL='NORMAL';
export const ATTACK_MODE_ADVANTAGE='ADVANTAGE';
export const ATTACK_MODE_DISADVANTAGE='DISADVANTAGE';
export const ATTACK_MODES = [ATTACK_MODE_NORMAL, ATTACK_MODE_ADVANTAGE, ATTACK_MODE_DISADVANTAGE];

export const damageDiceSizes = [4, 6, 8, 10, 12];
export const rollDice = (size) => Math.floor(Math.random() * size) + 1;
export const rollAttack = (attackMode) => {
    const rolls = [];
    rolls.push(rollDice(20));
    if (attackMode === ATTACK_MODE_ADVANTAGE || attackMode===ATTACK_MODE_DISADVANTAGE) {
        rolls.push(rollDice(20));
    }

    if (attackMode === ATTACK_MODE_ADVANTAGE) {
        rolls.sort((a, b) => b-a);
    }else if (attackMode === ATTACK_MODE_DISADVANTAGE) {
        rolls.sort((a, b) => a-b);
    }
    
    return rolls;
} 
