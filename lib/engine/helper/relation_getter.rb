module Engine
  module Helper
    class RelationGetter
      include Enumerable
      class << self
        # find the item for which this is a child
        # - should only be one...
        def parent(id)
          finder = new(id, 'child', 'tree')
          Engine::Project.new finder.object
        end

        # find all items which have a parent of id
        def children(id)
          finder = new(id, 'parent', 'tree')
          finder.map do |project|
            Engine::Project.new project
          end
        end
      end

      # find objects that are rel_type on an ass_type assocaition
      # and the opposite side has the given id
      def initialize(id, rel_type, ass_type)
        @id = id
        @rel_type = rel_type
        @ass_type = ass_type
      end

      def find
        @find_results ||= case associations.count
        when 0
          []
        when 1
          items.all
        else
          raise('Multiple associations should not exist')
        end
      end

      # return the single object
      def object
        find.first
      end

      def each(&blk)
        find.each(&blk)
      end


      def associations
        @associations ||= ::Association.
          select_all(:associations).
          join(:relationships, :association_id => :associations__id).
          where(:ass_type => @ass_type,
                :item_id => @id,
                :end_at => nil,
                :rel_type => @rel_type)
      end

      def items
        Item.
          join(:relationships, :item_id => :id).
          join(:associations, :relationships__association_id => :associations__id).
          where(:associations__id => associations.map(&:id),
                ~:rel_type => @rel_type,
                :ass_type => @ass_type)
      end
    end
  end
end