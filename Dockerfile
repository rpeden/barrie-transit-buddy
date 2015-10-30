FROM ruby:2.2.0
RUN apt-get update -qq && apt-get install -y build-essential
RUN mkdir /transpo
WORKDIR /transpo
ADD Gemfile /transpo/Gemfile
RUN bundle install
ADD . /transpo
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
