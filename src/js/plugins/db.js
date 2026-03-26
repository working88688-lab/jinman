define([], function () {
  function set({ db_name, db_version = 1, table_name, data = {} }) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(db_name, db_version)
      request.onsuccess = function (res) {
        const db = res.target.result

        const transaction = db.transaction([table_name], 'readwrite')

        const store = transaction.objectStore(table_name)

        const request = store.add({
          ...data,
          id: data.id
        })
        request.onsuccess = resolve

        request.onerror = reject
      }
      request.onupgradeneeded = function (res) {
        const _db = res.target.result
        if (!_db.objectStoreNames.contains(table_name)) {
          _db.createObjectStore(table_name, {
            keyPath: 'id',
            unique: true
          })
        }
      }

      request.onerror = reject
    })
  }

  function get({ db_name, db_version = 1, table_name, options = {} }) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(db_name, db_version)
      request.onsuccess = function (res) {
        const db = res.target.result
        var store = db.transaction([table_name]).objectStore(table_name)
        var request = store.getAll()
        request.onsuccess = event => {
          const { offset = 1, limit = 20 } = options
          const res = event.target.result
          const start = (offset - 1) * limit
          const end = start + limit
          resolve(res.slice(start, end))
        }

        request.onerror = reject
      }
      request.onupgradeneeded = function (res) {
        const _db = res.target.result
        if (!_db.objectStoreNames.contains(table_name)) {
          _db.createObjectStore(table_name, {
            keyPath: 'id',
            unique: true
          })
        }
      }

      request.onerror = reject
    })
  }
  return {
    set,
    get
  }
})
