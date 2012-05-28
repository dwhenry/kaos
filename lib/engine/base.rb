# please don't complain I know this is a awful name..
# but what else should I call it..

module Engine
  module Base
    def self.included(base)
      base.send :extend, ActiveModel::Naming
      base.send :include, ActiveModel::Conversion
      base.send :extend, ClassMethods
    end

    def persisted?; false end

    attr_reader :id

    delegate :name, :description, :to => :item

    module ClassMethods
      def all
        Item.filter(:item_type => self::ITEM_TYPE).map do |item|
          new item.values
        end
      end

      def for_parent(parent)

      end
    end

    def self.build(params)
      new params
    end

    def initialize params={}
      @params = params
      @id = param(:id)
    end

    def to_json
      @params
    end

    private
    def param(key)
      @params[key.to_s] || @params[key.to_sym]
    end

    def save_item!
      DB.transaction do
        raise Engine::InvalidSave if name.blank?

        if id
          Item[id].upate!(item.values)
        else
          item.save
          @id = item.id
        end
      end
    end

    def item
      @item ||= Item.new(
        :name => param(:name),
        :description => param(:description),
        :item_type => self.class::ITEM_TYPE
      )
    end
  end
end