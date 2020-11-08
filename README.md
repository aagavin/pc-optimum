[![CodeFactor](https://www.codefactor.io/repository/github/aagavin/pc-optimum/badge)](https://www.codefactor.io/repository/github/aagavin/pc-optimum) [![CircleCI](https://circleci.com/gh/aagavin/pc-optimum/tree/master.svg?style=svg)](https://circleci.com/gh/aagavin/pc-optimum/tree/master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/aagavin/pc-optimum.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/aagavin/pc-optimum/context:javascript)

# pc-optimum-pdf mailer

Send pdf of the webpage https://www.pcoptimum.ca/offers to an email using your provided smpt provider

# Setup Locally

* run `npm ci`
* Setup the following envernment varables

    - `E_USERNAME` email server username
    - `E_PASSWORD` email server password _(Should be application specific)_
    - `E_FROM`     email to use as the FROM feild in the email
    - `E_TO`       email your sending the email to

* Run using
`npm run start-local <pcoptimum.ca username> <pcoptimum.ca password>`

> eg. `npm run start-local email@example.ca hunter2`

# Package

* Setup the envernment varables up as outlined in the **Setup locally** section
* Build using `npm run build`
* run using `npm run start <pcoptimum.ca username> <pcoptimum.ca password>`

> eg. `npm run start email@example.ca hunter2`
