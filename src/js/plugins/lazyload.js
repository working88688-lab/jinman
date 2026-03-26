define(['jquery'], function ($) {

  const CACHE = new Map()
  const DB = {
    name: 'IMAGE_DB',
    version: 1
  }

  let db
  let status = 0
  let connect_resolves = []

  const crypto_worker = new Worker('/static/web/js/plugins/crypto-worker.js', {
    type: 'module'
  })
  const crypto_map = new Map()
  const fetch_from_worker = (src, options = { type: 'image', responseType: 'url' }) => {
    return new Promise((resolve, reject) => {
     
      crypto_map.set(src, {
        resolve,
        reject,
      })
      crypto_worker.postMessage({
        data: src,
        key: src,
        ...(options || {}),
      })
    })
  }
  crypto_worker.addEventListener('message', (e) => {
    const { result, key, error } = e.data

    const { resolve, reject } = crypto_map.get(key)
    if (resolve) {
      if (error) {
        reject?.(error)
      }
      else {
        resolve(result)
      }

      crypto_map.delete(key)
    }
  })
  function init_db() {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
      } else {
        if (status === 0) {
          status = 1
          const request = window.indexedDB.open(DB.name, DB.version)

          request.onerror = reject
          request.onsuccess = function (res) {
            status = 2
            if (!db) {
              db = res.target.result
            }

            if (connect_resolves.length) {
              connect_resolves.forEach(r => {
                r()
              })

              connect_resolves = []
            }
            resolve(db)
          }
          request.onupgradeneeded = function (res) {
            const _db = res.target.result
            if (!_db.objectStoreNames.contains(DB.name)) {
              _db.createObjectStore(DB.name, {
                keyPath: 'url',
                unique: true
              })
            }
          }
        } else if (status === 1) {
          connect_resolves.push(resolve)
        } else {
          resolve()
        }
      }
    })
  }

  function get_data_from_index_db(key) {
    return new Promise((resolve, reject) => {
      init_db()
        .then(() => {
          var store = db.transaction([DB.name]).objectStore(DB.name)
          var request = store.get(key)
          request.onsuccess = event => {
            resolve(event.target.result)
          }
          request.onerror = reject
        })
        .catch(reject)
    })
  }

  function save_data_to_index_db(key, blob) {
    return new Promise((resolve, reject) => {
      init_db()
        .then(() => {
          var store = db.transaction([DB.name], 'readwrite').objectStore(DB.name)

          var request = store.add({
            url: key,
            blob: blob
          })
          request.onsuccess = resolve

          request.onerror = reject
        })
        .catch(reject)
    })
  }

  const DEFAULT_LOADING = '/static/frontend/images/poster_loading.png'

  function onCryptoed(result, { el, img_src, observer, type, target, use_db }) {
    if (result) {
      const _url = result.url
      el.setAttribute('src', _url)
      if (target === 'style') {
        el.style.backgroundImage = `url(${_url})`
      } else {
        el.setAttribute('src', _url)
      }
      observer.unobserve(el)
      el.removeAttribute(type)
    } else {
      crypto_image({ el, img_src, observer, type, target, use_db })
    }
  }
  const image_observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target
        const type = el.getAttribute('_type')
        const img_src = el.getAttribute(type)
        const target = el.getAttribute('_target')
        const use_db = el.getAttribute('data-cache')

        const cache = CACHE.get(img_src)
        if (cache && cache.status === 2) {
          onCryptoed(cache, { el, observer, type, target })
        } else {
          if (use_db) {
            get_data_from_index_db(img_src)
              .then(data => {
                onCryptoed(data, { el, img_src, observer, type, target, use_db });
                if (data && data.blob) {
                  cache.set(img_src, {
                    url: URL.createObjectURL(data.blob),
                    status: 2
                  })
                }
              })
              .catch(() => {
                crypto_image({ el, img_src, observer, type, target, use_db })
              })
          } else {
            crypto_image({ el, img_src, observer, type, target, use_db })
          }
        }
      }
    })
  })
  const static_image_observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target
        const real_src = el.getAttribute('data-src')
        el.src = real_src
        el.removeAttribute('data-src')
        observer.unobserve(el)
      }
    })
  })
  function crypto_image({ el, img_src, observer, type, target, use_db }) {
    if (img_src) {
      fetch_image(img_src, {
        type: 'image',
        responseType: use_db ? 'file' : 'url'
      }).then(({ url}) => {
        if (target === 'style') {
          if (!error) {
            el.style.backgroundImage = `url(${url})`
            el.removeAttribute(type)
          }
        } else {
          el.setAttribute('src', url)
          el.removeAttribute(type)
        }

        if (use_db) {
          save_data_to_index_db(img_src, file)
        }
      }).catch(() => {
        if (!target === 'style') {
          el.setAttribute('src', default_src)
        }
      })
    } 
    observer.unobserve(el)
  }

  function load_image(attr = 'data-src') {
    $(`img[${attr}]`).each(function () {
      const el = $(this).get(0)
      el.setAttribute('_type', attr)
      const default_src = el.getAttribute('src')
      if (!default_src) {
        el.setAttribute('src', DEFAULT_LOADING)
      }
      const is_static = el.getAttribute('data-static')
      if (is_static) {
        static_image_observer.observe(el)
      } else {
        image_observer.observe(el)
      }
    })
  }

  function load_bg_image(selector = '.bg-poster', attr = 'data-src') {
    $(`${selector}[${attr}]`).each(function () {
      const el = $(this).get(0)
      el.setAttribute('_type', attr)
      el.setAttribute('_target', 'style')
      image_observer.observe(el)
    })
  }

  async function fetch_image(img_src) {
    return new Promise((resolve, reject) => {
      const cache = CACHE.get(img_src)
   
      if (cache) {
        const { status} = cache;
        if (status === 1) {
          const { resolvers } = cache
          return CACHE.set(img_src, {
            status: 1,
            resolvers: [...resolvers, (result) => resolve(result)]})
        }
        if (status === 0) {
          return reject(img_src + ':图片解密失败')
        }
        return resolve({
          url: cache.url,
          blob: cache.blob
        })
      }
      CACHE.set(img_src, {
        status: 1,
        resolvers: []
      })
      fetch_from_worker(img_src)
      .then((result) => {
        const cache = CACHE.get(img_src)
        const { resolvers } = cache;

        if (resolvers) {
          resolvers.forEach(_resolve => {
            _resolve(result)
          })
        }
        CACHE.set(img_src, {
          ...result,
          status: 2
        })
        resolve(result)
      }).catch(e=> {
        console.log('e: ', e);
        CACHE.set(img_src, {
          status: 0
        })
        console.warn(`${img_src}: 加载失败`)
      })
     
    })
   
  }
  

  function decrypto_image(img_src) {
    return new Promise((resolve, reject) => {
        fetch_image(img_src).then(result => {
          resolve(result.url)
        }).catch(reject)
    })
  }

  return {
    load_image,
    decrypto_image,
    load_bg_image
  }
})
