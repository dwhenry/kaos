class CreateRelationships < ActiveRecord::Migration
  def change
    create_table :relationships do |t|
      t.references :item
      t.references :association
      t.string :rel_type

      t.timestamps
    end

    create_table :associations do |t|
      t.integer :start_at
      t.integer :end_at
      t.string :ass_type

      t.timestamps
    end
  end
end
