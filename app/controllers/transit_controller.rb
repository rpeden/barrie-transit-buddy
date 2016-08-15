class TransitController < ApplicationController

def index
  @routes = Route.take(200).to_json
end

end
