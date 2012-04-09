module Engine
  class Login
    extend ActiveModel::Naming
    include ActiveModel::Conversion
    def persisted?; false end

    attr_accessor :login, :password
    attr_reader :user

    def valid?
      @user = true
      true
    end
  end
end