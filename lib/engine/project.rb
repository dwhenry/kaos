module Engine
  class Project
    ITEM_TYPE = 'project'
    include Base

    attr_reader :parent
    attr_accessor :parent_id

    delegate :name, :description, :to => :item


    def initialize params={}
      super
      @parent_id = param(:parent_id)
    end

    def save!
      DB.transaction do
        save_item!
        @parent = Parent.manage(id, parent_id)
      end
    end

    def parent
      Engine::Project.new
    end
  end
end