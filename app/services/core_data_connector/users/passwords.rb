module CoreDataConnector
  module Users
    class Passwords

      # default lengths of generated passwords
      USER_PASSWORD_LENGTH = 16

      # Password format; must match frontend validation regex
      PASSWORD_FORMAT = /\A
        (?=.{8,})            # Must contain 8 or more characters
        (?=.*\d)             # Must contain a digit
        (?=.*[a-z])          # Must contain a lower case character
        (?=.*[A-Z])          # Must contain an upper case character
        (?=.*[^a-zA-Z0-9\s]) # Must contain a symbol
      /x

      def self.generate_user_password
        generate_password USER_PASSWORD_LENGTH
      end

      private

      def self.generate_password(length)
        # generate a password that is guaranteed to match regex
        lower = ('a'..'z').to_a
        upper = ('A'..'Z').to_a
        numbers = ('0'..'9').to_a
        symbols = %w[@ $ ! % * ? &]
        all_allowed = lower + upper + numbers + symbols

        # random mix of allowed characters (ensure at least one of each required type)
        required = [lower.sample, upper.sample, numbers.sample, symbols.sample]
        rest = Array.new(length - 4) { all_allowed.sample }
        password_chars = required + rest
  
        # shuffle so that first 4 aren't always "lower upper number symbol"
        password_chars.shuffle.join
      end
    end
  end
end