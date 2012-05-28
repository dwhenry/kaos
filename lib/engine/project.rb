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

    def self.root
      relationships = ::Relationship.
        select_all(:relationships).
        join(:associations, :id => :relationships__association_id).
        where(:ass_type => 'tree',
              :end_at => nil,
              :rel_type => 'child')

      items = Item.
        where(~:id => relationships.map(&:item_id),
              :item_type => ITEM_TYPE)

      items.map { |item| new item }
    end

    def save!
      DB.transaction do
        save_item!
        if @parent_id
          @parent = Engine::Helper::RelationBuilder.parent(id, parent_id)
        else
          @parent = nil
          Engine::Helper::RelationBuilder.parent(id, nil)
        end
      end
    end

    def parent
      Engine::Project.new
    end

    def children
      Engine::Helper::RelationGetter.children(id)
    end
  end
end