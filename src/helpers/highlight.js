function escapeRegExpChars(text) {
   return text.replace(/([.*+?^=!:${}()|\\[\\])/g, "\\$1")
}

export default function highlight(text, query) {
   let lastIndex = 0
   const words = query
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(escapeRegExpChars)
   if (words.length === 0) {
      return [text]
   }
   const regexp = new RegExp(words.join("|"), "gi")
   const tokens = []
   const isTrue = true
   while (isTrue) {
      const match = regexp.exec(text)
      if (!match) {
         break
      }
      const { length } = match[0]
      const before = text.slice(lastIndex, regexp.lastIndex - length)
      if (before.length > 0) {
         tokens.push(before)
      }
      lastIndex = regexp.lastIndex
      tokens.push(`<b key={${lastIndex}}>${match[0]}</b>`)
   }
   const rest = text.slice(lastIndex)
   if (rest.length > 0) {
      tokens.push(rest)
   }
   return tokens
}
