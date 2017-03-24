'use strict';

import chai, { expect, assert } from 'chai'
import dollynho from '../src/index';
import nock from 'nock'

const MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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'


describe('Middleware tests', () => {
  it('Should send slack notification', done => {
    const middleware = dollynho({
      webhookUrl: MY_SLACK_WEBHOOK_URL,
      shouldSendToSlack: (err) => {
        return err.output.payload.statusCode === 404
      },
    })

    const error = new Error('A 404 error')
    error.output = {
      payload: {
        statusCode: 404
      }
    }

    middleware(error, null, null, (err) => {
      done()
    })
  })

  it('Should not send slack notification', done => {
    const middleware = dollynho({
      webhookUrl: MY_SLACK_WEBHOOK_URL,
      shouldSendToSlack: (err) => {
        return err.output.payload.statusCode === 404
      },
    })

    const error = new Error('A 500 error')
    error.output = {
      payload: {
        statusCode: 500
      }
    }

    middleware(error, null, null, (err) => {
      done()
    })
  })
})
