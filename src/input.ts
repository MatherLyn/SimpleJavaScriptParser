const code: string = `
const a = 'Hello world.'
const b = function (msg) {
  return () => { console.log(msg); }
}

b(a)
`

export default code