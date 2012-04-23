module Engine
  module Helper
    class RelationBuilder

      class << self
        #
        # create a parent-child relationship in the tree space
        # This should be used to mark set the parent project for
        # project..
        # Or alternatively chnage the parent project to another one if desired.
        #
        def parent(from_id, to_id)
          manager = new(from_id, to_id, 'child', 'parent', 'tree')
          manager.update
          manager.to
        end
      end
      #
      # This class should only be used through one of the class level
      # methods.  This is generic code for link two items.
      # The end structure being:
      #
      #  [ Item 1 ] => [ Relationship 1 ] <= [ Association 1]
      #  [ Item 2 ] => [ Relationship 2 ]
      #
      # The start_at and end_at dates on the assocaition are used
      # for historical mapping, and the ass_type field to filter
      # different type of assocaitions:
      #
      # * Tree (This is the project structure)
      # * Status (This allows a project to be asigned to a specific status)
      # * Worker (This allows users time to be allocated to the project)
      #
      def initialize(from_id, to_id, from_type, to_type, ass_type)
        @from_id = from_id
        @to_id = to_id
        @from_type = from_type
        @to_type = to_type
        @ass_type = ass_type
      end

      def to
        @to ||= current_association.send(:try, @to_type)
      end

      def update
        if @to_id
          create
        else
          end_association if current_association
        end
      end

      def create
        if current_association
          return if to.id == @to_id
          end_association
        end
        create_association
      end

      def end_association
        current_association.update(:end_at => Time.now)
        @association = nil
        @parent = nil
      end

      def create_association
        @association = Association.create(:start_at => Time.now, :ass_type =>  @ass_type)
        @association.child = Relationship.create(:item_id => @from_id, :rel_type => @from_type)
        @association.parent = Relationship.create(:item_id => @to_id, :rel_type => @to_type)
      end

      def current_association
        @association ||= Association.first(
          @from_type.to_sym => Relationship.filter(:item_id => @from_id),
          :end_at => nil,
          :ass_type => @ass_type
        )
      end
    end
  end
end