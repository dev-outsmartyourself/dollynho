import GetIP from 'external-ip'
import platform from 'platform'
import Slack from 'slack-notify'

const getIP = GetIP()

const getIPAsPromise = () => new Promise((resolve, reject) => {
  getIP((err, ip) => {
    if (err) {
      reject(err)
    }
    resolve(ip)
  })
})


const defaultGetText = ({
  packageName,
  platform,
  env = 'development',
  ip,
  err,
}) => `*${packageName}* - *${platform.toString()}@${ip}* (${env}) \`\`\`${err.stack}\`\`\``

export default ({
  webhookUrl,
  shouldSendToSlack,
  channel = "#alerts",
  iconUrl = "http://www.guanabara.info/wp-content/uploads/2007/10/dollynho.jpg",
  username = 'Dollynho, seu amiguinho',
  getText = defaultGetText,
}) => {
  const slack = Slack(webhookUrl)
  return (err, req, res, next) => {
    if (!shouldSendToSlack(err)) {
      next(err)
      return
    }

    getIPAsPromise()
      .then((ip) => {
        if (!(getText && typeof getText === 'function')) {
          throw new Error('Get text must be a function')
        }

        const text = getText({
          packageName: process.env.npm_package_name,
          env: process.env.NODE_ENV,
          platform,
          ip,
          err
        })

        slack.send({
          channel,
          username,
          text,
          icon_url: iconUrl,
          unfurl_links: 1, // can I delete this?
        })
      })

    next(err)
  }
}
