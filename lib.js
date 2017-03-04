'use strict'

const stripeConfig = {
  key: 'pk_test_DHMnPcqtrrWSvo1REbYqFnh7',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    currency: 'DKK',
  // rest field from https://stripe.com/docs/checkout
}

function loadContent () {
  return new Promise((resolve, reject) => {
    let items = null
    try {
      if (sessionStorage.items) {
        items = JSON.parse(sessionStorage.items)
      }
    }
    catch (e) {
      console.error(e.message)
    }
    if (items !== null) {
      resolve(items)
    }
    else {
      const SPACE_ID = 'xcc5bcpq1bzl'
      const ACCESS_TOKEN = '7c2d47447f69007013be6ea72b531db3748dd971f6acbcd3f4d831491f6f9013'
      const client = contentful.createClient({
        space: SPACE_ID,
        accessToken: ACCESS_TOKEN
      })
      client.getEntries()
        .then((response) => {
          let items = response.items.map(item => item.fields)
          items.forEach((item) => {if (!item.order) item.order = 0 })
          items = items.sort((a, b) => a.order - b.order) // sort ascending
          items.forEach(item => console.info(item.order + ' ' + item.name + ' ' + item.duration))
          let pause = {
            duration: 1,
            name: "Skift",
            tags: {
              change: 1,
            },
          }
          let items2 = []
          items.forEach((item, index) => {
            if (index > 0) {
              items2.push(pause)
            }
            items2.push(item)
          })
          items = items2
          items.forEach((item) => {if (!item.tags) item.tags = {} }) // fix tags
          if (sessionStorage.skip) items.forEach(item => {item.duration = (item.tags.change) ? 1 : parseFloat(sessionStorage.skip)})
          resolve(items)
          sessionStorage.items = JSON.stringify(items)
        })
        .catch(reject)
    }
  })
}

function toggleFullScreen () {
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
    (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
}

function playRandomFromArray (array, delay) {
  if (!array || array.length === 0) {
    console.info("did not play random", array)
  }
  else {
    const idx = Math.floor(Math.random() * array.length)
    const sound = array[idx]
    if (delay) {
      const h = setTimeout(sound, delay * 1000)
      handles.add(h)
      if (delay > 100) console.warn("Delay is way too long?",delay,array)
    }
    else {
      sound()
    }
    array.splice(idx, 1)
  }
}
