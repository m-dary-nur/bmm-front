import _ from "lodash"

const diff = (n, o) => {
   function changes(object, base) {
      const tfm = function (result, value, key) {
         if (!_.isEqual(value, base[key])) {
            result[key] = _.isObject(value) && _.isObject(base[key]) ? changes(value, base[key]) : value
         }
      }
      return _.transform(object, tfm)
   }
   const result = changes(n, o)
   return result
}

export default diff
