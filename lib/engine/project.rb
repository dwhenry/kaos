module Engine
  class Project
    extend ActiveModel::Naming
    include ActiveModel::Conversion
    def persisted?; false end

    attr_reader :id, :parent
    attr_accessor :parent_id

    delegate :name, :description, :to => :item

    def self.all
      Item.filter(:item_type => 'project').map do |item|
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
      DB.transaction do
        if id
          debugger
          self.item = Item.filter(:id => id).upate_attributes!(item.attributes)
        else
          item.save!
          @id = item.id
        end
        @parent = Parent.manage(id, parent_id)
      end
    end

    def to_json
      @params
    end

    def parent
      Engine::Project.new
    end

    private

    def item
      @item ||= Item.new(
        :name => @params['name'],
        :description => @params['description'],
        :item_type => 'project'
      )
    end
  end

  class Parent
    def self.manage(id, parent_id)
      manager = new(id, parent_id)
      manager.update
      manager.get
    end

    def initialize(id, parent_id)
      @id, @parent_id = id, parent_id
    end

    def get
      parent
    end

    def parent
      @parent ||= association.parent
    end

    def update
      if @parent_id.nil?
        return if association.nil?
        end_association
      else
        unless association.nil?
          return if association.parent_id == @parent_id
          end_association
        end
        create_association
      end
    end

    def end_association
      association.parent.update_attributes!(:end_at => Time.now)
      @association = nil
      @parent = nil
    end

    def create_association
      @association = Association.new(:start_at => Time.now, :ass_type => 'tree')
      @association.build_child(:item_id => @id, :rel_type => 'child')
      @association.build_parent(:item_id => @parent_id, :rel_type => 'parent')
      debugger
      @association.save!
    end

    def association
      @association ||= Association.first(
        :include => :child,
        :conditions => ['associations.end_at is null and relationships.item_id = ?', @id]
      )
    end
  end
end