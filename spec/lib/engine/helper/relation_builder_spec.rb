require 'spec_helper'

describe Engine::Helper::RelationBuilder do
  subject { Engine::Helper::RelationBuilder }

  context 'the setting the parent for a project' do
    context  'when no existing parent' do
      context 'and no parent to set' do
        it 'does not create any relationships' do
          expect { subject.parent(1, nil) }.to_not change{ Relationship.count }
        end

        it 'does not create any associations' do
          expect { subject.parent(1, nil) }.to_not change{ Association.count }
        end
      end

      context 'when parent to set' do
        it 'create a tree association' do
          subject.parent(1, 2)
          Association.count.should == 1
          Association.first.ass_type.should == 'tree'
        end

        it 'creates two relationships' do
          subject.parent(1, 2)
          Relationship.count.should == 2

          Relationship.all.map(&:item_id).should == [1, 2]

          assoiation_id = Association.first.id
          Relationship.all.map(&:association_id).should == [assoiation_id, assoiation_id]

          Relationship.all.map(&:rel_type).should == ['child', 'parent']
        end
      end
    end

    context 'when existing parent record' do
      before { subject.parent(1, 2) }
      context 'and no parent to set' do
        it 'ends the current association' do
          subject.parent(1, nil)
          Association.first.end_at.should_not be_nil
        end

        it 'does not create a new association' do
          subject.parent(1, nil)
          Association.count.should == 1
        end
      end

      context 'and parent to set' do
        context 'which matches the existing' do
          it 'does nothing to the association' do
            expect { subject.parent(1, 2) }.to_not change{ Association.all }
          end

          it 'does nothing to the relationships' do
            expect { subject.parent(1, 2) }.to_not change{ Relationship.all }
          end
        end

        context 'which does not match the existing association' do
          def relationships(field)
            Association.all.last.relationships.map(&field)
          end

          before { subject.parent(1, 3) }

          it 'ends the existing association' do
            Association.first.end_at.should_not be_nil
          end

          it 'create a new assocation' do
            Association.count.should == 2
            Association.all.last.end_at.should be_nil
            Association.all.last.ass_type.should == 'tree'
          end

          it 'sets up new relationships' do
            relationships(:item_id).should == [1, 3]
            assoiation_id = Association.all.last.id
            relationships(:association_id).should == [assoiation_id, assoiation_id]
            relationships(:rel_type).should == ['child', 'parent']
          end
        end
      end
    end
  end

end