module Engine
  module Helper
    class RelationBuilder
      def self.parent(from_id, to_id)
        manager = new(from_id, to_id, 'child', 'parent', 'tree')
        manager.update
        manager.to
      end

      def initialize(from_id, to_id, from_type, to_type, ass_type)
        @from_id = from_id
        @to_id = to_id
        @from_type = from_type
        @to_type = to_type
        @ass_type = ass_type
      end

      def to
        @to ||= association.send(:try, @to_type)
      end

      def update
        if @to_id
          if association
            return if to.id == @to_id
            end_association
          end
          create_association
        else
          return if association.nil?
          end_association
        end
      end

      def end_association
        association.update(:end_at => Time.now)
        @association = nil
        @parent = nil
      end

      def create_association
        @association = Association.create(:start_at => Time.now, :ass_type =>  @ass_type)
        @association.child = Relationship.create(:item_id => @from_id, :rel_type => @from_type)
        @association.parent = Relationship.create(:item_id => @to_id, :rel_type => @to_type)
      end

      def association
        @association ||= Association.first(
          @from_type.to_sym => Relationship.filter(:item_id => @from_id),
          :end_at => nil,
          :ass_type => @ass_type
        )
      end
    end
  end
end