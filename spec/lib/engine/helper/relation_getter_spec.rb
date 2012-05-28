require 'spec_helper'

describe Engine::Helper::RelationGetter do
  describe 'ClassMethods' do
    let(:getter) { mock(:getter, :object => object, :map => []) }
    let(:object) { mock(:item) }

    before do
      Engine::Helper::RelationGetter.stub(:new => getter)
      Engine::Project.stub(:new => true)
    end

    context '#parent' do
      it 'creates a getter instance' do
        Engine::Helper::RelationGetter.should_receive(:new).
          with(12, 'child', 'tree')
        Engine::Helper::RelationGetter.parent(12)
      end

      it 'builds a project from the getter object' do
        Engine::Project.should_receive(:new).with(object)
        Engine::Helper::RelationGetter.parent(12)
      end
    end

    context '#children' do
      let(:object_1) { mock(:item) }
      let(:object_2) { mock(:item) }

      it 'creates a getter instance' do
        Engine::Helper::RelationGetter.should_receive(:new).
          with(12, 'parent', 'tree')
        Engine::Helper::RelationGetter.children(12)
      end

      it 'builds a project from the getter object' do
        Engine::Helper::RelationGetter.stub(:new => [object_1, object_2])

        Engine::Project.should_receive(:new).with(object_1)
        Engine::Project.should_receive(:new).with(object_2)
        Engine::Helper::RelationGetter.children(12)
      end
    end
  end

  describe '#find' do
    subject { Engine::Helper::RelationGetter.new(12, 'parent', 'tree') }
    let(:association) { mock(:association, :map => [1]) }

    it 'create the correct association sql' do
      subject.associations.sql.should ==
        "SELECT * FROM `associations` " +
        "INNER JOIN `relationships` ON (`relationships`.`association_id` = `associations`.`id`) " +
        "WHERE ((`ass_type` = 'tree') AND " +
          "(`item_id` = 12) AND " +
          "(`end_at` IS NULL) AND " +
          "(NOT `rel_type` = 'parent'))"
    end

    it 'create the correct items sql' do
      subject.stub(:associations => association)
      subject.items.sql.should ==
        "SELECT * FROM `items` " +
        "INNER JOIN `relationship` ON (`relationship`.`id` = `items`.`item_id`) " +
        "INNER JOIN `association` ON (`relationship`.`association_id` = `relationship`.`id`) " +
        "WHERE ((`associations`.`id` IN (1)) AND " +
          "(`rel_type` = 'parent') AND " +
          "(`ass_type` = 'tree'))"
    end
  end
end