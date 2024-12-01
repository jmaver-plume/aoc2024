import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

// Parse input
const rawData = await fs.readFile(new URL('input.txt', import.meta.url), 'utf-8');
const {leftList, rightList} = rawData.split('\n').reduce(({leftList, rightList}, line) => {
    const match = line.match(/(\d+)\s+(\d+)/)
    return {
        leftList: leftList.concat(parseInt(match[1])),
        rightList: rightList.concat(parseInt(match[2])),
    }
}, { leftList: [], rightList: []})
assert.equal(leftList.length, rightList.length)


// Part 1 solution
leftList.sort((a, b) => a - b)
rightList.sort((a, b) => a - b)
let distance = 0;
for (let i = 0; i < leftList.length; i++) {
    const left = leftList[i]
    const right = rightList[i]
    distance += Math.abs(left - right)
}
console.log(`Part 1: ${distance}`)


// Part 2 solution
const rightListNumberToCountMap = new Map()
rightList.forEach(number => {
    const count = rightListNumberToCountMap.get(number) ?? 0
    rightListNumberToCountMap.set(number, count + 1)
})
let similarityScore = 0;
leftList.forEach(number => {
    similarityScore += number * (rightListNumberToCountMap.get(number) ?? 0)
})
console.log(`Part 2: ${similarityScore}`)