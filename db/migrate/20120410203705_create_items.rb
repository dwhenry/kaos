class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :item_type
      t.string :name
      t.text :description
      t.references :parent

      t.timestamps
    end
  end
end
