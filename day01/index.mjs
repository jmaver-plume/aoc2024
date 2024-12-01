import fs from 'node:fs/promises';

// Parse input
const rawData = await fs.readFile(new URL('input.txt', import.meta.url), 'utf-8');
const rawLines = rawData.split('\n')
const lines = rawLines.map(line => {
    const [_, first, second] = line.match(/(\d+)\s+(\d+)/)
    return [parseInt(first), parseInt(second)]
})
const leftList = lines.map(([first, second]) => first)
const rightList = lines.map(([first, second]) => second)


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