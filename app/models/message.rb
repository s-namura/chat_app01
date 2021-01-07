class Message < ApplicationRecord
  belongs_to :user
  valitates :user_id, presence: true
  valitates :content, presence: true, length: { maximum: 500 }
end
