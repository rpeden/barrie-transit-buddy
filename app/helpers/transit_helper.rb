module TransitHelper
    def compute_service_id
        day = Time.now.wday
      if (day > 0 && day < 6)
        return 1
    elsif (day == 6)
        return 2
    elsif (day == 0)
        return 3
      end
    end
end
