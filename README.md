# What is this?

This is a basic alexa skill with simple functionality, such as remembering the user and playing an audio stream.

# How does it work?

We store the userId (unique for every amazon user - not device) in DynamoDB and use a simple counter to remember, how often a user has used the skill. Depending on the amount of visits, the user gets a different greet.

# How do i get started?

Ensure your AWS Credentials are set properly in your env vars (AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY), after that you can run `sls deploy` to deploy serverless!
