module Engine
  class Status
    extend ActiveModel::Naming
    include ActiveModel::Conversion
    def persisted?; false end

    attr_reader :id

    delegate :name, :description, :to => :item

    def self.all
      Item.where(:item_type => 'status').map do |item|
        new item.attributes
      end
    end

    def self.build(params)
      new params
    end

    def initialize params={}
      @params = params
      @id = params['id']

    end

    def save!
      raise Engine::InvalidSave if name.blank?
      if id
        Item.find(id).upate_attributes!(item.attributes)
      else
        item.save!
        @id = item.id
      end
    end

    def to_json
      @params
    end

    private
    def item
      @item ||= Item.new(
        :name => @params['name'],
        :description => @params['description'],
        :item_type => 'status'
      )
    end
  end
end