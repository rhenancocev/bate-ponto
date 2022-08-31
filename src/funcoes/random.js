function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min + 1) + min
    )
}
/* Example:  
console.log(  
    between(0, 59)
)*/

module.exports = {
    between: between
}