module Engine
  class Status
    ITEM_TYPE = 'status'
    include Base

    def save!
      save_item!
    end
  end
end