class Relationship < Sequel::Model
  many_to_one :item
  many_to_one :association

  validates_inclusion_of :rel_type, :in => ['parent', 'child']
end
