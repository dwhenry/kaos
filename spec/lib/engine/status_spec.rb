require 'spec_helper'

describe Engine::Status do
  context 'defaults to nil values for field' do
    it 'name' do
      subject.name.should be_nil
    end

    it 'description' do
      subject.description.should be_nil
    end

    it 'id' do
      subject.id.should be_nil
    end
  end

  context 'can initialize with value for field' do
    subject { Engine::Status.new(:name => 'test', :description => 'test status', :id => 3) }

    it 'name' do
      subject.name.should == 'test'
    end

    it 'description' do
      subject.description.should == 'test status'
    end

    it 'id' do
      subject.id.should == 3
    end
  end

  context 'saving to items table' do
    let(:status) { Engine::Status.new(:name => 'test') }

    it 'when successful' do
      expect { status.save! }.to change{ Item.count }.by(1)
    end

    it 'when missing name field raises an error' do
      expect { subject.save! }.to raise_error(Engine::InvalidSave)
    end

    it 'sets the item type to status' do
      status.save!
      Item.first.item_type.should == 'status'
    end
  end
end