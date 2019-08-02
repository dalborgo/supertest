import numeral from 'numeral'

numeral.register('locale', 'it', {
  delimiters: {
    thousands: '.',
    decimal: ','
  },
  currency: {
    symbol: '€'
  }
})
numeral.locale('it')

export default {
  printMoney (value, fd = 2) {
    return this.printDecimal(value, fd, true)
  },
  printDecimal (value, fd = 2, money = false) {
    let str = ''
    if (fd > 0) {
      str = '.'
      for (let i = 0; i < fd; i++) {
        str += '0'
      }
    }
    return numeral(value).format(money ? `$ 0,0${str}` : `0,0${str}`)
  }
}
