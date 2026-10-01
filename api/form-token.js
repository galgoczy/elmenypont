import { issueToken } from '../lib/spamGuard.js'

/** Short-lived signed token the contact/demo forms post back — see lib/spamGuard.js */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  return res.status(200).json({ t: issueToken() })
}
