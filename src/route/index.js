// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================
class Product {
  static #list = []
  static #count = 0
  constructor(
    img,
    title,
    description,
    category,
    price,
    amount = 0,
  ) {
    this.id = ++Product.#count //Генеруємо унікальний id для товару

    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newProduct = new Product(...data)
    return this.#list.push(newProduct)
  }

  static getList = () => {
    return this.#list
  }
  //Находит продукт по идентификатору
  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    //Фыльтруэмо товари, щоб вилучити той, з яким порывнюэмо id
    const filteredList = this.#list.filter(
      (product) => product.id !== id,
    )
    //Відсортовуємо за допомогою Math.random та перемішуємо масив
    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    //Повертаємо перші 3 елементи з перемішаного масиву
    return shuffledList.slice(0, 3)
  }
}
Product.add(
  `https://picsum.photos/200/300`,
  'Коьпютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6-4.2 GHz)……………',
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  27000,
  10,
)

Product.add(
  `https://picsum.photos/200/300`,
  'Коьпютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6-4.2 GHz)……………',
  [{ id: 1, text: 'Топ продажів' }],
  20000,
  10,
)
Product.add(
  `https://picsum.photos/200/300`,
  'Коьпютер Artline Gaming (X43v31) AMD Ryzen 5 3600/',
  'AMD Ryzen 5 3600 (3.6-4.2 GHz)……………',
  [{ id: 1, text: 'Топ продажів' }],
  40000,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance = (
    email,
    price,
    bonusUse = 0,
  ) => {
    // const amount = price * Purchase.#BONUS_FACTOR
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purchase.getBonusBalance(email)
    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)
    console.log(email, updatedBalance)
    return amount
  }

  constructor(data, product) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }
  //стат.метод, принимает ...аргументы и передаёт их в new Purchase
  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)
    //и вкладывает их в список #list
    this.#list.push(newPurchase)
    //возвращает созданный заказ
    return newPurchase
  }
  static getList = () => {
    return Purchase.#list
      .reverse()
      .map(({ ...data }) => ({ ...data }))
  }
  //находим и возвращаем заказ по id
  static getById = (id) => {
    return Purchase.#list.find((item) => item.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if (purchase) {
      if (data.firstname)
        purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.phone) purchase.phone = data.phone
      if (data.email) purchase.email = data.email

      return true
    } else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
//============================

// router.get('/', function (req, res) {
//   res.render('index', {
//     style: 'index',
//     data: {
//       //  list: Product.getList(),
//     },
//   })
// })

//=======ALERT=====================

// router.get('/', function (req, res) {
//   res.render('alert', {
//     style: 'alert',
//     data: {
//       message: 'Операція успішна',
//       info: 'Товар створений',
//       link: '/test-path',
//     },
//   })
// })

//=========purchase-index============================
router.get('/', function (req, res) {
  res.render('purchase-index', {
    style: 'purchase-index',
    // data: {
    //   img: 'https://picsum.photos/200/300',
    //   title: `Коьпютер Artline Gaming (X43v31) AMD Ryzen 5 3600/`,
    //   description: `AMD Ryzen 5 3600 (3.6-4.2 GHz)……………`,
    //   category: [
    //     { id: 1, text: 'Готовий до відправки' },
    //     { id: 2, text: 'Топ продажів' },
    //   ],
    //   price: 27000,
    // },
    data: {
      list: Product.getList(),
    },
  })
})
// //==========purchase-product================
router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})
// //============purchase-create===========
router.post(`/purchase-create`, function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-product?id=${id}`,
      },
    })
  }

  const product = Product.getById(id)

  if (product.amount < 1) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Такої кількістi товару немає в наявності',
        link: `/purchase-product?id=${id}`,
      },
    })
  }
  console.log(product, amount)

  const productPrice = product.price * amount
  const totalPrice = productPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        {
          text: `${product.title} (${amount}шт)`,
          price: productPrice,
        },
        {
          text: 'Доставка',
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

// //=============purchase-submit==============
router.post(`/purchase-submit`, function (req, res) {
  const id = Number(req.query.id)

  let {
    totalPrice,
    productPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/purchase-list`,
      },
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Товару немає в потрібній кількості',
        link: `/purchase-list`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      data: {
        message: 'Помилка',
        info: 'Некоректні данні',
        link: `/purchase-list`,
      },
    })
  }

  if (!firstname || !lastname || !email || !phone) {
    res.render('alert', {
      style: 'alert',
      data: {
        message: 'Заповніть обовязкові поля',
        info: 'Некоректні данні',
        link: `/purchase-list`,
      },
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)
    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }
    Purchase.updateBonusBalance(email, totalPrice, bonus)
    totalPrice -= bonus
  } else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,

      promocode,
      comment,
    },
    product,
  )

  console.log(purchase)

  res.render('alert', {
    style: 'alert',
    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list`,
    },
  })
})
// //========purchase-info===========================
router.get('/purchase-info', function (req, res) {
  const id = Number(req.query.id)

  const purchase = Purchase.getById(id)
  const product = Product.getById(id)

  if ((purchase, product)) {
    res.render('purchase-info', {
      style: 'purchase-info',
      data: {
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        phone: purchase.phone,
        email: purchase.email,
        title: product.title,
        comment: product.comment,
        productPrice: purchase.productPrice,
      },
      // purchase,
    })
  }
})

// //=============purchase-list============
router.get('/purchase-list', function (req, res) {
  const id = Number(req.query.id)

  // const purchase = Purchase.getById(id)
  const product = Product.getById(id)
  if (product) {
    res.render('purchase-list', {
      style: 'purchase-list',
      data: {
        id: product.id,
        title: product.title,
        price: product.price,
        bonus: purchase.bonus,
      },
    })
  }
})

// //=============data-change============

router.get('/data-change', function (req, res) {
  const id = Number(req.query.id)
  const purchase = Purchase.getById(id)
  if (purchase) {
    res.render('data-change', {
      style: 'data-change',
      data: {
        id: purchase.id,
        firstname: purchase.firstname,
        lastname: purchase.lastname,
        email: purchase.email,
        phone: purchase.phone,
      },
    })
  }
})
// //========END======//
module.exports = router
