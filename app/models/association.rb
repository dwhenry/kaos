class Association < Sequel::Model
  one_to_one :parent,
          :class => :Relationship,
          :conditions => {:rel_type => 'parent'}

  one_to_one :child,
          :class => :Relationship,
          :conditions => {:rel_type => 'child'}

  one_to_many :relationships
end