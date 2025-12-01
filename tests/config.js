// tests/config.js
export const LONG_WAIT_TIMEOUT = process.env.INFOMOVIL_LONG_WAIT_TIMEOUT
  ? parseInt(process.env.INFOMOVIL_LONG_WAIT_TIMEOUT, 10)
  : 60000
