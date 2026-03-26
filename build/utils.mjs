import child_process from 'child_process'

export function check_port(port = 9527) {
  return new Promise(resolve => {
    child_process.exec(`netstat -an | grep LISTEN | grep ${port}`, (error, stdout, stderr) => {
      if (error) {
        resolve(port)
      }
      // 端口被占用
      if (stdout) {
        check_port(port + 1).then(resolve)
      }
    })
  })
}
