
/**Takes in a substring and an array of strings
 * 
 * filters the array of strings and returns a new array with any matching elements
 */

export function filterSearch(str, arr) {
    let strLower = str.toLowerCase()

    const filteredArr = arr.filter(el => el.toLowerCase().includes(strLower))

    return filteredArr
}